import { TwitterAPI } from "../../deps.ts"
import { User, SearchBan, SuggestionBan, ReplyBan } from "../../types/v2.ts"
import {
    GetSearchAdaptive,
    GetSearchTypehead,
    GetTweetDetail,
    GetUserByScreenName,
    GetUserTweets,
    GetUserTweetsAndReplies,
} from "../../types/v3/mod.ts"

export class V3 {
    private client: TwitterAPI

    constructor() {
        this.client = new TwitterAPI()
    }

    checkUser = async (screenName: string): Promise<User> => {
        try {
            const getUser = new GetUserByScreenName(this.client)
            const targetUser = await getUser.get({
                screen_name: screenName,
            })

            if (targetUser.data.user) {
                return {
                    screenName: targetUser.data.user!.result.legacy.screen_name,
                    exists: true,
                    restId: targetUser.data.user!.result.rest_id,
                    protected: targetUser.data.user!.result.legacy.protected,
                    hasTweets: targetUser.data.user!.result.legacy.statuses_count > 1,
                }
            } else {
                return {
                    screenName: screenName,
                    exists: false,
                }
            }
        } catch (error) {
            console.log(error)
            return {
                screenName: screenName,
                exists: false,
            }
        }
    }

    checkIsUserSuggestionBanned = async (screenName: string): Promise<SuggestionBan> => {
        try {
            const getSearchTypehead = new GetSearchTypehead(this.client)
            const searchResults = await getSearchTypehead.get({
                q: `@${screenName}`,
            })

            const isSuggestionBanned =
                searchResults.users.filter((user) => {
                    return user.screen_name.toLowerCase() === screenName.toLowerCase()
                }).length == 0
            return {
                screenName: screenName,
                banned: isSuggestionBanned,
            }
        } catch (error) {
            console.log(error)
            return {
                screenName: screenName,
                banned: false,
            }
        }
    }

    checkIsUserSearchBanned = async (screenName: string): Promise<SearchBan> => {
        try {
            const getUserByScreenName = new GetUserByScreenName(this.client)
            const targetUser = await getUserByScreenName.get({
                screen_name: screenName,
            })
            const restId = targetUser.data.user!.result.rest_id

            const getUserTweetsAndReplies = new GetUserTweetsAndReplies(this.client)
            const getSearchAdaptive = new GetSearchAdaptive(this.client)

            const [tweetsAndReplies, searchResults] = await Promise.all([
                getUserTweetsAndReplies.get({
                    userId: restId,
                    count: 500,
                }),
                getSearchAdaptive.get({
                    q: `from:@${screenName}`,
                    count: 5,
                    tweet_search_mode: "live",
                }),
            ])

            const expectedTweetIds =
                tweetsAndReplies.data.user.result.timeline_v2.timeline.instructions
                    .find((i) => i.type === "TimelineAddEntries")
                    ?.entries?.map((e) => e.content.itemContent?.tweet_results.result)
                    .filter((r) => r?.legacy.retweeted_status_result === undefined)
                    .map((r) => r?.legacy.id_str)
                    .filter((id) => id !== undefined) ?? []

            if (expectedTweetIds.length === 0) {
                // could not determine if user is search banned
                return {
                    screenName: screenName,
                    banned: false,
                }
            }

            const actualTweetIds = Object.keys(searchResults.globalObjects.tweets)

            const latestTweetId = expectedTweetIds[0]

            if (latestTweetId == undefined) {
                return {
                    screenName: screenName,
                    banned: false,
                }
            }

            const isSearchBanned = !actualTweetIds.includes(latestTweetId)

            return {
                screenName: screenName,
                banned: isSearchBanned,
            }
        } catch (error) {
            console.log(error)
            return {
                screenName: screenName,
                banned: false,
            }
        }
    }

    checkIsUserReplyBanned = async (restId: string): Promise<ReplyBan> => {
        try {
            const getUserTweetsAndReplies = new GetUserTweetsAndReplies(this.client)
            const tweetsAndReplies = await getUserTweetsAndReplies.get({
                userId: restId,
                count: 500,
            })

            const replies = tweetsAndReplies.data.user.result.timeline_v2.timeline.instructions
                .flatMap((instruction) => {
                    return instruction.entries
                })
                .filter((entry) => {
                    return entry?.content.itemContent?.tweetDisplayType === "Tweet"
                })
                .map((tweet) => {
                    return tweet?.content.itemContent?.tweet_results
                })
                .map((tweetResult) => {
                    if (tweetResult?.result.legacy?.in_reply_to_screen_name) {
                        return tweetResult
                    }
                })

            const replySourceTweetIds = replies
                .map((reply) => {
                    return {
                        user: reply?.result.legacy?.in_reply_to_screen_name,
                        tweet: reply?.result.legacy?.in_reply_to_status_id_str,
                    }
                })
                .filter((reply) => {
                    return reply?.user && reply?.tweet
                })

            const targetReplyTweet = replies
                .filter((reply) => {
                    return reply ? true : false
                })
                .map((t) => {
                    return t?.result.legacy.id_str
                })

            if (targetReplyTweet.length === 0) {
                return {
                    restId: restId,
                    recognizable: false,
                }
            }

            const replyTreeInstruction = await (async () => {
                for (let i = 0; i < 10; i++) {
                    try {
                        const targetReplyTweetSource = replySourceTweetIds[i]

                        if (!targetReplyTweetSource.tweet) {
                            continue
                        }

                        const getTweetDetail = new GetTweetDetail(this.client)

                        const tweetDetail = await getTweetDetail.get({
                            focalTweetId: targetReplyTweetSource.tweet,
                        })

                        const replyTreeInstruction =
                            tweetDetail.data?.threaded_conversation_with_injections_v2?.instructions

                        if (!replyTreeInstruction) {
                            continue
                        }

                        return replyTreeInstruction
                    } catch (error) {
                        console.log(error)
                        continue
                    }
                }
                return null
            })()

            if (!replyTreeInstruction) {
                return {
                    restId: restId,
                    recognizable: false,
                }
            }

            const filteredReplyTree = replyTreeInstruction
                .flatMap((instruction) => {
                    return instruction.entries
                })
                .flatMap((entry) => {
                    return entry?.content.itemContent?.tweet_results?.result.legacy
                })
                .filter((reply) => {
                    return targetReplyTweet.includes(reply?.id_str)
                })

            if (filteredReplyTree.length === 0) {
                const cursors = replyTreeInstruction
                    .flatMap((instruction) => {
                        return instruction.entries
                    })
                    .flatMap((entry) => {
                        return entry?.content.itemContent?.itemType === "TimelineTimelineCursor"
                    })
                    .filter((cursor) => {
                        return cursor
                    })

                if (cursors.length === 0) {
                    // ghost banned
                    return {
                        restId: restId,
                        recognizable: true,
                        ghostBanned: true,
                        replyDeboosting: false,
                    }
                } else {
                    // maybe reply deboosting
                    return {
                        restId: restId,
                        recognizable: true,
                        ghostBanned: false,
                        replyDeboosting: true,
                    }
                }
            } else {
                // not banned
                return {
                    restId: restId,
                    recognizable: true,
                    ghostBanned: false,
                    replyDeboosting: false,
                }
            }
        } catch (error) {
            console.log(error)
            throw {
                message: "Unknown error",
            }
        }
    }
}

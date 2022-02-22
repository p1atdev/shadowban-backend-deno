import {
    getUserTweetsAndReplies,
    getUserByScreenName,
    getTweetDetail,
    getSearchTypehead,
    getSearchAdaptive,
    getGuestToken,
    getQueryIds,
} from "https://deno.land/x/twitterql@0.1.2/src/twitter/mod.ts"
import { Query } from "https://deno.land/x/twitterql@0.1.2/src/types/mod.ts"
import { User, SearchBan, SuggestionBan, ReplyBan } from "../../types/v2.ts"

export async function checkUser(screenName: string): Promise<User> {
    try {
        const guestToken = await getGuestToken()
        const queries = await getQueryIds()
        const targetUser = await getUserByScreenName(
            {
                screen_name: screenName,
            },
            guestToken,
            queries
        )

        if (targetUser.data.user) {
            return {
                screenName: targetUser.data.user!.result.legacy.screen_name,
                exists: true,
                restId: targetUser.data.user!.result.rest_id,
                protected: targetUser.data.user!.result.legacy.protected,
                hasTweets: targetUser.data.user!.result.legacy.statuses_count > 1,
                guestToken: guestToken,
                queries: queries,
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

export async function checkIsUserSuggestionBanned(screenName: string, guestToken?: string): Promise<SuggestionBan> {
    try {
        const searchResults = await getSearchTypehead(
            {
                q: `@${screenName}`,
            },
            guestToken
        )

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

export async function checkIsUserSearchBanned(screenName: string, guestToken?: string): Promise<SearchBan> {
    try {
        const searchResults = await getSearchAdaptive(
            {
                q: `from:@${screenName}`,
                count: 5,
            },
            guestToken
        )

        const isSearchBanned =
            searchResults.globalObjects.constructor === Object &&
            Object.keys(searchResults.globalObjects.tweets).length == 0

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

export async function checkIsUserReplyBanned(
    restId: string,
    guestToken?: string,
    queries?: Query[]
): Promise<ReplyBan> {
    try {
        const tweetsAndReplies = await getUserTweetsAndReplies(
            {
                userId: restId,
                count: 500,
            },
            guestToken,
            queries
        )

        const replies = tweetsAndReplies.data.user.result.timeline.timeline.instructions
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
                if (tweetResult?.result.legacy.in_reply_to_screen_name) {
                    return tweetResult
                }
            })

        const replySourceTweetIds = replies
            .map((reply) => {
                return {
                    user: reply?.result.legacy.in_reply_to_screen_name,
                    tweet: reply?.result.legacy.in_reply_to_status_id_str,
                }
            })
            .filter((reply) => {
                return reply?.user && reply?.tweet
            })

        const targetReplyTweet = replies.find((reply) => {
            return reply ? true : false
        })?.result.legacy.id_str

        if (!targetReplyTweet) {
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

                    const tweetDetail = await getTweetDetail(
                        {
                            focalTweetId: targetReplyTweetSource.tweet,
                        },
                        guestToken,
                        queries
                    )

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
                return entry?.content.items?.map((item) => {
                    return item.item.itemContent.tweet_results?.result.legacy
                })
            })
            .filter((reply) => {
                return reply?.id_str === targetReplyTweet
            })

        if (filteredReplyTree.length === 0) {
            const cursors = replyTreeInstruction
                .flatMap((instruction) => {
                    return instruction.entries
                })
                .flatMap((entry) => {
                    return entry?.content.items?.filter((item) => {
                        return item.item.itemContent.itemType === "TimelineTimelineCursor"
                    })
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

import {
    getUserTweetsAndReplies,
    getUserByScreenName,
    getTweetDetail,
    getSearchTypehead,
    getSearchAdaptive,
} from "https://deno.land/x/twitterql@0.1.1/src/twitter/mod.ts"
import { User } from "./types/v1.ts"

export async function checkUser(screenName: string): Promise<User> {
    try {
        const targetUser = await getUserByScreenName({
            screen_name: screenName,
        })

        if (targetUser.data.user) {
            return {
                screenName: screenName,
                exists: true,
                restId: targetUser.data.user!.result.rest_id,
                protected: targetUser.data.user!.result.legacy.protected,
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

export async function checkIsUserSuggestionBanned(screenName: string): Promise<boolean | null> {
    try {
        const searchResults = await getSearchTypehead({
            q: `@${screenName}`,
            result_type: "users",
        })

        return searchResults.users.length == 0
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function checkIsUserSearchBanned(screenName: string): Promise<boolean | null> {
    try {
        const searchResults = await getSearchAdaptive({
            q: `@${screenName}`,
            count: 1,
        })

        console.log("isObject:", searchResults.globalObjects.constructor === Object)
        console.log("isEmpty:", Object.keys(searchResults.globalObjects.tweets).length != 0)

        return (
            searchResults.globalObjects.constructor === Object &&
            Object.keys(searchResults.globalObjects.tweets).length != 0
        )
    } catch (error) {
        console.log(error)
        return null
    }
}

export enum ReplyBanResult {
    NotExist,
    Unrecognizable,
    NotBanned,
    UnknownError,
    GhostBanned,
    ReplyDeboosting,
}

export async function checkIsUserReplyBanned(restId: string): Promise<ReplyBanResult> {
    try {
        const tweetsAndReplies = await getUserTweetsAndReplies({
            userId: restId,
            count: 500,
        })

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
            return ReplyBanResult.Unrecognizable
        }

        const replyTreeInstruction = await (async () => {
            for (let i = 0; i < 10; i++) {
                try {
                    const targetReplyTweetSource = replySourceTweetIds[i]

                    if (!targetReplyTweetSource.tweet) {
                        continue
                    }

                    const tweetDetail = await getTweetDetail({
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
            return ReplyBanResult.Unrecognizable
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
                return ReplyBanResult.GhostBanned
            } else {
                // maybe reply deboosting
                return ReplyBanResult.ReplyDeboosting
            }
        } else {
            return ReplyBanResult.NotBanned
        }
    } catch (error) {
        console.log(error)
        return ReplyBanResult.UnknownError
    }
}

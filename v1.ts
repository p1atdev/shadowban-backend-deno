import {
    getUserTweetsAndReplies,
    getUserByScreenName,
    getTweetDetail,
    getSearchTypehead,
} from "https://deno.land/x/twitterql@0.0.15/src/twitter/mod.ts"

export async function checkIsUserExist(screenName: string): Promise<string | null> {
    const targetUser = await getUserByScreenName({
        screen_name: screenName,
    })

    if (targetUser.data.user) {
        return targetUser.data.user!.result.rest_id
    } else {
        return null
    }
}

export async function checkIsUserSuggestionBanned(screenName: string): Promise<boolean> {
    const searchResults = await getSearchTypehead({
        q: `@${screenName}`,
        result_type: "users",
    })

    return searchResults.users.length != 0
}

export enum GhostBanResult {
    NotExist,
    Unrecognizable,
    NotBanned,
    UnknownError,
    Banned,
}

export async function checkIsUserGhostBanned(restId: string): Promise<GhostBanResult> {
    try {
        const tweetsAndReplies = await getUserTweetsAndReplies({
            userId: restId,
            count: 100,
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
            return GhostBanResult.Unrecognizable
        }

        const targetReplyTweetSource = replySourceTweetIds[0]

        if (!targetReplyTweetSource.tweet) {
            return GhostBanResult.UnknownError
        }

        const tweetDetail = await getTweetDetail({
            focalTweetId: targetReplyTweetSource.tweet,
        })

        const replyTreeInstruction = tweetDetail.data!.threaded_conversation_with_injections_v2!.instructions

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
            return GhostBanResult.Banned
        } else {
            return GhostBanResult.NotBanned
        }
    } catch (error) {
        console.log(error)
        return GhostBanResult.UnknownError
    }
}

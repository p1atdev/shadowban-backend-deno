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

export async function checkIsUserInSearchResults(screenName: string): Promise<boolean> {
    const searchResults = await getSearchTypehead({
        q: `@${screenName}`,
        result_type: "users",
    })

    return searchResults.users.length != 0
}

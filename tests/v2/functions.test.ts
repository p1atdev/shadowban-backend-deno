import {
    checkUser,
    checkIsUserReplyBanned,
    checkIsUserSearchBanned,
    checkIsUserSuggestionBanned,
} from "../../src/functions/v2.ts"
import { User } from "../../types/v2.ts"
import { getUserByScreenName } from "https://deno.land/x/twitterql@0.1.2/src/twitter/mod.ts"
import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts"

const NOT_EXIST_USER_NAME = "NOT_EXIST_USER_NAME"

Deno.test("checkUser() expected to exist", async () => {
    const user = await checkUser("twitter")
    const expected: User = {
        screenName: "Twitter",
        hasTweets: true,
        exists: true,
        restId: "783214",
        protected: false,
    }

    assertEquals(
        {
            screenName: user.screenName,
            hasTweets: user.hasTweets,
            exists: user.exists,
            restId: user.restId,
            protected: user.protected,
        },
        expected
    )

    assertNotEquals(user.queries?.length, 0)
})

Deno.test("checkUser() expected not to exist", async () => {
    const user = await checkUser(NOT_EXIST_USER_NAME)
    const expected: User = {
        screenName: NOT_EXIST_USER_NAME,
        exists: false,
    }
    assertEquals(user, expected)
})

Deno.test("checkIsSuggestionBanned() expected not to be banned", async () => {
    const user = await checkIsUserSuggestionBanned("twitter")
    const expected = {
        banned: false,
        screenName: "twitter",
    }
    assertEquals(user, expected)
})

Deno.test("checkIsSuggestionBanned() expected to be banned", async () => {
    const user = await checkIsUserSuggestionBanned("RyodayooWW")
    const expected = {
        banned: true,
        screenName: "RyodayooWW",
    }
    assertEquals(user, expected)
})

Deno.test("checkIsUserSearchBanned() expected not to be banned", async () => {
    const user = await checkIsUserSearchBanned("twitter")
    const expected = {
        banned: false,
        screenName: "twitter",
    }
    assertEquals(user, expected)
})

Deno.test("checkIsUserSearchBanned() expected to be banned", async () => {
    const user = await checkIsUserSearchBanned("RyodayooWW")
    const expected = {
        banned: true,
        screenName: "RyodayooWW",
    }
    assertEquals(user, expected)
})

Deno.test("checkIsReplyBanned() expected not to be banned", async () => {
    const restId = "783214"
    const user = await checkIsUserReplyBanned(restId)
    const expected = {
        restId: "783214",
        recognizable: true,
        ghostBanned: false,
        replyDeboosting: false,
    }
    assertEquals(user, expected)
})

Deno.test("checkIsReplyBanned() expected to be banned", async () => {
    const restId = (
        await getUserByScreenName({
            screen_name: "RyodayooWW",
        })
    ).data.user!.result.rest_id
    const user = await checkIsUserReplyBanned(restId)
    const expected = {
        ghostBanned: false,
        recognizable: true,
        replyDeboosting: true,
        restId: "1289294626268971008",
    }
    assertEquals(user, expected)
})

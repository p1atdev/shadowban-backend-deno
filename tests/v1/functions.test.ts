import {
    checkUser,
    checkIsUserReplyBanned,
    checkIsUserSearchBanned,
    checkIsUserSuggestionBanned,
} from "../../src/functions/v1.ts"
import { User } from "../../types/v1.ts"
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"

const NOT_EXIST_USER_NAME = "NOT_EXIST_USER_NAME"

Deno.test("checkUser() expected not to exist", async () => {
    const user = await checkUser("twitter")
    const expected: User = {
        screenName: "twitter",
        hasTweets: true,
        exists: true,
        restId: "783214",
        protected: false,
    }
    assertEquals(user, expected)
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
    const expected = false
    assertEquals(user, expected)
})

Deno.test("checkIsSuggestionBanned() expected to be banned", async () => {
    const user = await checkIsUserSuggestionBanned("RyodayooWW")
    const expected = true
    assertEquals(user, expected)
})

Deno.test("checkIsUserSearchBanned() expected not to be banned", async () => {
    const user = await checkIsUserSuggestionBanned("twitter")
    const expected = false
    assertEquals(user, expected)
})

Deno.test("checkIsUserSearchBanned() expected to be banned", async () => {
    const user = await checkIsUserSuggestionBanned("RyodayooWW")
    const expected = true
    // console.log(user)
    assertEquals(user, expected)
})

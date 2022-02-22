import { User, SuggestionBan, SearchBan, ReplyBan } from "../../types/v2.ts"
import { getUserByScreenName, getQueryIds, getGuestToken } from "https://deno.land/x/twitterql@0.1.2/src/twitter/mod.ts"
import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts"

const NOT_EXIST_USER_NAME = "NOT_EXIST_USER_NAME"

const API_URL = "http://localhost:80"

const guestToken = await getGuestToken()
const queries = await getQueryIds()

Deno.test("/v2/user expected to exist", async () => {
    const res = await fetch(API_URL + "/v2/user", {
        method: "POST",
        body: JSON.stringify({
            screenName: "twitter",
        }),
    })
    const body = await res.json()
    const expected: User = {
        screenName: "Twitter",
        hasTweets: true,
        exists: true,
        restId: "783214",
        protected: false,
    }
    assertEquals(
        {
            screenName: body.screenName,
            hasTweets: body.hasTweets,
            exists: body.exists,
            restId: body.restId,
            protected: body.protected,
        },
        expected
    )

    assertNotEquals(body.queries.length, 0)
})

Deno.test("/v2/user expected not to exist", async () => {
    const res = await fetch(API_URL + "/v2/user", {
        method: "POST",
        body: JSON.stringify({
            screenName: NOT_EXIST_USER_NAME,
        }),
    })
    const body = await res.json()
    const expected: User = {
        screenName: NOT_EXIST_USER_NAME,
        exists: false,
    }
    assertEquals(body, expected)
})

Deno.test("/v2/suggestion_ban expected not to be banned", async () => {
    const res = await fetch(API_URL + "/v2/suggestion_ban", {
        method: "POST",
        body: JSON.stringify({
            screenName: "twitter",
        }),
    })
    const body = await res.json()
    const expected: SuggestionBan = {
        banned: false,
        screenName: "twitter",
    }
    assertEquals(body, expected)
})

Deno.test("/v2/suggestion_ban expected to be banned", async () => {
    const res = await fetch(API_URL + "/v2/suggestion_ban", {
        method: "POST",
        body: JSON.stringify({
            screenName: "RyodayooWW",
        }),
    })
    const body = await res.json()
    const expected: SuggestionBan = {
        banned: true,
        screenName: "RyodayooWW",
    }
    assertEquals(body, expected)
})

Deno.test("/v2/search_ban expected not to be banned", async () => {
    const res = await fetch(API_URL + "/v2/search_ban", {
        method: "POST",
        body: JSON.stringify({
            screenName: "twitter",
        }),
    })
    const body = await res.json()
    const expected: SearchBan = {
        banned: false,
        screenName: "twitter",
    }
    assertEquals(body, expected)
})

Deno.test("/v2/search_ban  expected to be banned", async () => {
    const res = await fetch(API_URL + "/v2/search_ban", {
        method: "POST",
        body: JSON.stringify({
            screenName: "ryodayooWW",
        }),
    })
    const body = await res.json()
    const expected: SearchBan = {
        banned: true,
        screenName: "ryodayooWW",
    }
    assertEquals(body, expected)
})

Deno.test("/v2/reply_ban expected not to be banned (slow)", async () => {
    const restId = "783214"
    const res = await fetch(API_URL + "/v2/reply_ban", {
        method: "POST",
        body: JSON.stringify({
            restId: restId,
        }),
    })
    const body = await res.json()
    const expected: ReplyBan = {
        restId: "783214",
        recognizable: true,
        ghostBanned: false,
        replyDeboosting: false,
    }
    assertEquals(body, expected)
})

Deno.test("/v2/reply_ban expected to be banned (slow)", async () => {
    const restId = (
        await getUserByScreenName({
            screen_name: "RyodayooWW",
        })
    ).data.user!.result.rest_id
    const res = await fetch(API_URL + "/v2/reply_ban", {
        method: "POST",
        body: JSON.stringify({
            restId: restId,
        }),
    })
    const body = await res.json()
    const expected: ReplyBan = {
        ghostBanned: false,
        recognizable: true,
        replyDeboosting: true,
        restId: "1289294626268971008",
    }
    assertEquals(body, expected)
})

Deno.test("/v2/reply_ban expected not to be banned (fast)", async () => {
    const restId = "783214"
    const res = await fetch(API_URL + "/v2/reply_ban", {
        method: "POST",
        body: JSON.stringify({
            restId: restId,
            guestToken: guestToken,
            queries: queries,
        }),
    })
    const body = await res.json()
    const expected: ReplyBan = {
        restId: "783214",
        recognizable: true,
        ghostBanned: false,
        replyDeboosting: false,
    }
    assertEquals(body, expected)
})

Deno.test("/v2/reply_ban expected to be banned (fast)", async () => {
    const restId = (
        await getUserByScreenName({
            screen_name: "RyodayooWW",
        })
    ).data.user!.result.rest_id
    const res = await fetch(API_URL + "/v2/reply_ban", {
        method: "POST",
        body: JSON.stringify({
            restId: restId,
            guestToken: guestToken,
            queries: queries,
        }),
    })
    const body = await res.json()
    const expected: ReplyBan = {
        ghostBanned: false,
        recognizable: true,
        replyDeboosting: true,
        restId: "1289294626268971008",
    }
    assertEquals(body, expected)
})

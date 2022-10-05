import { User, SuggestionBan, SearchBan, ReplyBan } from "../../types/v2.ts"
import { assertEquals, assertNotEquals } from "../../deps.ts"

const NOT_EXIST_USER_NAME = "NOT_EXIST_USER_NAME"

const API_URL = "http://localhost:8000"

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
            screenName: "discord_jp",
        }),
    })
    const body = await res.json()
    const expected: SearchBan = {
        banned: false,
        screenName: "discord_jp",
    }
    assertEquals(body, expected)
})

Deno.test("/v2/search_ban expected to be banned", async () => {
    const res = await fetch(API_URL + "/v2/search_ban", {
        method: "POST",
        body: JSON.stringify({
            screenName: "Larry_smtore",
        }),
    })
    const body = await res.json()
    const expected: SearchBan = {
        banned: true,
        screenName: "Larry_smtore",
    }
    assertEquals(body, expected)
})

Deno.test("/v2/reply_ban expected not to be banned (slow)", async () => {
    const restId = "1090789616334958592"
    const res = await fetch(API_URL + "/v2/reply_ban", {
        method: "POST",
        body: JSON.stringify({
            restId: restId,
        }),
    })
    const body = await res.json()
    const expected: ReplyBan = {
        restId: "1090789616334958592",
        recognizable: true,
        ghostBanned: false,
        replyDeboosting: false,
    }
    assertEquals(body, expected)
})

Deno.test("/v2/reply_ban expected to be banned (slow)", async () => {
    const restId = "1289294626268971008"
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
    const restId = "1569329809666482176"
    const res = await fetch(API_URL + "/v2/reply_ban", {
        method: "POST",
        body: JSON.stringify({
            restId: restId,
        }),
    })
    const body = await res.json()
    const expected: ReplyBan = {
        restId: "1569329809666482176",
        recognizable: true,
        ghostBanned: false,
        replyDeboosting: false,
    }
    assertEquals(body, expected)
})

Deno.test("/v2/reply_ban expected to be banned (fast)", async () => {
    const restId = "1289294626268971008"
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

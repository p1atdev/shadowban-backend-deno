import { TwitterAPI, assertExists, assertEquals, assertNotEquals } from "../../deps.ts"
import {
    GetUserByScreenName,
    GetUserTweetsAndReplies,
    GetTweetDetail,
    GetSearchTypehead,
    GetSearchAdaptive,
} from "../../types/v3/mod.ts"

const client = new TwitterAPI()

const twitterRestId = "783214"

Deno.test("get user by screen name", async () => {
    const getUserByScreenName = new GetUserByScreenName(client)
    const res = await getUserByScreenName.get({
        screen_name: "Twitter",
        withSafetyModeUserFields: false,
        withSuperFollowsUserFields: false,
    })

    assertExists(res.data.user.result.id)
    assertEquals(res.data.user.result.rest_id, twitterRestId)
})

Deno.test("get user tweet and replies", async () => {
    const getUserTweetsAndReplies = new GetUserTweetsAndReplies(client)
    const res = await getUserTweetsAndReplies.get({
        userId: twitterRestId,
        count: 20,
    })

    assertExists(res.data.user.result.timeline_v2.timeline.instructions.find((i) => i.type === "TimelineAddEntries"))
})

Deno.test("get tweet detail", async () => {
    const getTweetDetail = new GetTweetDetail(client)
    const res = await getTweetDetail.get({
        focalTweetId: "1576853741206065153",
    })

    assertExists(
        res.data.threaded_conversation_with_injections_v2.instructions.find((i) => i.type === "TimelineAddEntries")
    )
})

Deno.test("search typehead", async () => {
    const getSearchTypehead = new GetSearchTypehead(client)
    const res = await getSearchTypehead.get({
        q: "@Twitter",
    })

    assertExists(res.users.find((u) => u.id_str === twitterRestId))
})

Deno.test("search adaptive", async () => {
    const getSearchAdaptive = new GetSearchAdaptive(client)
    const res = await getSearchAdaptive.get({
        q: "from:@Twitter",
        count: 20,
    })

    assertNotEquals(Object.values(res.globalObjects.tweets).length, 0)
})

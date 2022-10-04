import { serve, hono, h, Status } from "../../deps.ts"
import { V3 } from "../functions/v3.ts"

type ReqContext = h.Context<string, hono.Environment, hono.ValidatedData>

export class Server {
    app = new hono.Hono()
    client = new V3()

    constructor() {
        this.app.get("/v2/status", this.status)
        this.app.post("/v2/user", this.user)
        this.app.post("/v2/suggestion_ban", this.suggestion_ban)
        this.app.post("/v2/search_ban", this.search_ban)
        this.app.post("/v2/reply_ban", this.reply_ban)
    }

    start() {
        serve(this.app.fetch)
    }

    private status = (c: ReqContext) => {
        return c.json({
            message: "Running",
            status: "ok",
            available: true,
        })
    }

    private user = async (c: ReqContext) => {
        const reqJson = await c.req.json()

        const screenName = reqJson.screenName

        console.log(`[v2/user] screenName: ${screenName}`)

        if (!screenName) {
            c.status(Status.BadRequest)
            return c.text("Missing screenName")
        }

        try {
            const userStatus = await this.client.checkUser(screenName)

            console.log(`[v2/user] userStatus: ${JSON.stringify(userStatus)}`)

            return c.json(userStatus)
        } catch (error) {
            return c.json(error, Status.InternalServerError)
        }
    }

    private suggestion_ban = async (c: ReqContext) => {
        const reqJson = await c.req.json()

        const screenName = reqJson.screenName

        console.log(`[v2/suggestion_ban] screenName: ${screenName}`)

        if (!screenName) {
            c.status(Status.BadRequest)
            return c.text("Missing screenName")
        }

        try {
            const suggestionBanStatus = await this.client.checkIsUserSuggestionBanned(screenName)

            return c.json(suggestionBanStatus)
        } catch (error) {
            return c.json(error, Status.InternalServerError)
        }
    }

    private search_ban = async (c: ReqContext) => {
        const reqJson = await c.req.json()

        const screenName = reqJson.screenName

        console.log(`[v2/search_ban] screenName: ${screenName}`)

        if (!screenName) {
            c.status(Status.BadRequest)
            return c.text("Missing screenName")
        }

        try {
            const searchBanStatus = await this.client.checkIsUserSearchBanned(screenName)

            console.log(`[v2/search_ban] searchBanStatus: ${JSON.stringify(searchBanStatus)}`)

            return c.json(searchBanStatus)
        } catch (error) {
            return c.json(error, Status.InternalServerError)
        }
    }

    private reply_ban = async (c: ReqContext) => {
        const reqJson = await c.req.json()

        const restId = reqJson.restId

        console.log(`[v2/reply_ban] restId: ${restId}`)

        if (!restId) {
            c.status(Status.BadRequest)
            return c.text("Missing restId")
        }

        try {
            const replyBanStatus = await this.client.checkIsUserReplyBanned(restId)

            console.log(`[v2/reply_ban] replyBanStatus: ${JSON.stringify(replyBanStatus)}`)

            return c.json(replyBanStatus)
        } catch (error) {
            return c.json(error, Status.InternalServerError)
        }
    }
}

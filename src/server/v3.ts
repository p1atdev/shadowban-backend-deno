import { serve, hono, h, STATUS_TEXT, Status } from "../../deps.ts"
import { V3 } from "../functions/v3.ts"

type ReqContext = h.Context<string, hono.Environment, hono.ValidatedData>

export class Server {
    app = new hono.Hono()
    client = new V3()

    constructor() {
        this.app.get("/v2/status", this.status)
        this.app.get("/v2/user", this.user)
        this.app.get("/v2/suggestion_ban", this.suggestion_ban)
        this.app.get("/v2/search_ban", this.search_ban)
        this.app.get("/v2/reply_ban", this.reply_ban)
    }

    start() {
        serve(this.app.fetch)
    }

    private status = (c: ReqContext) => {
        const check = this.checkMethod(c.req, "GET")
        if (check) {
            c.status(Status.BadRequest)
            return c.text(check)
        }

        return c.json({
            message: "Running",
            status: "ok",
            available: true,
        })
    }

    private user = async (c: ReqContext) => {
        const check = this.checkMethod(c.req, "POST")
        if (check) {
            c.status(Status.BadRequest)
            return c.text(check)
        }

        const reqJson = await c.req.json()

        const screenName = reqJson.screenName

        if (!screenName) {
            c.status(Status.BadRequest)
            return c.text("Missing screenName")
        }

        const userStatus = await this.client.checkUser(screenName)

        const body = JSON.stringify(userStatus)
        return c.json(body, Status.OK)
    }

    private suggestion_ban = async (c: ReqContext) => {
        const check = this.checkMethod(c.req, "POST")
        if (check) {
            c.status(Status.BadRequest)
            return c.text(check)
        }

        const reqJson = await c.req.json()

        const screenName = reqJson.screenName

        if (!screenName) {
            c.status(Status.BadRequest)
            return c.text("Missing screenName")
        }

        const suggestionBanStatus = await this.client.checkIsUserSuggestionBanned(screenName)

        const body = JSON.stringify(suggestionBanStatus)

        return c.json(body)
    }

    private search_ban = async (c: ReqContext) => {
        const check = this.checkMethod(c.req, "POST")
        if (check) {
            c.status(Status.BadRequest)
            return c.text(check)
        }

        const reqJson = await c.req.json()

        const screenName = reqJson.screenName

        if (!screenName) {
            c.status(Status.BadRequest)
            return c.text("Missing screenName")
        }

        const searchBanStatus = await this.client.checkIsUserSearchBanned(screenName)

        const body = JSON.stringify(searchBanStatus)

        return c.json(body)
    }

    private reply_ban = async (c: ReqContext) => {
        const check = this.checkMethod(c.req, "POST")
        if (check) {
            c.status(Status.BadRequest)
            return c.text(check)
        }

        const reqJson = await c.req.json()

        const restId = reqJson.restId

        if (!restId) {
            c.status(Status.BadRequest)
            return c.text("Missing restId")
        }

        try {
            const replyBanStatus = await this.client.checkIsUserReplyBanned(restId)

            const body = JSON.stringify(replyBanStatus)

            return c.json(body)
        } catch (error) {
            const res = c.json(error, Status.BadRequest)
            console.log(res)
            return res
        }
    }

    /**
     * Check request method
     * @param req Request
     * @param allow Allowed method
     * @returns Return error response if method is not allowed
     */
    private checkMethod = (req: Request, allow: string): string | null => {
        if (req.method !== allow) {
            return "BAD REQUEST"
        } else {
            return null
        }
    }
}

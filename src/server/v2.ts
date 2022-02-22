import { serve } from "https://deno.land/std@0.125.0/http/server.ts"
import { Status, STATUS_TEXT } from "https://deno.land/std@0.125.0/http/http_status.ts"
import {
    checkUser,
    checkIsUserSuggestionBanned,
    checkIsUserReplyBanned,
    checkIsUserSearchBanned,
} from "../functions/v2.ts"

// サーバー立てる
serve(handler, { port: 80 })

console.log("shadowban-backend-deno v2 is listening on http://localhost:80/ !")

async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url)
    const path = url.pathname
    console.log("Path:", path)

    switch (path) {
        case "/": {
            return new Response("Hello, world!", {
                status: Status.OK,
                headers: new Headers({
                    "content-type": "text/plain",
                }),
            })
        }

        case "/docs": {
            const html = await Deno.readFile("./docs/index.html")
            const res = new Response(html, {
                status: Status.OK,
                headers: new Headers({
                    "content-type": "text/html; charset=utf-8",
                }),
            })
            return res
        }

        case "/v2/status": {
            const check = checkMethod(req, "GET")
            if (check) {
                return check
            }

            return successResponse(
                JSON.stringify({
                    message: "Running",
                    status: "ok",
                    available: true,
                })
            )
        }

        case "/v2/user": {
            const check = checkMethod(req, "POST")
            if (check) {
                return check
            }

            const reqJson = await req.json()

            const screenName = reqJson.screenName

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const userStatus = await checkUser(screenName)

            const body = JSON.stringify(userStatus)
            return successResponse(body)
        }

        case "/v2/suggestion_ban": {
            const check = checkMethod(req, "POST")
            if (check) {
                console.log(check)
                return check
            }

            const reqJson = await req.json()

            const screenName = reqJson.screenName

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const suggestionBanStatus = await checkIsUserSuggestionBanned(screenName)

            const body = JSON.stringify(suggestionBanStatus)

            return successResponse(body)
        }

        case "/v2/search_ban": {
            const check = checkMethod(req, "POST")
            if (check) {
                console.log(check)
                return check
            }

            const reqJson = await req.json()

            const screenName = reqJson.screenName

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const searchBanStatus = await checkIsUserSearchBanned(screenName)

            // console.log(searchBanStatus)

            const body = JSON.stringify(searchBanStatus)

            return successResponse(body)
        }

        case "/v2/reply_ban": {
            const check = checkMethod(req, "POST")
            if (check) {
                console.log(check)
                return check
            }

            const reqJson = await req.json()

            const restId = reqJson.restId

            if (!restId) {
                return errorMessage(Status.BadRequest)
            }

            const guestToken = reqJson.guestToken
            const queries = reqJson.queries

            try {
                const replyBanStatus = await checkIsUserReplyBanned(restId, guestToken, queries)

                const body = JSON.stringify(replyBanStatus)

                return new Response(body, {
                    status: Status.OK,
                    headers: new Headers({
                        "content-type": "application/json",
                    }),
                })
            } catch (error) {
                const res = new Response(error, {
                    status: Status.InternalServerError,
                    headers: new Headers({
                        "content-type": "application/json: charset=utf-8",
                    }),
                })
                console.log(res)
                return res
            }
        }

        default: {
            const body = JSON.stringify({ message: "NOT FOUND" })
            const res = new Response(body, {
                status: 404,
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
            })
            console.log(res)
            return res
        }
    }
}

/**
 * Check request method
 * @param req Request
 * @param allow Allowed method
 * @returns Return error response if method is not allowed
 */
function checkMethod(req: Request, allow: string): Response | null {
    if (req.method !== allow) {
        const body = JSON.stringify({ message: STATUS_TEXT.get(Status.MethodNotAllowed) })
        const res = new Response(body, {
            status: Status.MethodNotAllowed,
            headers: new Headers({
                "content-type": "application/json",
            }),
        })
        // console.log(res.body)
        return res
    } else {
        return null
    }
}

// parameter error message
function errorMessage(code: number): Response {
    const body = JSON.stringify({ message: STATUS_TEXT.get(code) })
    const res = new Response(body, {
        status: code,
        headers: new Headers({
            "content-type": "application/json; charset=utf-8",
        }),
    })
    console.log(body)
    return res
}

function successResponse(body: string): Response {
    const res = new Response(body, {
        status: Status.OK,
        headers: new Headers({
            "content-type": "application/json; charset=utf-8",
        }),
    })
    console.log(body)
    return res
}

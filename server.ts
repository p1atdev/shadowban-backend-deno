import { serve } from "https://deno.land/std@0.125.0/http/server.ts"
import { Status, STATUS_TEXT } from "https://deno.land/std@0.125.0/http/http_status.ts"
import {
    checkUser,
    checkIsUserSuggestionBanned,
    checkIsUserReplyBanned,
    ReplyBanResult,
    checkIsUserSearchBanned,
} from "./v1.ts"

// サーバー立てる
serve(handler, { port: 80 })

console.log("http://localhost:80/")

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

        case "/v1/user": {
            const check = checkMethod(req, "GET")
            if (check) {
                return check
            }

            const screenName = url.searchParams.get("screenName")

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const user = await checkUser(screenName)

            const body = JSON.stringify({
                screenName: screenName,
                exists: user.exists,
                restId: user.restId,
                protected: user.protected,
            })
            return successResponse(body)
        }

        case "/v1/suggestion_ban": {
            const check = checkMethod(req, "GET")
            if (check) {
                console.log(check)
                return check
            }

            const screenName = url.searchParams.get("screenName")

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const isInSuggestion = await checkIsUserSuggestionBanned(screenName)

            const body = JSON.stringify({
                screenName: screenName,
                suggestionBanned: isInSuggestion,
            })

            return successResponse(body)
        }

        case "/v1/search_ban": {
            const check = checkMethod(req, "GET")
            if (check) {
                console.log(check)
                return check
            }

            const screenName = url.searchParams.get("screenName")

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const isUserSearchBanned = await checkIsUserSearchBanned(screenName)

            const body = JSON.stringify({
                screenName: screenName,
                searchBanned: isUserSearchBanned,
            })

            return successResponse(body)
        }

        case "/v1/reply_ban": {
            const check = checkMethod(req, "GET")
            if (check) {
                console.log(check)
                return check
            }

            const restId = url.searchParams.get("restId")

            if (!restId) {
                return errorMessage(Status.BadRequest)
            }

            const isUserInReplyTree = await checkIsUserReplyBanned(restId)
            switch (isUserInReplyTree) {
                case ReplyBanResult.NotExist: {
                    const body = JSON.stringify({
                        message: "Given restId is not exist",
                        restId: restId,
                    })
                    const res = new Response(body, {
                        status: Status.BadRequest,
                        headers: new Headers({
                            "content-type": "text/plain",
                        }),
                    })
                    console.log(res)
                    return res
                }
                case ReplyBanResult.GhostBanned: {
                    const body = JSON.stringify({
                        restId: restId,
                        ghostBanned: true,
                        replyDeboosting: false,
                    })
                    return successResponse(body)
                }
                case ReplyBanResult.ReplyDeboosting: {
                    const body = JSON.stringify({
                        restId: restId,
                        ghostBanned: false,
                        replyDeboosting: true,
                    })
                    return successResponse(body)
                }
                case ReplyBanResult.NotBanned: {
                    const body = JSON.stringify({
                        restId: restId,
                        ghostBanned: false,
                        replyDeboosting: false,
                    })
                    return successResponse(body)
                }
                case ReplyBanResult.UnknownError: {
                    const body = JSON.stringify({
                        message: "Unknown error",
                        restId: restId,
                    })
                    const res = new Response(body, {
                        status: Status.InternalServerError,
                        headers: new Headers({
                            "content-type": "application/json: charset=utf-8",
                        }),
                    })
                    console.log(res)
                    return res
                }
                case ReplyBanResult.Unrecognizable: {
                    const body = JSON.stringify({
                        message: "Unable to determine if ghost banned",
                        restId: restId,
                    })
                    const res = new Response(body, {
                        status: Status.InternalServerError,
                        headers: new Headers({
                            "content-type": "application/json: charset=utf-8",
                        }),
                    })
                    console.log(res)
                    return res
                }
                default: {
                    return errorMessage(Status.InternalServerError)
                }
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

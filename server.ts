import { serve } from "https://deno.land/std@0.125.0/http/server.ts"
import { Status, STATUS_TEXT } from "https://deno.land/std@0.125.0/http/http_status.ts"
import { checkIsUserExist, checkIsUserSuggestionBanned, checkIsUserGhostBanned, GhostBanResult } from "./v1.ts"

// サーバー立てる
serve(handler, { port: 80 })

console.log("http://localhost:80/")

async function handler(req: Request): Promise<Response> {
    // function handler(req: Request): Response {
    console.log("Method:", req.method)

    const url = new URL(req.url)
    const path = url.pathname
    console.log("Path:", path)
    // console.log("Query parameters:", url.searchParams)

    // console.log("Headers:", req.headers)

    switch (path) {
        case "/": {
            return new Response("Hello, world!", {
                status: Status.OK,
                headers: new Headers({
                    "content-type": "text/plain",
                }),
            })
        }

        case "/v1/exist": {
            const check = checkMethod(req, "GET")
            if (check) {
                return check
            }

            const screenName = url.searchParams.get("screenName")

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const isUserExist = await checkIsUserExist(screenName)

            if (isUserExist) {
                const body = JSON.stringify({
                    screenName: screenName,
                    restId: isUserExist,
                    exisit: true,
                })
                return successResponse(body)
            } else {
                const body = JSON.stringify({
                    screenName: screenName,
                    exisit: false,
                })
                return successResponse(body)
            }
        }

        case "/v1/suggestion_ban": {
            const check = checkMethod(req, "GET")
            if (check) {
                return check
            }

            const screenName = url.searchParams.get("screenName")

            if (!screenName) {
                return errorMessage(Status.BadRequest)
            }

            const isUserInSearchResults = await checkIsUserSuggestionBanned(screenName)

            const body = JSON.stringify({
                screenName: screenName,
                suggestion_banned: !isUserInSearchResults,
            })

            return successResponse(body)
        }

        case "/v1/ghost_ban": {
            const check = checkMethod(req, "GET")
            if (check) {
                return check
            }

            const restId = url.searchParams.get("restId")

            if (!restId) {
                return errorMessage(Status.BadRequest)
            }

            const isUserInReplyTree = await checkIsUserGhostBanned(restId)
            switch (isUserInReplyTree) {
                case GhostBanResult.NotExist: {
                    const body = JSON.stringify({
                        message: "Given restId is not exist",
                        restId: restId,
                    })
                    return new Response(body, {
                        status: Status.BadRequest,
                        headers: new Headers({
                            "content-type": "text/plain",
                        }),
                    })
                }
                case GhostBanResult.Banned: {
                    const body = JSON.stringify({
                        restId: restId,
                        ghost_banned: true,
                    })
                    return successResponse(body)
                }
                case GhostBanResult.NotBanned: {
                    const body = JSON.stringify({
                        restId: restId,
                        ghost_banned: false,
                    })
                    return successResponse(body)
                }
                case GhostBanResult.UnknownError: {
                    const body = JSON.stringify({
                        message: "Unknown error",
                        restId: restId,
                    })
                    return new Response(body, {
                        status: Status.InternalServerError,
                        headers: new Headers({
                            "content-type": "application/json: charset=utf-8",
                        }),
                    })
                }
                case GhostBanResult.Unrecognizable: {
                    const body = JSON.stringify({
                        message: "Unable to determine if ghost banned",
                        restId: restId,
                    })
                    return new Response(body, {
                        status: Status.InternalServerError,
                        headers: new Headers({
                            "content-type": "application/json: charset=utf-8",
                        }),
                    })
                }
                default: {
                    return errorMessage(Status.InternalServerError)
                }
            }
        }

        default: {
            const body = JSON.stringify({ message: "NOT FOUND" })
            return new Response(body, {
                status: 404,
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
            })
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
        return new Response(body, {
            status: Status.MethodNotAllowed,
            headers: new Headers({
                "content-type": "application/json",
            }),
        })
    } else {
        return null
    }
}

// parameter error message
function errorMessage(code: number): Response {
    const body = JSON.stringify({ message: STATUS_TEXT.get(code) })
    return new Response(body, {
        status: code,
        headers: new Headers({
            "content-type": "application/json; charset=utf-8",
        }),
    })
}

function successResponse(body: string): Response {
    return new Response(body, {
        status: Status.OK,
        headers: new Headers({
            "content-type": "application/json; charset=utf-8",
        }),
    })
}

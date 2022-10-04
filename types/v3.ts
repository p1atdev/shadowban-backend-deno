import { TwitterAPI } from "../deps.ts"

export interface TwitterRequest {
    client: TwitterAPI

    get: (_: any) => Promise<unknown>
}

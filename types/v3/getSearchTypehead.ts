import { TwitterRequest } from "../v3.ts"
import { TwitterAPI } from "../../deps.ts"

export interface GetSearchTypeheadQueries {
    q: string
}

export class GetSearchTypehead implements TwitterRequest {
    client: TwitterAPI

    constructor(client: TwitterAPI) {
        this.client = client
    }

    get = async (queries: GetSearchTypeheadQueries) => {
        const res = await this.client.request({
            method: "GET",
            urlType: "i/api/1.1",
            path: "/search/typeahead.json",
            query: {
                data: { ...queries, ...this.queryTemplate },
            },
        })
        const json: GetSearchTypeheadRes = await res.json()
        return json
    }

    private queryTemplate = {
        result_type: "users",
    }
}

export interface GetSearchTypeheadRes {
    num_results: number
    users: User[]
    topics: unknown[]
    events: unknown[]
    lists: unknown[]
    ordered_sections: string[]
    oneclick: unknown[]
    hashtags: unknown[]
    completed_in: number
    query: string
}

export interface User {
    id: number
    id_str: string
    verified: boolean
    is_dm_able: boolean
    is_blocked: boolean
    can_media_tag: boolean
    name: string
    screen_name: string
    profile_image_url: string
    profile_image_url_https: string
    location: string
    is_protected: boolean
    rounded_score: number
    social_proof: number
    connecting_user_count: number
    connecting_user_ids: unknown[]
    social_proofs_ordered: unknown[]
    social_context: SocialContext
    tokens: Token[]
    inline: boolean
    result_context: ResultContext
}

export interface ResultContext {
    display_string: string
    types: Type[]
}

export interface Type {
    type: string
}

export interface SocialContext {
    following: boolean
    followed_by: boolean
}

export interface Token {
    token: string
}

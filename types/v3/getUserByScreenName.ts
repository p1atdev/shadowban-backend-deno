import { TwitterRequest } from "../v3.ts"
import { TwitterAPI } from "../../deps.ts"

export interface GetUserByScreenNameVariables {
    screen_name: string
}

const GetUserTweetsAndRepliesFeatures = {
    responsive_web_graphql_timeline_navigation_enabled: false,
}

export class GetUserByScreenName implements TwitterRequest {
    client: TwitterAPI

    constructor(client: TwitterAPI) {
        this.client = client
    }

    get = async (variables: GetUserByScreenNameVariables) => {
        const res = await this.client.request({
            method: "GET",
            urlType: "gql",
            path: "UserByScreenName",
            query: {
                data: {
                    variables: JSON.stringify({ ...variables, ...this.variablesTemplate }),
                    features: JSON.stringify(GetUserTweetsAndRepliesFeatures),
                },
            },
        })
        const json: GetUserByScreenNameRes = await res.json()
        return json
    }

    private variablesTemplate = {
        withSafetyModeUserFields: false,
        withSuperFollowsUserFields: false,
    }
}

export interface GetUserByScreenNameRes {
    data: Data
}

export interface Data {
    user: User
}

export interface User {
    result: Result
}

export interface Result {
    __typename: string
    id: string
    rest_id: string
    affiliates_highlighted_label: AffiliatesHighlightedLabel
    has_nft_avatar: boolean
    legacy: Legacy
    professional: Professional
    smart_blocked_by: boolean
    smart_blocking: boolean
    super_follow_eligible: boolean
    super_followed_by: boolean
    super_following: boolean
    legacy_extended_profile: AffiliatesHighlightedLabel
    is_profile_translatable: boolean
}

export interface AffiliatesHighlightedLabel {}

export interface Legacy {
    blocked_by: boolean
    blocking: boolean
    can_dm: boolean
    can_media_tag: boolean
    created_at: string
    default_profile: boolean
    default_profile_image: boolean
    description: string
    entities: Entities
    fast_followers_count: number
    favourites_count: number
    follow_request_sent: boolean
    followed_by: boolean
    followers_count: number
    following: boolean
    friends_count: number
    has_custom_timelines: boolean
    is_translator: boolean
    listed_count: number
    location: string
    media_count: number
    muting: boolean
    name: string
    normal_followers_count: number
    notifications: boolean
    pinned_tweet_ids_str: string[]
    possibly_sensitive: boolean
    profile_banner_extensions: ProfileExtensions
    profile_banner_url: string
    profile_image_extensions: ProfileExtensions
    profile_image_url_https: string
    profile_interstitial_type: string
    protected: boolean
    screen_name: string
    statuses_count: number
    translator_type: string
    url: string
    verified: boolean
    want_retweets: boolean
    withheld_in_countries: any[]
}

export interface Entities {
    description: Description
    url: Description
}

export interface Description {
    urls: URL[]
}

export interface URL {
    display_url: string
    expanded_url: string
    url: string
    indices: number[]
}

export interface ProfileExtensions {
    mediaColor: MediaColor
}

export interface MediaColor {
    r: R
}

export interface R {
    ok: Ok
}

export interface Ok {
    palette: Palette[]
}

export interface Palette {
    percentage: number
    rgb: RGB
}

export interface RGB {
    blue: number
    green: number
    red: number
}

export interface Professional {
    rest_id: string
    professional_type: string
    category: Category[]
}

export interface Category {
    id: number
    name: string
    icon_name: string
}

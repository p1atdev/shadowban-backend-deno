import { TwitterRequest } from "../v3.ts"
import { TwitterAPI } from "../../deps.ts"

export interface GetTweetDetailVariables {
    focalTweetId: string
    controller_data?: string
}

const GetUserTweetsAndRepliesFeatures = {
    responsive_web_graphql_timeline_navigation_enabled: false,
    unified_cards_ad_metadata_container_dynamic_card_content_query_enabled: false,
    tweetypie_unmention_optimization_enabled: false,
    responsive_web_uc_gql_enabled: false,
    vibe_api_enabled: false,
    responsive_web_edit_tweet_api_enabled: false,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: false,
    standardized_nudges_misinfo: false,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
    interactive_text_enabled: false,
    responsive_web_text_conversations_enabled: false,
    responsive_web_enhance_cards_enabled: false,
}

export class GetTweetDetail implements TwitterRequest {
    client: TwitterAPI

    constructor(client: TwitterAPI) {
        this.client = client
    }

    get = async (variables: GetTweetDetailVariables) => {
        const res = await this.client.request({
            method: "GET",
            urlType: "gql",
            path: "TweetDetail",
            query: {
                data: {
                    variables: JSON.stringify({ ...variables, ...this.variableTemplate }),
                    features: JSON.stringify(GetUserTweetsAndRepliesFeatures),
                },
            },
        })
        const json: GetTweetDetailRes = await res.json()
        return json
    }

    private variableTemplate = {
        with_rux_injections: false,
        includePromotedContent: false,
        withCommunity: false,
        withQuickPromoteEligibilityTweetFields: false,
        withBirdwatchNotes: false,
        withSuperFollowsUserFields: false,
        withDownvotePerspective: false,
        withReactionsMetadata: false,
        withReactionsPerspective: false,
        withSuperFollowsTweetFields: false,
        withVoice: false,
        withV2Timeline: true,
    }
}

export interface GetTweetDetailRes {
    data: Data
}

export interface Data {
    threaded_conversation_with_injections_v2: ThreadedConversationWithInjectionsV2
}

export interface ThreadedConversationWithInjectionsV2 {
    instructions: Instruction[]
}

export interface Instruction {
    type: string
    entries?: Entry[]
    direction?: string
}

export interface Entry {
    entryId: string
    sortIndex: string
    content: Content
}

export interface Content {
    entryType: string
    __typename: string
    itemContent?: ItemContent
}

export interface ItemContent {
    itemType: string
    __typename: string
    tweet_results?: TweetResults
    tweetDisplayType: string
    hasModeratedReplies: boolean
}

export interface TweetResults {
    result: TweetResultsResult
}

export interface TweetResultsResult {
    __typename: string
    rest_id: string
    core: Core
    unmention_info: UnmentionInfo
    edit_control: EditControl
    legacy: FluffyLegacy
    quick_promote_eligibility: QuickPromoteEligibility
}

export interface Core {
    user_results: UserResults
}

export interface UserResults {
    result: UserResultsResult
}

export interface UserResultsResult {
    __typename: string
    id: string
    rest_id: string
    affiliates_highlighted_label: UnmentionInfo
    has_nft_avatar: boolean
    legacy: PurpleLegacy
    super_follow_eligible: boolean
    super_followed_by: boolean
    super_following: boolean
}

export interface UnmentionInfo {}

export interface PurpleLegacy {
    blocked_by: boolean
    blocking: boolean
    can_dm: boolean
    can_media_tag: boolean
    created_at: string
    default_profile: boolean
    default_profile_image: boolean
    description: string
    entities: PurpleEntities
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
    needs_phone_verification: boolean
    normal_followers_count: number
    notifications: boolean
    pinned_tweet_ids_str: any[]
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

export interface PurpleEntities {
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

export interface EditControl {
    edit_tweet_ids: string[]
    editable_until_msecs: string
    is_edit_eligible: boolean
    edits_remaining: string
}

export interface FluffyLegacy {
    created_at: string
    conversation_id_str: string
    display_text_range: number[]
    entities: FluffyEntities
    favorite_count: number
    favorited: boolean
    full_text: string
    is_quote_status: boolean
    lang: string
    quote_count: number
    reply_count: number
    retweet_count: number
    retweeted: boolean
    source: string
    user_id_str: string
    id_str: string
}

export interface FluffyEntities {
    user_mentions: any[]
    urls: any[]
    hashtags: any[]
    symbols: any[]
}

export interface QuickPromoteEligibility {
    eligibility: string
}

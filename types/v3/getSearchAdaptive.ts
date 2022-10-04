import { TwitterRequest } from "../v3.ts"
import { TwitterAPI } from "../../deps.ts"

export interface GetSearchAdaptiveQueries {
    q: string
    count: number
    tweet_search_mode?: "live" | "user"
    result_filter?: "image" | "video"
}

export class GetSearchAdaptive implements TwitterRequest {
    client: TwitterAPI

    constructor(client: TwitterAPI) {
        this.client = client
    }

    get = async (queries: GetSearchAdaptiveQueries) => {
        const res = await this.client.request({
            method: "GET",
            urlType: "i/api/2",
            path: "/search/adaptive.json",
            query: {
                data: { ...queries, count: String(queries.count), ...this.queryTemplate },
            },
        })
        const json: GetSearchAdaptiveRes = await res.json()
        return json
    }

    private queryTemplate = {
        include_profile_interstitial_type: "1",
        include_blocking: "1",
        include_blocked_by: "1",
        include_followed_by: "1",
        include_want_retweets: "1",
        include_mute_edge: "1",
        include_can_dm: "1",
        include_can_media_tag: "1",
        include_ext_has_nft_avatar: "1",
        skip_status: "1",
        cards_platform: "Web-12",
        include_cards: "1",
        include_ext_alt_text: "false",
        include_ext_limited_action_results: "false",
        include_quote_count: "true",
        include_reply_count: "1",
        tweet_mode: "extended",
        include_ext_collab_control: "true",
        include_entities: "true",
        include_user_entities: "true",
        include_ext_media_color: "true",
        include_ext_media_availability: "true",
        include_ext_sensitive_media_warning: "false",
        include_ext_trusted_friends_metadata: "true",
        send_error_codes: "false",
        simple_quoted_tweet: "true",
        query_source: "	typed_query",
        pc: "1",
        spelling_corrections: "1",
        include_ext_edit_control: "true",
        ext: "mediaStats,highlightedLabel,hasNftAvatar,voiceInfo,enrichments,superFollowMetadata,unmentionInfo,editControl,collab_control,vibe",
    }
}

export interface GetSearchAdaptiveRes {
    globalObjects: GlobalObjects
    timeline: Timeline
}

export interface GlobalObjects {
    tweets: { [key: string]: TweetValue }
    users: Users
    moments: Broadcasts
    cards: Broadcasts
    places: Broadcasts
    media: Broadcasts
    broadcasts: Broadcasts
    topics: Broadcasts
    lists: Broadcasts
}

export interface Broadcasts {}

export interface TweetValue {
    created_at: string
    id: number
    id_str: string
    full_text: string
    truncated: boolean
    display_text_range: number[]
    entities: TweetEntities
    source: string
    in_reply_to_status_id: number
    in_reply_to_status_id_str: string
    in_reply_to_user_id: number
    in_reply_to_user_id_str: string
    in_reply_to_screen_name: string
    user_id: number
    user_id_str: string
    geo: null
    coordinates: null
    place: null
    contributors: null
    is_quote_status: boolean
    retweet_count: number
    favorite_count: number
    reply_count: number
    quote_count: number
    conversation_id: number
    conversation_id_str: string
    favorited: boolean
    retweeted: boolean
    lang: string
    supplemental_language: null
    ext_edit_control: EXTEditControl
    ext: TweetEXT
    possibly_sensitive?: boolean
    possibly_sensitive_editable?: boolean
}

export interface TweetEntities {
    hashtags: any[]
    symbols: any[]
    user_mentions: UserMention[]
    urls: URL[]
}

export interface URL {
    url: string
    expanded_url: string
    display_url: string
    indices: number[]
}

export interface UserMention {
    screen_name: string
    name: string
    id: number
    id_str: string
    indices: number[]
}

export interface TweetEXT {
    editControl: EditControl
    superFollowMetadata: SuperFollowMetadata
    unmentionInfo: SuperFollowMetadata
}

export interface EditControl {
    r: EditControlR
    ttl: number
}

export interface EditControlR {
    ok: PurpleOk
}

export interface PurpleOk {
    initial: OkInitial
}

export interface OkInitial {
    editTweetIds: string[]
    editableUntilMsecs: string
    editsRemaining: string
    isEditEligible: boolean
}

export interface SuperFollowMetadata {
    r: UnmentionInfoR
    ttl: number
}

export interface UnmentionInfoR {
    ok: Broadcasts
}

export interface EXTEditControl {
    initial: EXTEditControlInitial
}

export interface EXTEditControlInitial {
    edit_tweet_ids: string[]
    editable_until_msecs: string
    edits_remaining: string
    is_edit_eligible: boolean
}

export type Users = Record<string, User>

export interface User {
    id: number
    id_str: string
    name: string
    screen_name: string
    location: string
    description: string
    url: string
    entities: The1090789616334958592_Entities
    protected: boolean
    followers_count: number
    fast_followers_count: number
    normal_followers_count: number
    friends_count: number
    listed_count: number
    created_at: string
    favourites_count: number
    utc_offset: null
    time_zone: null
    geo_enabled: boolean
    verified: boolean
    statuses_count: number
    media_count: number
    lang: null
    contributors_enabled: boolean
    is_translator: boolean
    is_translation_enabled: boolean
    profile_background_color: string
    profile_background_image_url: null
    profile_background_image_url_https: null
    profile_background_tile: boolean
    profile_image_url: string
    profile_image_url_https: string
    profile_banner_url: string
    profile_image_extensions_sensitive_media_warning: null
    profile_image_extensions_media_availability: null
    profile_image_extensions_alt_text: null
    profile_image_extensions_media_color: ProfileExtensionsMediaColor
    profile_image_extensions: ProfileExtensions
    profile_banner_extensions_sensitive_media_warning: null
    profile_banner_extensions_media_availability: null
    profile_banner_extensions_alt_text: null
    profile_banner_extensions_media_color: ProfileExtensionsMediaColor
    profile_banner_extensions: ProfileExtensions
    profile_link_color: string
    profile_sidebar_border_color: string
    profile_sidebar_fill_color: string
    profile_text_color: string
    profile_use_background_image: boolean
    has_extended_profile: boolean
    default_profile: boolean
    default_profile_image: boolean
    pinned_tweet_ids: any[]
    pinned_tweet_ids_str: any[]
    has_custom_timelines: boolean
    can_dm: null
    following: null
    follow_request_sent: null
    notifications: null
    muting: null
    blocking: null
    blocked_by: null
    want_retweets: null
    advertiser_account_type: string
    advertiser_account_service_levels: string[]
    profile_interstitial_type: string
    business_profile_state: string
    translator_type: string
    withheld_in_countries: any[]
    followed_by: null
    ext_has_nft_avatar: boolean
    ext: The1090789616334958592_EXT
    require_some_consent: boolean
}

export interface The1090789616334958592_Entities {
    url: Description
    description: Description
}

export interface Description {
    urls: URL[]
}

export interface The1090789616334958592_EXT {
    hasNftAvatar: HasNftAvatar
    highlightedLabel: SuperFollowMetadata
    superFollowMetadata: PurpleSuperFollowMetadata
}

export interface HasNftAvatar {
    r: HasNftAvatarR
    ttl: number
}

export interface HasNftAvatarR {
    ok: boolean
}

export interface PurpleSuperFollowMetadata {
    r: PurpleR
    ttl: number
}

export interface PurpleR {
    ok: FluffyOk
}

export interface FluffyOk {
    superFollowEligible: boolean
    superFollowing: boolean
    superFollowedBy: boolean
    exclusiveTweetFollowing: boolean
    privateSuperFollowing: boolean
}

export interface ProfileExtensions {
    mediaStats: MediaStats
}

export interface MediaStats {
    r: MediaStatsR
    ttl: number
}

export interface MediaStatsR {
    missing: null
}

export interface ProfileExtensionsMediaColor {
    palette: Palette[]
}

export interface Palette {
    rgb: RGB
    percentage: number
}

export interface RGB {
    red: number
    green: number
    blue: number
}

export interface Timeline {
    id: string
    instructions: Instruction[]
}

export interface Instruction {
    addEntries: AddEntries
}

export interface AddEntries {
    entries: Entry[]
}

export interface Entry {
    entryId: string
    sortIndex: string
    content: EntryContent
}

export interface EntryContent {
    item?: Item
    operation?: Operation
}

export interface Item {
    content: ItemContent
    clientEventInfo: ClientEventInfo
}

export interface ClientEventInfo {
    component: Component
    element: Element
    details: Details
}

export enum Component {
    Result = "result",
}

export interface Details {
    timelinesDetails: TimelinesDetails
}

export interface TimelinesDetails {
    controllerData: string
}

export enum Element {
    Tweet = "tweet",
}

export interface ItemContent {
    tweet: ContentTweet
}

export interface ContentTweet {
    id: string
    displayType: DisplayType
}

export enum DisplayType {
    Tweet = "Tweet",
}

export interface Operation {
    cursor: Cursor
}

export interface Cursor {
    value: string
    cursorType: string
}

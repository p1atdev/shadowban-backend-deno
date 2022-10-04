import { TwitterRequest } from "../v3.ts"
import { TwitterAPI } from "../../deps.ts"

export interface GetSearchAdaptiveQueries {
    q: string
    count: number
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
        pc: "0",
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
    extended_entities: ExtendedEntities
    source: string
    in_reply_to_status_id: null
    in_reply_to_status_id_str: null
    in_reply_to_user_id: null
    in_reply_to_user_id_str: null
    in_reply_to_screen_name: null
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
    possibly_sensitive: boolean
    possibly_sensitive_editable: boolean
    lang: Lang
    supplemental_language: null
    ext_edit_control: EXTEditControl
    ext: TweetEXT
    self_thread?: SelfThread
}

export interface TweetEntities {
    hashtags: Hashtag[]
    symbols: any[]
    user_mentions: any[]
    urls: URL[]
    media: EntitiesMedia[]
}

export interface Hashtag {
    text: string
    indices: number[]
}

export interface EntitiesMedia {
    id: number
    id_str: string
    indices: number[]
    media_url: string
    media_url_https: string
    url: string
    display_url: string
    expanded_url: string
    type: Type
    original_info: OriginalInfo
    sizes: Sizes
    features: Features
}

export interface Features {
    medium: OrigClass
    orig: OrigClass
    large: OrigClass
    small: OrigClass
}

export interface OrigClass {
    faces: FocusRect[]
}

export interface FocusRect {
    x: number
    y: number
    h: number
    w: number
}

export interface OriginalInfo {
    width: number
    height: number
    focus_rects: FocusRect[]
}

export interface Sizes {
    medium: ThumbClass
    large: ThumbClass
    small: ThumbClass
    thumb: ThumbClass
}

export interface ThumbClass {
    w: number
    h: number
    resize: Resize
}

export enum Resize {
    Crop = "crop",
    Fit = "fit",
}

export enum Type {
    Photo = "photo",
}

export interface URL {
    url: string
    expanded_url: string
    display_url: string
    indices: number[]
}

export interface TweetEXT {
    unmentionInfo: SuperFollowMetadata
    editControl: EditControl
    superFollowMetadata: SuperFollowMetadata
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

export interface ExtendedEntities {
    media: ExtendedEntitiesMedia[]
}

export interface ExtendedEntitiesMedia {
    id: number
    id_str: string
    indices: number[]
    media_url: string
    media_url_https: string
    url: string
    display_url: string
    expanded_url: string
    type: Type
    original_info: OriginalInfo
    sizes: Sizes
    features: Features
    media_key: string
    ext_sensitive_media_warning: null
    ext_media_availability: EXTMediaAvailability
    ext_alt_text: null | string
    ext_media_color: MediaColor
    ext: MediaEXT
}

export interface MediaEXT {
    mediaStats: EXTMediaStats
}

export interface EXTMediaStats {
    r: REnum
    ttl: number
}

export enum REnum {
    Missing = "Missing",
}

export interface EXTMediaAvailability {
    status: Status
}

export enum Status {
    Available = "available",
}

export interface MediaColor {
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

export enum Lang {
    Ja = "ja",
}

export interface SelfThread {
    id: number
    id_str: string
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
    entities: The1569329809666482176_Entities
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
    profile_image_extensions_media_color: MediaColor
    profile_image_extensions: ProfileExtensions
    profile_banner_extensions_sensitive_media_warning: null
    profile_banner_extensions_media_availability: null
    profile_banner_extensions_alt_text: null
    profile_banner_extensions_media_color: MediaColor
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
    can_dm: boolean
    can_media_tag: boolean
    following: boolean
    follow_request_sent: boolean
    notifications: boolean
    muting: boolean
    blocking: boolean
    blocked_by: boolean
    want_retweets: boolean
    advertiser_account_type: string
    advertiser_account_service_levels: any[]
    profile_interstitial_type: string
    business_profile_state: string
    translator_type: string
    withheld_in_countries: any[]
    followed_by: boolean
    ext_has_nft_avatar: boolean
    ext: The1569329809666482176_EXT
    require_some_consent: boolean
}

export interface The1569329809666482176_Entities {
    url: Description
    description: Description
}

export interface Description {
    urls: URL[]
}

export interface The1569329809666482176_EXT {
    highlightedLabel: SuperFollowMetadata
    superFollowMetadata: PurpleSuperFollowMetadata
    hasNftAvatar: HasNftAvatar
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
    mediaStats: ProfileBannerExtensionsMediaStats
}

export interface ProfileBannerExtensionsMediaStats {
    r: MediaStatsRClass
    ttl: number
}

export interface MediaStatsRClass {
    missing: null
}

export interface Timeline {
    id: string
    instructions: Instruction[]
    responseObjects: ResponseObjects
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
    clientEventInfo: ItemClientEventInfo
    feedbackInfo: FeedbackInfo
}

export interface ItemClientEventInfo {
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
    highlights: Highlights
}

export enum DisplayType {
    Tweet = "Tweet",
}

export interface Highlights {
    textHighlights: any[]
}

export interface FeedbackInfo {
    feedbackKeys: string[]
}

export interface Operation {
    cursor: Cursor
}

export interface Cursor {
    value: string
    cursorType: string
}

export interface ResponseObjects {
    feedbackActions: { [key: string]: FeedbackAction }
}

export interface FeedbackAction {
    feedbackType: string
    prompt: string
    confirmation: string
    childKeys?: string[]
    hasUndoAction: boolean
    confirmationDisplayType: string
    clientEventInfo: FeedbackActionClientEventInfo
    icon?: string
}

export interface FeedbackActionClientEventInfo {
    component: Component
    element: string
    action: string
}

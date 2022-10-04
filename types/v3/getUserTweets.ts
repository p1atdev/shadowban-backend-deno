import { TwitterRequest } from "../v3.ts"
import { TwitterAPI } from "../../deps.ts"

export interface GetUserTweetsVariables {
    userId: string
    count: number
}

const GetUserTweetsFeatures = {
    responsive_web_graphql_timeline_navigation_enabled: false,
    unified_cards_ad_metadata_container_dynamic_card_content_query_enabled: true,
    tweetypie_unmention_optimization_enabled: false,
    responsive_web_uc_gql_enabled: true,
    vibe_api_enabled: true,
    responsive_web_edit_tweet_api_enabled: true,
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: false,
    standardized_nudges_misinfo: true,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
    interactive_text_enabled: true,
    responsive_web_text_conversations_enabled: false,
    responsive_web_enhance_cards_enabled: true,
}

export class GetUserTweets implements TwitterRequest {
    client: TwitterAPI

    constructor(client: TwitterAPI) {
        this.client = client
    }

    get = async (variables: GetUserTweetsVariables) => {
        const res = await this.client.request({
            method: "GET",
            urlType: "gql",
            path: "UserTweets",
            query: {
                data: {
                    variables: JSON.stringify({ ...variables, ...this.variableTemplate }),
                    features: JSON.stringify(GetUserTweetsFeatures),
                },
            },
        })
        const json: GetUserTweetsRes = await res.json()
        return json
    }

    private variableTemplate = {
        includePromotedContent: false,
        withQuickPromoteEligibilityTweetFields: false,
        withSuperFollowsUserFields: false,
        withDownvotePerspective: false,
        withReactionsMetadata: false,
        withReactionsPerspective: false,
        withSuperFollowsTweetFields: false,
        withVoice: false,
        withV2Timeline: true,
    }
}

export interface GetUserTweetsRes {
    errors: unknown[]
    data: Data
}

export interface Data {
    user: User
}

export interface User {
    result: UserResult
}

export interface UserResult {
    __typename: Typename
    timeline_v2: TimelineV2
}

export enum Typename {
    User = "User",
}

export interface TimelineV2 {
    timeline: Timeline
}

export interface Timeline {
    instructions: Instruction[]
    responseObjects: ResponseObjects
}

export interface Instruction {
    type: "TimelineAddEntries" | "TimelineClearCache"
    entries?: Entry[]
}

export interface Entry {
    entryId: string
    sortIndex: string
    content: Content
}

export interface Content {
    entryType: EntryTypeEnum
    __typename: EntryTypeEnum
    itemContent?: ItemContent
    reactiveTriggers?: ReactiveTriggers
    value?: string
    cursorType?: string
    stopOnEmptyResponse?: boolean
}

export enum EntryTypeEnum {
    TimelineTimelineCursor = "TimelineTimelineCursor",
    TimelineTimelineItem = "TimelineTimelineItem",
}

export interface ItemContent {
    itemType: ItemTypeEnum
    __typename: ItemTypeEnum
    tweet_results: TweetResults
    tweetDisplayType: TweetDisplayType
    ruxContext: string
}

export enum ItemTypeEnum {
    TimelineTweet = "TimelineTweet",
}

export enum TweetDisplayType {
    Tweet = "Tweet",
}

export interface TweetResults {
    result: TweetResultsResult
}

export interface TweetResultsResult {
    __typename: TweetDisplayType
    rest_id: string
    core: PurpleCore
    unmention_info: UnmentionInfo
    edit_control: EditControl
    legacy: FluffyLegacy
    quick_promote_eligibility: QuickPromoteEligibility
    quoted_status_result?: QuotedStatusResult
}

export interface PurpleCore {
    user_results: PurpleUserResults
}

export interface PurpleUserResults {
    result: PurpleResult
}

export interface PurpleResult {
    __typename: Typename
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
    created_at: string
    default_profile: boolean
    default_profile_image: boolean
    description: string
    entities: PurpleEntities
    fast_followers_count: number
    favourites_count: number
    followers_count: number
    friends_count: number
    has_custom_timelines: boolean
    is_translator: boolean
    listed_count: number
    location: string
    media_count: number
    name: string
    normal_followers_count: number
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
    translator_type: TranslatorType
    url?: string
    verified: boolean
    withheld_in_countries: unknown[]
}

export interface PurpleEntities {
    description: Description
    url?: Description
}

export interface Description {
    urls: URLElement[]
}

export interface URLElement {
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
    ok: EXTMediaColor
}

export interface EXTMediaColor {
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

export enum TranslatorType {
    None = "none",
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
    extended_entities?: ExtendedEntities
    favorite_count: number
    favorited: boolean
    full_text: string
    is_quote_status: boolean
    lang: string
    possibly_sensitive?: boolean
    possibly_sensitive_editable?: boolean
    quote_count: number
    reply_count: number
    retweet_count: number
    retweeted: boolean
    source: string
    user_id_str: string
    id_str: string
    quoted_status_id_str?: string
    quoted_status_permalink?: QuotedStatusPermalink
    in_reply_to_screen_name?: string
    in_reply_to_status_id_str?: string
    in_reply_to_user_id_str?: string
    self_thread?: SelfThread
}

export interface FluffyEntities {
    media?: EntitiesMedia[]
    user_mentions: UserMention[]
    urls: URLElement[]
    hashtags: unknown[]
    symbols: unknown[]
}

export interface EntitiesMedia {
    display_url: string
    expanded_url: string
    id_str: string
    indices: number[]
    media_url_https: string
    type: Type
    url: string
    features: Features
    sizes: Sizes
    original_info: OriginalInfo
}

export interface Features {
    large?: OrigClass
    medium?: OrigClass
    small?: OrigClass
    orig?: OrigClass
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
    height: number
    width: number
    focus_rects?: FocusRect[]
}

export interface Sizes {
    large: ThumbClass
    medium: ThumbClass
    small: ThumbClass
    thumb: ThumbClass
}

export interface ThumbClass {
    h: number
    w: number
    resize: Resize
}

export enum Resize {
    Crop = "crop",
    Fit = "fit",
}

export enum Type {
    Photo = "photo",
    Video = "video",
}

export interface UserMention {
    id_str: string
    name: string
    screen_name: string
    indices: number[]
}

export interface ExtendedEntities {
    media: ExtendedEntitiesMedia[]
}

export interface ExtendedEntitiesMedia {
    display_url: string
    expanded_url: string
    id_str: string
    indices: number[]
    media_key: string
    media_url_https: string
    type: Type
    url: string
    ext_media_color: EXTMediaColor
    ext_media_availability: EXTMediaAvailability
    features: Features
    sizes: Sizes
    original_info: OriginalInfo
    additional_media_info?: AdditionalMediaInfo
    mediaStats?: MediaStats
    video_info?: VideoInfo
}

export interface AdditionalMediaInfo {
    monetizable: boolean
}

export interface EXTMediaAvailability {
    status: Status
}

export enum Status {
    Available = "Available",
}

export interface MediaStats {
    viewCount: number
}

export interface VideoInfo {
    aspect_ratio: number[]
    duration_millis: number
    variants: Variant[]
}

export interface Variant {
    bitrate?: number
    content_type: ContentType
    url: string
}

export enum ContentType {
    ApplicationXMPEGURL = "application/x-mpegURL",
    VideoMp4 = "video/mp4",
}

export interface QuotedStatusPermalink {
    url: string
    expanded: string
    display: string
}

export interface SelfThread {
    id_str: string
}

export interface QuickPromoteEligibility {
    eligibility: Eligibility
}

export enum Eligibility {
    IneligibleUserUnauthorized = "IneligibleUserUnauthorized",
}

export interface QuotedStatusResult {
    result: QuotedStatusResultResult
}

export interface QuotedStatusResultResult {
    __typename: TweetDisplayType
    rest_id: string
    core: FluffyCore
    unmention_info: UnmentionInfo
    edit_control: EditControl
    legacy: TentacledLegacy
}

export interface FluffyCore {
    user_results: FluffyUserResults
}

export interface FluffyUserResults {
    result: FluffyResult
}

export interface FluffyResult {
    __typename: Typename
    id: string
    rest_id: string
    affiliates_highlighted_label: UnmentionInfo
    has_nft_avatar: boolean
    legacy: PurpleLegacy
    super_follow_eligible: boolean
    super_followed_by: boolean
    super_following: boolean
}

export interface TentacledLegacy {
    created_at: string
    conversation_id_str: string
    display_text_range: number[]
    entities: FluffyEntities
    favorite_count: number
    favorited: boolean
    full_text: string
    in_reply_to_screen_name: string
    in_reply_to_status_id_str: string
    in_reply_to_user_id_str: string
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

export interface ReactiveTriggers {
    onLinger: OnLinger
}

export interface OnLinger {
    execution: Execution
    maxExecutionCount: number
}

export interface Execution {
    type: string
    key: string
}

export interface ResponseObjects {
    feedbackActions: unknown[]
    immediateReactions: ImmediateReaction[]
}

export interface ImmediateReaction {
    key: string
    value: Value[]
}

export interface Value {
    type: string
    clientEventInfo: ClientEventInfo
    cover: Cover
}

export interface ClientEventInfo {
    component: string
    element: string
}

export interface Cover {
    type: string
    settingsListCoverDisplayType: string
    header: Header
    settings: Setting[]
    impressionCallbacks: ImpressionCallback[]
}

export interface Header {
    primaryText: PrimaryText
    secondaryText: PrimaryText
}

export interface PrimaryText {
    text: string
    entities: Entity[]
}

export interface Entity {
    fromIndex: number
    toIndex: number
    ref: Ref
}

export interface Ref {
    type: string
    url: string
    urlType: string
}

export interface ImpressionCallback {
    endpoint: string
}

export interface Setting {
    valueType: string
    valueData: ValueData
}

export interface ValueData {
    coverCta?: CoverCta
    separator?: Separator
    staticText?: StaticText
}

export interface CoverCta {
    text: string
    ctaBehavior: CtaBehavior
    clientEventInfo: ClientEventInfo
}

export interface CtaBehavior {
    type: string
    url?: CtaBehaviorURL
}

export interface CtaBehaviorURL {
    url: string
    urlType: string
}

export interface Separator {
    label: PrimaryText
}

export interface StaticText {
    detailText: PrimaryText
}

import { TwitterRequest } from "../v3.ts"
import { TwitterAPI } from "../../deps.ts"

export interface GetUserTweetsAndRepliesVariables {
    userId: string
    count: number
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

export class GetUserTweetsAndReplies implements TwitterRequest {
    client: TwitterAPI

    constructor(client: TwitterAPI) {
        this.client = client
    }

    get = async (variables: GetUserTweetsAndRepliesVariables) => {
        const res = await this.client.request({
            method: "GET",
            urlType: "gql",
            path: "UserTweetsAndReplies",
            query: {
                data: {
                    variables: JSON.stringify({ ...variables, ...this.variableTemplate }),
                    features: JSON.stringify(GetUserTweetsAndRepliesFeatures),
                },
            },
        })
        const json: GetUserTweetsAndRepliesRes = await res.json()
        return json
    }

    private variableTemplate = {
        includePromotedContent: false,
        withCommunity: false,
        withSuperFollowsUserFields: false,
        withDownvotePerspective: false,
        withReactionsMetadata: false,
        withReactionsPerspective: false,
        withSuperFollowsTweetFields: false,
        withVoice: false,
        withV2Timeline: true,
    }
}

export interface GetUserTweetsAndRepliesRes {
    data: Data
}

export interface Data {
    user: User
}

export interface User {
    result: UserResult
}

export interface UserResult {
    __typename: UserDisplayTypeEnum
    timeline_v2: TimelineV2
}

export enum UserDisplayTypeEnum {
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
    type: string
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
    itemContent?: ContentItemContent
    items?: ItemElement[]
    displayType?: string
    header?: Header
    footer?: Footer
    clientEventInfo?: ContentClientEventInfo
    metadata?: Metadata
    value?: string
    cursorType?: string
    stopOnEmptyResponse?: boolean
}

export enum EntryTypeEnum {
    TimelineTimelineCursor = "TimelineTimelineCursor",
    TimelineTimelineItem = "TimelineTimelineItem",
    TimelineTimelineModule = "TimelineTimelineModule",
}

export interface ContentClientEventInfo {
    component: Component
    details: PurpleDetails
}

export enum Component {
    SuggestOrganicConversation = "suggest_organic_conversation",
    SuggestWhoToFollow = "suggest_who_to_follow",
}

export interface PurpleDetails {
    timelinesDetails: PurpleTimelinesDetails
}

export interface PurpleTimelinesDetails {
    injectionType: InjectionType
    controllerData?: string
}

export enum InjectionType {
    OrganicConversation = "OrganicConversation",
    WhoToFollow = "WhoToFollow",
}

export interface Footer {
    displayType: string
    text: string
    landingUrl: LandingURL
}

export interface LandingURL {
    url: string
    urlType: string
}

export interface Header {
    displayType: string
    text: string
    sticky: boolean
}

export interface ContentItemContent {
    itemType: ItemTypeEnum
    __typename: ItemTypeEnum
    tweet_results: PurpleTweetResults
    tweetDisplayType: TweetDisplayType
}

export enum ItemTypeEnum {
    TimelineTweet = "TimelineTweet",
    TimelineUser = "TimelineUser",
}

export enum TweetDisplayType {
    Tweet = "Tweet",
}

export interface PurpleTweetResults {
    result: PurpleResult
}

export interface PurpleResult {
    __typename: TweetDisplayType
    rest_id: string
    core: PurpleCore
    unmention_info: UnmentionInfo
    edit_control: EditControl
    legacy: FluffyLegacy
    card?: Card
    unified_card?: UnifiedCard
    quoted_status_result?: PurpleQuotedStatusResult
}

export interface Card {
    rest_id: string
    legacy: CardLegacy
}

export interface CardLegacy {
    binding_values: BindingValue[]
    card_platform: CardPlatform
    name: string
    url: string
    user_refs_results: UserRe[]
}

export interface BindingValue {
    key: string
    value: Value
}

export interface Value {
    image_value?: ImageValue
    type: ValueType
    string_value?: string
    scribe_key?: string
    user_value?: UserValue
    image_color_value?: EXTMediaColor
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

export interface ImageValue {
    height: number
    width: number
    url: string
}

export enum ValueType {
    Image = "IMAGE",
    ImageColor = "IMAGE_COLOR",
    String = "STRING",
    User = "USER",
}

export interface UserValue {
    id_str: string
    path: any[]
}

export interface CardPlatform {
    platform: Platform
}

export interface Platform {
    audience: Audience
    device: Device
}

export interface Audience {
    name: string
}

export interface Device {
    name: string
    version: string
}

export interface UserRe {
    result: UserRefsResultResult
}

export interface UserRefsResultResult {
    __typename: UserDisplayTypeEnum
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
    location: Location
    media_count: number
    muting: boolean
    name: string
    normal_followers_count: number
    notifications: boolean
    pinned_tweet_ids_str: string[]
    possibly_sensitive: boolean
    profile_banner_extensions?: ProfileExtensions
    profile_banner_url?: string
    profile_image_extensions: ProfileExtensions
    profile_image_url_https: string
    profile_interstitial_type: string
    protected: boolean
    screen_name: string
    statuses_count: number
    translator_type: TranslatorType
    url: string
    verified: boolean
    want_retweets: boolean
    withheld_in_countries: any[]
    needs_phone_verification?: boolean
}

export interface PurpleEntities {
    description: Description
    url?: Description
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
    ok: EXTMediaColor
}

export enum TranslatorType {
    None = "none",
}

export interface PurpleCore {
    user_results: UserRe
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
    lang: Lang
    quote_count: number
    reply_count: number
    retweet_count: number
    retweeted: boolean
    source: string
    user_id_str: string
    id_str: string
    possibly_sensitive?: boolean
    possibly_sensitive_editable?: boolean
    retweeted_status_result?: RetweetedStatusResult
    extended_entities?: PurpleExtendedEntities
    quoted_status_id_str?: string
    quoted_status_permalink?: QuotedStatusPermalink
}

export interface FluffyEntities {
    user_mentions: UserMention[]
    urls: URL[]
    hashtags: Hashtag[]
    symbols: any[]
    media?: EntitiesMedia[]
}

export interface Hashtag {
    indices: number[]
    text: string
}

export interface EntitiesMedia {
    display_url: string
    expanded_url: string
    id_str: string
    indices: number[]
    media_url_https: string
    type: MediaType
    url: string
    features: Features
    sizes: Sizes
    original_info: OriginalInfo
    media_key?: string
    ext_media_color?: EXTMediaColor
    ext_media_availability?: EXTMediaAvailability
}

export interface EXTMediaAvailability {
    status: Status
}

export enum Status {
    Available = "Available",
}

export interface Features {
    large: OrigClass
    medium: OrigClass
    small: OrigClass
    orig: OrigClass
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
    focus_rects: FocusRect[]
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

export enum MediaType {
    Photo = "photo",
}

export interface UserMention {
    id_str: string
    name: string
    screen_name: string
    indices: number[]
}

export interface PurpleExtendedEntities {
    media: PurpleMedia[]
}

export interface PurpleMedia {
    display_url: string
    expanded_url: string
    ext_alt_text?: string
    id_str: string
    indices: number[]
    media_key: string
    media_url_https: string
    type: MediaType
    url: string
    ext_media_color: EXTMediaColor
    ext_media_availability: EXTMediaAvailability
    features: Features
    sizes: Sizes
    original_info: OriginalInfo
}

export enum Lang {
    Ja = "ja",
    Zxx = "zxx",
}

export interface QuotedStatusPermalink {
    url: string
    expanded: string
    display: string
}

export interface RetweetedStatusResult {
    result: RetweetedStatusResultResult
}

export interface RetweetedStatusResultResult {
    __typename: TweetDisplayType
    rest_id: string
    core: PurpleCore
    card: Card
    unmention_info: UnmentionInfo
    unified_card: UnifiedCard
    edit_control: EditControl
    legacy: TentacledLegacy
}

export interface TentacledLegacy {
    created_at: string
    conversation_id_str: string
    display_text_range: number[]
    entities: FluffyEntities
    favorite_count: number
    favorited: boolean
    full_text: string
    is_quote_status: boolean
    lang: Lang
    possibly_sensitive: boolean
    possibly_sensitive_editable: boolean
    quote_count: number
    reply_count: number
    retweet_count: number
    retweeted: boolean
    source: string
    user_id_str: string
    id_str: string
}

export interface UnifiedCard {
    card_fetch_state: string
}

export interface PurpleQuotedStatusResult {
    result: FluffyResult
}

export interface FluffyResult {
    __typename: TweetDisplayType
    rest_id: string
    core: FluffyCore
    unmention_info: UnmentionInfo
    edit_control: EditControl
    quotedRefResult?: QuotedRefResult
    legacy: StickyLegacy
}

export interface FluffyCore {
    user_results: CoreUserResults
}

export interface CoreUserResults {
    result: TentacledResult
}

export interface TentacledResult {
    __typename: UserDisplayTypeEnum
    id: string
    rest_id: string
    affiliates_highlighted_label: UnmentionInfo
    has_nft_avatar: boolean
    legacy: PurpleLegacy
    super_follow_eligible: boolean
    super_followed_by: boolean
    super_following: boolean
    professional?: Professional
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

export interface StickyLegacy {
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
    quoted_status_id_str?: string
    quoted_status_permalink?: QuotedStatusPermalink
    reply_count: number
    retweet_count: number
    retweeted: boolean
    source: string
    user_id_str: string
    id_str: string
    extended_entities?: FluffyExtendedEntities
    in_reply_to_screen_name?: string
    in_reply_to_status_id_str?: string
    in_reply_to_user_id_str?: string
    possibly_sensitive?: boolean
    possibly_sensitive_editable?: boolean
    self_thread?: SelfThread
}

export interface FluffyExtendedEntities {
    media: EntitiesMedia[]
}

export interface SelfThread {
    id_str: string
}

export interface QuotedRefResult {
    result: QuotedRefResultResult
}

export interface QuotedRefResultResult {
    __typename: TweetDisplayType
    rest_id: string
}

export interface ItemElement {
    entryId: string
    item: ItemItem
    dispensable?: boolean
}

export interface ItemItem {
    itemContent: ItemItemContent
    clientEventInfo: ItemClientEventInfo
}

export interface ItemClientEventInfo {
    component: Component
    element?: string
    details: FluffyDetails
}

export interface FluffyDetails {
    timelinesDetails: FluffyTimelinesDetails
}

export interface FluffyTimelinesDetails {
    injectionType: InjectionType
    controllerData: string
    sourceData?: string
}

export interface ItemItemContent {
    itemType: ItemTypeEnum
    __typename: ItemTypeEnum
    user_results?: ItemContentUserResults
    userDisplayType?: UserDisplayTypeEnum
    socialContext?: SocialContext
    tweet_results?: FluffyTweetResults
    tweetDisplayType?: TweetDisplayType
}

export interface SocialContext {
    type: string
    contextType: string
    text: string
}

export interface FluffyTweetResults {
    result: StickyResult
}

export interface StickyResult {
    __typename: TweetDisplayType
    rest_id: string
    core: FluffyCore
    unmention_info: UnmentionInfo
    edit_control: EditControl
    legacy: IndigoLegacy
    quoted_status_result?: FluffyQuotedStatusResult
}

export interface IndigoLegacy {
    created_at: string
    conversation_id_str: string
    display_text_range: number[]
    entities: FluffyEntities
    favorite_count: number
    favorited: boolean
    full_text: string
    is_quote_status: boolean
    lang: Lang
    quote_count: number
    reply_count: number
    retweet_count: number
    retweeted: boolean
    source: string
    user_id_str: string
    id_str: string
    self_thread?: SelfThread
    in_reply_to_screen_name?: string
    in_reply_to_status_id_str?: string
    in_reply_to_user_id_str?: string
    quoted_status_id_str?: string
    quoted_status_permalink?: QuotedStatusPermalink
}

export interface FluffyQuotedStatusResult {
    result: IndigoResult
}

export interface IndigoResult {
    __typename: TweetDisplayType
    rest_id: string
    core: PurpleCore
    unmention_info: UnmentionInfo
    edit_control: EditControl
    legacy: IndecentLegacy
}

export interface IndecentLegacy {
    created_at: string
    conversation_id_str: string
    display_text_range: number[]
    entities: FluffyEntities
    extended_entities: PurpleExtendedEntities
    favorite_count: number
    favorited: boolean
    full_text: string
    is_quote_status: boolean
    lang: Lang
    possibly_sensitive: boolean
    possibly_sensitive_editable: boolean
    quote_count: number
    reply_count: number
    retweet_count: number
    retweeted: boolean
    source: string
    user_id_str: string
    id_str: string
}

export interface ItemContentUserResults {
    result: IndecentResult
}

export interface IndecentResult {
    __typename: UserDisplayTypeEnum
    id: string
    rest_id: string
    affiliates_highlighted_label: UnmentionInfo
    has_nft_avatar: boolean
    legacy: HilariousLegacy
    super_follow_eligible: boolean
    super_followed_by: boolean
    super_following: boolean
}

export interface HilariousLegacy {
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
    translator_type: TranslatorType
    verified: boolean
    want_retweets: boolean
    withheld_in_countries: any[]
    url?: string
}

export interface Metadata {
    conversationMetadata: ConversationMetadata
}

export interface ConversationMetadata {
    allTweetIds: string[]
    enableDeduplication: boolean
}

export interface ResponseObjects {
    feedbackActions: any[]
    immediateReactions: any[]
}

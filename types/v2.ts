import { Query } from "https://deno.land/x/twitterql@0.1.2/src/types/mod.ts"

export interface User {
    screenName: string
    exists: boolean
    restId?: string
    protected?: boolean
    hasTweets?: boolean
    guestToken?: string
    queries?: Query[]
}

export interface Ban {
    screenName?: string
    restId?: string
}

export interface SuggestionBan extends Ban {
    banned: boolean
}
export interface SearchBan extends Ban {
    banned: boolean
}

export interface ReplyBan extends Ban {
    recognizable: boolean
    ghostBanned?: boolean
    replyDeboosting?: boolean
}

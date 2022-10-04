import { TwitterAPI } from "../deps.ts"

export interface TwitterRequest {
    client: TwitterAPI
    // get: () => Promise<unknown>
    get: (_: any) => Promise<unknown>
}

// export class GetSearchAdaptive implements TwitterRequest {
//     get = async () => {
//         return {}
//     }
// }

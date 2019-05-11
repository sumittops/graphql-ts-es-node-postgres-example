import { Client } from "elasticsearch";

export const USER_ACTION =  'user-action'
export type ServerContext = {
    es_client: Client
}
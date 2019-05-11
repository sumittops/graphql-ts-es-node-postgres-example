import { Client } from 'elasticsearch'
import { USER_ACTION } from '../types/constants'
export const createElasticsearchClient = async () => {
    const client = new Client({
        host: "http://localhost:9200"
    })

    async function createUserActionIndex() {
        const res = await client.indices.exists({ index: USER_ACTION}) 
        if (!res) {
            await client.indices.create({ index: USER_ACTION })
        }
    }

    createUserActionIndex()
    return client
}
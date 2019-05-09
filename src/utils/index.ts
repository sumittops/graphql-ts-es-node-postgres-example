import { getConnectionOptions, createConnection } from "typeorm";
import { Client } from 'elasticsearch'

export const createTypeormConnection = async () => {
    const connectOptions = await getConnectionOptions(process.env.NODE_ENV)
    return await createConnection({ ...connectOptions, name: "default" })
}

export const createElasticsearchClient = () => new Client({
    host: "http://localhost:9200"
})
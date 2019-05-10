import { getConnectionOptions, createConnection } from "typeorm";
import { Client } from 'elasticsearch'
import { ValidationError } from "yup";

export const createTypeormConnection = async () => {
    const connectOptions = await getConnectionOptions(process.env.NODE_ENV)
    return await createConnection({ ...connectOptions, name: "default" })
}

export const createElasticsearchClient = () => new Client({
    host: "http://localhost:9200"
})

export const formatYupError = (err: ValidationError) => {
    return [{
        message: err.message,
        path: err.path,
    }]
}
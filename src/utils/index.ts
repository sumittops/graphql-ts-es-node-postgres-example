import { getConnectionOptions, createConnection } from "typeorm";
import { ValidationError } from "yup";
export * from './createElasticsearchClient'
export const createTypeormConnection = async () => {
    const connectOptions = await getConnectionOptions(process.env.NODE_ENV)
    return await createConnection({ ...connectOptions, name: "default" })
}

export const formatYupError = (err: ValidationError) => {
    return [{
        message: err.message,
        path: err.path,
    }]
}
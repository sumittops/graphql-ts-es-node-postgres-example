import { getConnectionOptions, createConnection } from "typeorm";


export const createTypeormConnection = async () => {
    const connectOptions = await getConnectionOptions(process.env.NODE_ENV)
    return await createConnection(connectOptions)
}
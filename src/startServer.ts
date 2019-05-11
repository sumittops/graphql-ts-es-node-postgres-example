import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import * as path from 'path'
import * as fs from 'fs'
import { createTypeormConnection, createElasticsearchClient } from './utils';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { Server as HttpServer } from 'http'
import { Server as HttpsServer } from 'https'
const getSchemas = () => {
    const schemas: GraphQLSchema[] = []
    const folders = fs.readdirSync(path.resolve(__dirname, 'modules'))
    folders.forEach(folder => {
        const resolvers = require(`./modules/${folder}/resolvers/index`)
        const typeDefs = importSchema(
            path.resolve(__dirname, `./modules/${folder}/schema.graphql`)
        )
        schemas.push(
            makeExecutableSchema({ resolvers, typeDefs })
        )
    })
    return schemas
}

export async function  startServer(): Promise<HttpServer | HttpsServer>{ 
    await createTypeormConnection()
    const es_client = await createElasticsearchClient()
    const port = process.env.NODE_ENV === 'test' ? 0 : 4000
    const server  = new GraphQLServer({
        schema: mergeSchemas({ schemas: getSchemas() }),
        context: () => ({
            es_client
        })
    })
    const app: HttpServer | HttpsServer = await server.start({ port })
    console.log(`server is running on port ${[port]}`)
    return app
}


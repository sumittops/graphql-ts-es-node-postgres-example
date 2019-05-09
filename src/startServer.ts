import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import * as path from 'path'
import * as fs from 'fs'
import { createTypeormConnection, createElasticsearchClient } from './utils';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';

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

export const startServer = async () => {
    const server = new GraphQLServer({
        schema: mergeSchemas({ schemas: getSchemas() })
    })
    
    const connection = await createTypeormConnection()
    const elasticClient = createElasticsearchClient()
    const port = process.env.NODE_ENV === 'test' ? 0 : 4000
    const http = await server.start({ port })
    console.log('server is running on port 4000')
    return http
}


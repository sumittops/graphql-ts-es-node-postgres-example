import 'reflect-metadata'
import { GraphQLServer } from 'graphql-yoga'
import { importSchema } from 'graphql-import'
import resolvers from './resolvers'
import * as path from 'path'
import { createTypeormConnection } from './utils';


export const startServer = async () => {
    
    const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'))
    const server = new GraphQLServer({ typeDefs, resolvers })
    
    await createTypeormConnection()
    await server.start()
    console.log('server is running on port 4000')
}

startServer()


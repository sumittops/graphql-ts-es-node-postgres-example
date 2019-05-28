import * as express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { importSchema } from 'graphql-import'
import * as path from 'path'
import * as fs from 'fs'
import * as cookieParser from 'cookie-parser'
import { createTypeormConnection, createElasticsearchClient, getTokensFromRefreshToken } from './utils';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from './utils/constants';
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


export async function  startServer(){ 
    await createTypeormConnection()
    const es_client = await createElasticsearchClient()
    const port = process.env.NODE_ENV === 'test' ? 0 : 4000
    const server  = new ApolloServer({
        schema: mergeSchemas({ schemas: getSchemas() }),
        context: (props) => ({
            ...props,
            es_client
        }),
        
    })
    const app = express()
    app.use(cookieParser())

    app.use(async (req, res, next) => {
        const accessToken = req.cookies['access-token']
        const refreshToken = req.cookies['refresh-token']
        try {
            const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any
            (req as any).userId = data.userId;
        } catch (e) {
            if (!refreshToken) 
                return next()
            const tokens = await getTokensFromRefreshToken(req, refreshToken)
            if (tokens) {
                res.cookie('access-token', tokens.accessToken)
                res.cookie('refresh-token', tokens.refreshToken)
            }
        }
        next()
        
    })

    server.applyMiddleware({ app })
    return app.listen({ port }, () => {
        console.log(`server is running on http://localhost:${port}${server.graphqlPath}`)
    })
}


import { pick } from 'lodash';
import { createConnection, getConnectionOptions } from "typeorm";
import { ValidationError } from "yup";
import { User } from "../entity/User";
import { sign, verify } from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } from './constants'
export * from './createElasticsearchClient';
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

export function toResponseUser(user: User){
    return pick(user, ['name', 'email'])
}

export const createAccessTokens = (user: User) => {
    const refreshToken = sign({ 
        userId: user.id,
        count: user.count
    }, REFRESH_TOKEN_SECRET, { 
        expiresIn: "15d"
    });

    const accessToken = sign({ userId: user.id }, 
        ACCESS_TOKEN_SECRET, { 
        expiresIn: "15s"
    });
    return { accessToken, refreshToken }
}

export async function getTokensFromRefreshToken(req: any, refreshToken: string) {
    let data;
    try {
        data = verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
        const user = await User.findOne(data.userId);
        if (!user || user.count !== data.count)
            return null;
        req.userId = user.id;
        return createAccessTokens(user);
    } catch(e){
        return null;
    }
} 
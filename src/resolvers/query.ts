import { User } from "../entity/User";


const hello = (_: any, { name }: GQL.IHelloOnQueryArguments) => {
    return `Hello ${ name || 'World'}`;
}

const user = async (_: any, { email }: GQL.IUser) => {
    const user = await User.findOne({
        where: {
            email
        }
    });
    return user
}

const users = async (_:any, {}: GQL.IUserOnQueryArguments) => {
    const users = await User.find()
    return users
}

const resolvers = {
    hello,
    user,
    users
}

export default resolvers
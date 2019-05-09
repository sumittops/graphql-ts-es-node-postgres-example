import { User } from "../../../entity/User";

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
    return users || []
}

const resolvers = {
    user,
    users
}

export default resolvers
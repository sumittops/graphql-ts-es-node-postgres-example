import { compare } from "bcryptjs";
import { User } from "../../../entity/User";
import { toResponseUser, createAccessTokens } from "../../../utils";
const login = async (_: any, {  email, password }: GQL.IUser, { res} : any) => {
    const user = await User.findOne({
        where: {
            email
        }
    });
    if (!user)
        throw new Error("Invalid credentials. Please try again.")

    const valid = await compare(password, user.password)
    if (!valid) {
        throw new Error("Invalid credentials. Please try again.")
    }
    const { refreshToken, accessToken } = createAccessTokens(user)
    res.cookie("refresh-token", refreshToken);
    res.cookie("access-token", accessToken);
    return toResponseUser(user);
}

const me = async (_:any, {}: GQL.IUserOnQueryArguments, { req }: any) => {
    if (!req.userId)
        return null
    const accessToken = req.cookies['access-token']
    if (!accessToken)
        return null
    
    const { userId } = req
    const user = await User.findOne({ id: userId })
    if (!user)
        return null
    return toResponseUser(user)
}

const signout = async(_: any, {}, { req }: any) => {
    if (!req.userId)
        return false;
    const user = await User.findOne(req.userId)
    if (!user)
        return false;
    user.count += 1;
    await user.save()
    return true;
}

const resolvers = {
    login,
    me,
    signout
}

export default resolvers
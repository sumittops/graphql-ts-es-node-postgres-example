import * as bcrypt from 'bcryptjs'
import { User } from '../../../entity/User';

const register = async (_: any, { email, password, name }: GQL.IRegisterOnMutationArguments) => {

    const userExists = await User.findOne({
        where: {
            email: email
        },
        select: ['id']
    })
    
    if (userExists) {
        return false
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({
        email, 
        password: hashed,
        name
    })
    await user.save()
    return true
}

export default { 
    register
}
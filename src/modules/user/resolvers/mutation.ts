import * as bcrypt from 'bcryptjs'
import { User } from '../../../entity/User';
import * as yup from 'yup'
import { formatYupError } from '../../../utils';
import { emailError, passwordError, nameError } from '../errorMessages';

const validationSchema = yup.object().shape({
    email: yup.string().max(255, emailError.max).min(3, emailError.min).email(emailError.email),
    password: yup.string().max(255, passwordError.max).min(3, passwordError.min),
    name: yup.string().min(3, nameError.min).max(100, nameError.max)
})

const register = async (_: any, args: GQL.IRegisterOnMutationArguments) => {
    try {
        await validationSchema.validate(args)
    } catch(e) {
        return formatYupError(e)
    }
    const { email, name, password } = args
    const userExists = await User.findOne({
        where: {
            email: email
        },
        select: ['id']
    })
    
    if (userExists) {
        return [{
                path: "email",
                message: "already exists"
        }]
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({
        email, 
        password: hashed,
        name
    })
    await user.save()
    return null
}

export default { 
    register
}
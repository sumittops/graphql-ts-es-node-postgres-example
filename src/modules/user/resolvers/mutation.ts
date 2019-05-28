import * as bcrypt from 'bcryptjs'
import { User } from '../../../entity/User';
import * as yup from 'yup'
import { formatYupError } from '../../../utils';
import { emailError, passwordError, nameError } from '../errorMessages';
import { USER_ACTION, ServerContext } from '../../../types/constants';

const validationSchema = yup.object().shape({
    email: yup.string().max(255, emailError.max).min(3, emailError.min).email(emailError.email),
    password: yup.string().max(255, passwordError.max).min(3, passwordError.min),
    name: yup.string().min(3, nameError.min).max(100, nameError.max)
})

const register = async (_: any, 
    args: GQL.IRegisterOnMutationArguments,
    context: ServerContext) => {
    try {
        await validationSchema.validate(args)
    } catch(e) {
        return formatYupError(e)
    }
    const { email, name } = args
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

    const password = await bcrypt.hash(args.password, 10)
    const user = await User.create({

        email, 
        password,
        name
    })
    await user.save()
    const { es_client } = context
    await es_client.index({
        index: USER_ACTION,
        type: 'user_reg',
        body: {
            email,
            name,
            time: (new Date()).toISOString()
        }
    })
    
    return null
}

export default { 
    register
}
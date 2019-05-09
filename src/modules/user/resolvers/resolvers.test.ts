import { startServer } from "../../../startServer";
import { request } from 'graphql-request'
import { User } from "../../../entity/User";

let getHost = () => '';

beforeAll(async () => {
    const app = await startServer()
    const { port }: any = app.address()
    getHost = () => `http://127.0.0.1:${port}`
})
 


test('Registration works', async() => {
    const email = 'bob@bobby.com'
    const name = 'Bob Sanchez'
    const password = 'BobSanchezRulez'

    const mutation = `
        mutation {
            register(email: "${email}", password: "${password}", name: "${name}")
        }
    `

    const response = await request(getHost(), mutation)
    expect(response).toEqual({ register: true })
    const users =  await User.find({
        where: { email }
    })
    expect(users).toHaveLength(1)
    const user = users[0]
    expect(user.email).toBe(email)
    expect(user.name).toBe(name)
    expect(user.password).not.toBe(password)
})
import { startServer } from "../../../startServer";
import { request } from 'graphql-request'
import { User } from "../../../entity/User";
import { nameError } from "../errorMessages";
// import { formatYupError } from "src/utils";



describe('Test User module', () => {
    
    let getHost = () => '';
    
    beforeAll(async () => {
        const app = await startServer()
        const { port }: any = app.address()
        getHost = () => `http://127.0.0.1:${port}`
    })

    const mutation = (e: string, p: string, n: string) => `
        mutation {
            register(email: "${e}", password: "${p}", name: "${n}") {
                path,
                message
            }
        }
    `

    test('Query empty user database', async () => {
        const query = `
            {
                users {
                    id
                    name
                    email
                }
            }
        `

        const response = await request(getHost(), query)
        expect(response).toEqual({
            users: []
        })
    })
    
    test('New Registration Works', async() => {
        const email = 'bob@bobby.com'
        const name = 'Bob Sanchez'
        const password = 'BobSanchezRulez'
                
        const response = await request(getHost(), mutation(email, password, name))
        expect(response).toEqual({ register: null })
        const users =  await User.find({
            where: { email }
        })
        expect(users).toHaveLength(1)
        const user = users[0]
        expect(user.email).toBe(email)
        expect(user.name).toBe(name)
        expect(user.password).not.toBe(password)
    })

    test('user(email) query', async () => {
        const user = { 
            name: 'Bob Sanchez', email: 'bob@bobby.com'
        }
        const query = `
            {
                user(email: "${user.email}") {
                    name
                    email
                }
            }
        `
        const response = await request(getHost(), query)
        expect(response).toEqual({
            user: user
        })
    })

    test('Duplicate email registration detection works', async() => {
        const email = 'bob@bobby.com'
        const name = 'Bob Sanchez'
        const password = 'BobSanchezRulez'
                
        const response = await request(getHost(), mutation(email, password, name))
        expect(response).toEqual({ register: [{ path: "email", message: "already exists"}] })
    })

    test('validate for correct name length', async () => {
        const email = 'bob@bobdylan.com'
        const name = 'bd'
        const password = 'bsdasdasdqer'

        const response = await request(getHost(), mutation(email, password, name))

        expect(response).toEqual({ register: [
            { path: "name", message: nameError.min}    
        ]})
    })

})
import { startServer } from "../../../startServer";
import fetch from 'node-fetch'


describe('test user analytics module', () => {
    let es_host = 'http://localhost:9200/';
    beforeAll(async () => {
        await startServer()
    })

    test('availability of es cluster', async () => {
        const response = await fetch(es_host)
        const data = await response.json()
        expect(data.name.length).toBeGreaterThan(0)
    })
})
import { ServerContext, USER_ACTION } from '../../../types/constants'

export default {
    userAnalytics: async(
        _: any,
        { type, filterName, filterValue }: any, 
        { es_client } : ServerContext
        )  => {

        const response = await es_client.search({
            index: USER_ACTION,
            type: type || 'user_reg',
            body: {
                query: {
                    match: {
                        [filterName]: filterValue
                    }
                }
            }
        })
        return response.hits.hits
    }
}
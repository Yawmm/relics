import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {getCookie} from "cookies-next";

const httpLink = createHttpLink({
    uri: "http://localhost:5187/graphql"
});

const authLink = setContext(async (_, { headers }) => {
    const token = await getCookie("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;
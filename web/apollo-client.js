import {ApolloClient, createHttpLink, InMemoryCache, split} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {getCookie} from "cookies-next";
import {createClient} from 'graphql-ws';
import {getMainDefinition} from "@apollo/client/utilities";

const url = "relics-27392ddfcb64.herokuapp.com";

const wsLink = new GraphQLWsLink(createClient({
    url: `ws://${url}/graphql`,
}));

const baseHttpLink = createHttpLink({
    uri: `http://${url}/graphql`
});

const authLink = setContext(async (_, { headers }) => {
    const token = await getCookie("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

const httpLink = authLink.concat(baseHttpLink);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;
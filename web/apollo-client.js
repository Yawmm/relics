import {ApolloClient, createHttpLink, InMemoryCache, split} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {getCookie} from "cookies-next";
import {createClient} from 'graphql-ws';
import {getMainDefinition} from "@apollo/client/utilities";

// eslint-disable-next-line no-undef
const useSsl = !(process.env.NEXT_PUBLIC_API_SSL.toLowerCase() === "false");

let timedOut;
const wsLink = new GraphQLWsLink(createClient({
    // eslint-disable-next-line no-undef
    url: `ws${useSsl ? "s" : ""}://${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    lazy: true,
    keepAlive: 10_000,
    retryAttempt: 30,
    // See https://github.com/enisdenjo/graphql-ws/discussions/290.
    on: {
        ping: (received) => {
            if (!received /* sent */) {
                // eslint-disable-next-line no-undef
                timedOut = setTimeout(() => {
                    // a close event `4499: Terminated` is issued to the current WebSocket and an
                    // artificial `{ code: 4499, reason: 'Terminated', wasClean: false }` close-event-like
                    // object is immediately emitted without waiting for the one coming from `WebSocket.onclose`
                    //
                    // calling terminate is not considered fatal and a connection retry will occur as expected
                    //
                    // see: https://github.com/enisdenjo/graphql-ws/discussions/290
                    wsLink.client.terminate();
                }, 5_000);
            }
        },
        pong: (received) => {
            if (received) {
                // eslint-disable-next-line no-undef
                clearTimeout(timedOut);
            }
        },
    }
}));

const baseHttpLink = createHttpLink({
    // eslint-disable-next-line no-undef
    uri: `http${useSsl ? "s" : ""}://${process.env.NEXT_PUBLIC_API_URL}/graphql`
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
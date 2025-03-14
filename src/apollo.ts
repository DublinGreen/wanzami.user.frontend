import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
// @ts-ignore
import store from "@/store/index.js"

// 🔹 Authentication GraphQL Client
const authHttpLink = createHttpLink({
    uri: store.state.tokenRequiredBackendUrl
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

const authApolloClient = new ApolloClient({
    link: authLink.concat(authHttpLink),
    cache: new InMemoryCache(),
});

export const apolloClients = {
    default: authApolloClient,
};

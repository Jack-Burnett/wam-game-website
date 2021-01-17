
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

// 1. Create an Apollo client and pass it to all child components
//    (uses svelte's built-in context)
export const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});
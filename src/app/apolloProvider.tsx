"use client";

import { ApolloProvider } from "@apollo/client/react";
import {
    ApolloClient,
    InMemoryCache,
    HttpLink
} from "@apollo/client";

const client = new ApolloClient({
    link : new HttpLink({
        uri : "/api/graphql",
    }),
    cache : new InMemoryCache(),
});

export function Providors({children} : {children : React.ReactNode}){
    return <ApolloProvider client={client}>{children}</ApolloProvider>
}
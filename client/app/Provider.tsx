"use client";

import React, { ReactNode } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { AppShell } from "@co-design/core";
import { Header } from "@/components";
import { setContext } from "@apollo/client/link/context";
import nookies from "nookies";

const httpLink = createHttpLink({
  uri: "http://localhost:1337/graphql",
});

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem("token");
  const { token } = nookies.get();

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const header = (
  <AppShell.Header height={70}>
    <Header />
  </AppShell.Header>
);

function Provider({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AppShell fixed header={header}>
        {children}
      </AppShell>
    </ApolloProvider>
  );
}

export default Provider;

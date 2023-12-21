"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { AppShell } from "@co-design/core";
import { Header } from "@/components";
import { setContext } from "@apollo/client/link/context";
import nookies, { parseCookies } from "nookies";

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

function Provider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const { token } = parseCookies();
    setToken(token);
  }, []);

  const header = (
    <AppShell.Header height={70}>
      <Header token={token} />
    </AppShell.Header>
  );

  return (
    <ApolloProvider client={client}>
      <AppShell fixed header={header}>
        {children}
      </AppShell>
    </ApolloProvider>
  );
}

export default Provider;

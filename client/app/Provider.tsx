"use client";

import React, { ReactNode } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AppShell } from "@co-design/core";
import { Header } from "@/components";

const header = (
  <AppShell.Header height={70}>
    <Header />
  </AppShell.Header>
);

const client = new ApolloClient({
  uri: "http://localhost:1337/graphql",
  cache: new InMemoryCache(),
});

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

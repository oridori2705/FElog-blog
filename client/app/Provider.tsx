"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { AppShell } from "@co-design/core";
import { Header } from "@/components";
import { setContext } from "@apollo/client/link/context";
import nookies, { parseCookies } from "nookies";
import { User } from "@/interfaces";
import { AppContext } from "next/app";

const httpLink = createHttpLink({
  uri: "http://localhost:1337/graphql",
});

import { createContext, useContext } from "react";

const MyContext = createContext<User | null>(null);

const authLink = setContext((_, { nextContext, headers }) => {
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
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const fetchData = async () => {
    const { token } = parseCookies();
    if (token) {
      setToken(token);
      const QUERY = gql`
        query Me {
          me {
            id
            username
            email
          }
        }
      `;
      try {
        const { data } = await client.query<{ me: User }>({
          query: QUERY,
        });
        setUserInfo(data.me);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const header = (
    <AppShell.Header height={70}>
      <Header token={token} />
    </AppShell.Header>
  );

  return (
    <ApolloProvider client={client}>
      <MyContext.Provider value={userInfo}>
        <AppShell fixed header={header}>
          {children}
        </AppShell>
      </MyContext.Provider>
    </ApolloProvider>
  );
}

export const useMyContext = () => useContext(MyContext);

export default Provider;

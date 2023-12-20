"use client";

import { gql, useQuery } from "@apollo/client";
import { Card, Button } from "@co-design/core";

const GET_POSTS = gql`
  query GetPost {
    posts {
      data {
        id
        attributes {
          title
          body
          createdAt
          user {
            data {
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_POSTS);
  console.log(data);
  return <div></div>;
}

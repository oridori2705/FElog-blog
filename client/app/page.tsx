"use client";

import { gql, useQuery } from "@apollo/client";
import {
  Card,
  Heading,
  Text,
  Divider,
  EquallyGrid,
  Spinner,
  Container,
  AppShell,
  Stack,
  View,
  Button,
} from "@co-design/core";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

const GET_POSTS = gql`
  query GetPosts {
    posts(sort: ["createdAt:desc"]) {
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
  const [token, setToken] = useState("");
  useEffect(() => {
    const { token } = parseCookies();
    setToken(token);
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div>
      <Container padding={16} co={{ marginTop: 16 }}>
        {loading ? (
          <Spinner />
        ) : (
          <Stack>
            {token && (
              <View co={{ textAlign: "right" }}>
                <Link href={"/posts/create"}>
                  <Button>글쓰기</Button>
                </Link>
              </View>
            )}
            <EquallyGrid cols={4}>
              {data &&
                data.posts.data.map((post: any) => (
                  <Card key={post.id}>
                    <Link href="/posts/[id]" as={`posts/${post.id}`}>
                      <Heading level={4}>{post.attributes.title}</Heading>
                    </Link>
                    <Text lineClamp={3}>
                      {post.attributes.body && (
                        <BlocksRenderer content={post.attributes.body} />
                      )}
                    </Text>
                    <Divider />

                    <Text block align="right">
                      {post.attributes.user.data.attributes.username}
                    </Text>
                  </Card>
                ))}
            </EquallyGrid>
          </Stack>
        )}
      </Container>
    </div>
  );
}

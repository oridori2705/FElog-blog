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
} from "@co-design/core";
import { Header } from "@/components";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const GET_POSTS = gql`
  query GetPosts {
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
  console.log(data && data.posts);
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div>
      <Container padding={16} co={{ marginTop: 16 }}>
        {loading ? (
          <Spinner />
        ) : (
          <EquallyGrid cols={4}>
            {data &&
              data.posts.data.map((post: any) => (
                <Card key={post.id}>
                  <Link href="/posts/[id]" as={`posts/${post.id}`}>
                    <Heading level={4}>{post.attributes.title}</Heading>
                  </Link>
                  </Text>
                  <Divider />

                  <Text block align="right">
                    {post.attributes.user.data.attributes.username}
                  </Text>
                </Card>
              ))}
          </EquallyGrid>
        )}
      </Container>
    </div>
  );
}

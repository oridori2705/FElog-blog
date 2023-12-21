"use client";

import { User } from "@/interfaces";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Container,
  Divider,
  Group,
  Heading,
  Spinner,
  Text,
} from "@co-design/core";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { useParams } from "next/navigation";
import { useMyContext } from "@/app/Provider";

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      data {
        id
        attributes {
          title
          body
          user {
            data {
              id
              attributes {
                username
                email
              }
            }
          }
        }
      }
    }
  }
`;

const PostDetail = () => {
  const me = useMyContext();
  console.log(me);
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: params.id },
  });

  return (
    <Container size="small" co={{ marginTop: 16 }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {me?.id === data.post.data.attributes.user.data.id && (
            <Group spacing={8} position="right">
              <Button style={{ backgroundColor: "red" }}>삭제</Button>
              <Button>수정</Button>
            </Group>
          )}

          <Heading>{data.post.data.attributes.title}</Heading>
          <Divider />
          <Text>
            {data.post.data.attributes.body && (
              <BlocksRenderer content={data.post.data.attributes.body} />
            )}
          </Text>
          <Divider />
          <Text size="small">
            {data.post.data.attributes.user.data.attributes.username} |
            {data.post.data.attributes.user.data.attributes.email}
          </Text>
        </>
      )}
    </Container>
  );
};

export default PostDetail;

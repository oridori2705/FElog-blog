"use client";

import { gql, useQuery } from "@apollo/client";
import { Container, Divider, Heading, Spinner, Text } from "@co-design/core";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { useParams } from "next/navigation";

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
  const params = useParams<{ id: string }>();
  console.log(params);
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: params.id },
  });

  return (
    <Container size="small" co={{ marginTop: 16 }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
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

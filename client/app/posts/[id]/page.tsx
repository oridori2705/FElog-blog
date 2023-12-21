"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
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
import { useParams, useRouter } from "next/navigation";
import { useMyContext } from "@/app/Provider";
import { useCallback } from "react";
import Link from "next/link";

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

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      data {
        id
      }
    }
  }
`;

const PostDetail = () => {
  const me = useMyContext();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: params.id },
  });
  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = useCallback(async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      await deletePost({
        refetchQueries: ["GetPosts"],
        variables: { id: params.id },
      });
      router.push("/");
    }
  }, [deletePost, router, params]);

  return (
    <Container size="small" co={{ marginTop: 16 }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {me?.id === data.post.data.attributes.user.data.id && (
            <Group spacing={8} position="right">
              <Button style={{ backgroundColor: "red" }} onClick={handleDelete}>
                삭제
              </Button>
              <Link href="/posts/[id]/edit" as={`/posts/${data.post.id}/edit`}>
                <Button>수정</Button>
              </Link>
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

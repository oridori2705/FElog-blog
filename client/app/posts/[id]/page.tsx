"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
} from "@co-design/core";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { useParams, useRouter } from "next/navigation";
import { useMyContext } from "@/app/Provider";
import { useCallback } from "react";
import Link from "next/link";
import { useLoading } from "@co-design/hooks";

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

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(data: { post: $postId, body: $body }) {
      data {
        id
        attributes {
          body
        }
      }
    }
  }
`;

const GET_COMMENTS = gql`
  query getComments($postId: ID) {
    comments(
      filters: { post: { id: { eq: $postId } } }
      sort: ["createdAt:desc"]
    ) {
      data {
        id
        attributes {
          body
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

interface FormElements extends HTMLFormElement {
  body: HTMLInputElement;
}

interface Comment {
  id: string;
  attributes: {
    body: string;
    user: {
      data: {
        attributes: {
          username: string;
        };
      };
    };
  };
}

const PostDetail = () => {
  const me = useMyContext();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: params.id },
  });
  const [deletePost] = useMutation(DELETE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commnetsError,
  } = useQuery(GET_COMMENTS, { variables: { postId: params.id } });
  const handleDelete = useCallback(async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      await deletePost({
        refetchQueries: ["GetPosts"],
        variables: { id: params.id },
      });
      router.push("/");
    }
  }, [deletePost, router, params]);

  const hanldeCommentCreate = useCallback(
    async (e: React.FormEvent<FormElements>) => {
      e.preventDefault();
      const elements: FormElements = e.currentTarget;
      const body = elements.body.value;
      e.currentTarget.body.value = "";
      await createComment({
        refetchQueries: ["GetComments"],
        variables: { postId: params.id, body },
      });
    },

    [createComment, params]
  );
  const [commentLoading, handleLoadingCreateComment] =
    useLoading(hanldeCommentCreate);

  return (
    <Container size="small" co={{ marginTop: 16 }}>
      {loading ? (
        <Spinner />
      ) : (
        <Stack>
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
          <div>
            <Heading>{data.post.data.attributes.title}</Heading>
            <Text size="small">
              작성자 : {data.post.data.attributes.user.data.attributes.username}{" "}
              |{data.post.data.attributes.user.data.attributes.email}
            </Text>
          </div>
          <Divider />
          <Text>
            {data.post.data.attributes.body && (
              <BlocksRenderer content={data.post.data.attributes.body} />
            )}
          </Text>
          <Divider />
          <Stack>
            <Heading level={5}>Comment</Heading>
            <form onSubmit={handleLoadingCreateComment}>
              <Group>
                <input placeholder="Comment" name="body" style={{ flex: 1 }} />
                <Button loading={commentLoading} type="submit">
                  Save
                </Button>
              </Group>
            </form>
            {commentLoading ? (
              <Spinner />
            ) : (
              commentsData?.comments.data.map((comment: Comment) => (
                <Card key={comment.id}>
                  <Text block strong>
                    {comment.attributes.body}
                  </Text>
                  <Text block size="small">
                    {comment.attributes.user.data.attributes.username}
                  </Text>
                </Card>
              ))
            )}
          </Stack>
        </Stack>
      )}
    </Container>
  );
};

export default PostDetail;

"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Container,
  Divider,
  Heading,
  Spinner,
  Stack,
} from "@co-design/core";
import { useToggle } from "@co-design/hooks";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";

interface FormElements extends HTMLFormElement {
  titleInput: HTMLInputElement;
  body: HTMLTextAreaElement;
}

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $body: String!) {
    updatePost(
      id: $id
      data: {
        title: $title
        body: [{ type: "paragraph", children: [{ type: "text", text: $body }] }]
      }
    ) {
      data {
        id
      }
    }
  }
`;

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

const PostEdit = () => {
  const [submitLoading, toggleLoading] = useToggle();
  const [updatePost] = useMutation(UPDATE_POST);
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: params.id },
  });
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<FormElements>) => {
      e.preventDefault();

      toggleLoading(true);
      const elements: FormElements = e.currentTarget;
      const title = elements.titleInput.value;
      const body = elements.body.value;
      await updatePost({
        refetchQueries: ["GetPosts"],
        variables: { id: params.id, title, body },
      });
      toggleLoading(false);
      router.push("/");
    },
    [updatePost, toggleLoading, router]
  );

  return (
    <Container size={900} padding={16} co={{ marginTop: 16 }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Heading level={3} strong>
            Edit Post
          </Heading>
          <Divider />
          <form onSubmit={handleSubmit}>
            <Stack>
              <input
                placeholder="Title"
                name="titleInput"
                type="text"
                defaultValue={data.post.data.attributes.title}
                style={{
                  padding: "10px",
                  border: "solid 2px #1E90FF",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
              />
              <textarea
                placeholder="Body"
                name="body"
                rows={20}
                defaultValue={
                  data.post.data.attributes.body[0].children[0].text
                }
                style={{
                  height: "200px",
                  resize: "none",
                  padding: "10px",
                  boxSizing: "border-box",
                  border: "solid 2px #1E90FF",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
              />
              <Button type="submit" loading={submitLoading}>
                Edit
              </Button>
            </Stack>
          </form>
        </>
      )}
    </Container>
  );
};

export default PostEdit;

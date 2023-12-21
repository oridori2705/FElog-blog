"use client";

import { gql, useMutation } from "@apollo/client";
import { Button, Container, Divider, Heading, Stack } from "@co-design/core";
import { useToggle } from "@co-design/hooks";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface FormElements extends HTMLFormElement {
  titleInput: HTMLInputElement;
  body: HTMLTextAreaElement;
}

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(
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

const CreatePost = () => {
  const [loading, toggleLoading] = useToggle();
  const [createPost] = useMutation(CREATE_POST);

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<FormElements>) => {
      e.preventDefault();

      toggleLoading(true);
      const elements: FormElements = e.currentTarget;
      const title = elements.titleInput.value;
      const body = elements.body.value;
      await createPost({ variables: { title, body } });
      toggleLoading(false);
      router.push("/");
    },
    [createPost, toggleLoading, router]
  );

  return (
    <Container size={900} padding={16} co={{ marginTop: 16 }}>
      <Heading level={3} strong>
        Create Post
      </Heading>
      <Divider />
      <form onSubmit={handleSubmit}>
        <Stack>
          <input
            placeholder="Title"
            name="titleInput"
            type="text"
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
          <Button type="submit" loading={loading}>
            create
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default CreatePost;

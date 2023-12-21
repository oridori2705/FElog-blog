"use client";

import { gql, useMutation } from "@apollo/client";
import { Button, Container, Divider, Heading, Stack } from "@co-design/core";
import { useToggle } from "@co-design/hooks";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import nookies, { parseCookies } from "nookies";

interface FormElements extends HTMLFormElement {
  username: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
}

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(
      input: { username: $username, email: $email, password: $password }
    ) {
      jwt
    }
  }
`;

const SignUp = () => {
  const [loading, toggleLoading] = useToggle();
  const [register] = useMutation(REGISTER);
  const router = useRouter();

  useEffect(() => {
    const { token } = parseCookies();

    // 토큰이 존재하면 다른 페이지로 리다이렉션
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<FormElements>) => {
      e.preventDefault();
      toggleLoading(true);

      const elements: FormElements = e.currentTarget;
      const username = elements.username.value;
      const email = elements.email.value;
      const password = elements.password.value;

      const result = await register({
        variables: { username, email, password },
      });
      nookies.set(null, "token", result.data.register.jwt, { path: "/" });
      toggleLoading(false);
      router.push("/");
    },
    [toggleLoading, router, register]
  );

  return (
    <Container size="xsmall" padding={16} co={{ marginTop: 16 }}>
      <Heading strong level={3}>
        Sign Up
      </Heading>
      <Divider />
      <form onSubmit={handleSubmit}>
        <Stack>
          <input type="text" placeholder="Username" name="username" />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <Button type="submit" loading={loading}>
            Sign Up
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default SignUp;

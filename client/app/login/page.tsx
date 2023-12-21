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

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
    }
  }
`;

const SignUp = () => {
  const [loading, toggleLoading] = useToggle();
  const [login] = useMutation(LOGIN);
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
      const email = elements.email.value;
      const password = elements.password.value;

      const result = await login({
        variables: { email, password },
      });
      nookies.set(null, "token", result.data.login.jwt, { path: "/" });
      toggleLoading(false);
      router.push("/");
    },
    [toggleLoading, router, login]
  );

  return (
    <Container size="xsmall" padding={16} co={{ marginTop: 16 }}>
      <Heading strong level={3}>
        Sign Up
      </Heading>
      <Divider />
      <form onSubmit={handleSubmit}>
        <Stack>
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <Button type="submit" loading={loading}>
            Login
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default SignUp;

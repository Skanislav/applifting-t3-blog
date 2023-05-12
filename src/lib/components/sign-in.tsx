import React from "react";
import { Button, Group, Modal, NavLink, Space, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { notifications } from "@mantine/notifications";

type SignInRequest = {
  username: string;
  password: string;
};

async function signInRequest(data: SignInRequest) {
  const result = await signIn(
    "credentials",
    { ...data, redirect: false },
    { redirect: "/" }
  );

  if (result?.error) {
    console.log(result.error);
    throw new Error("Error signing in");
  } else {
    console.log(result);
    return true;
  }
}

export function SignInModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm<SignInRequest>({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isLoading } = useMutation(signInRequest, {
    onSuccess: () => {
      notifications.show({
        title: "Signed in",
        message: "You have successfully signed in",
      });
      close();
    },
    onError: () => {
      form.setErrors({ password: "Could not sign in" });
    },
  });

  const onSubmit = (data: SignInRequest) => {
    mutate(data);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            withAsterisk
            label="Username"
            required
            placeholder="skas"
            type={"username"}
            {...form.getInputProps("username")}
          />
          <Space h={15} />
          <TextInput
            withAsterisk
            label="Password"
            required
            placeholder="********"
            type={"password"}
            {...form.getInputProps("password")}
          />

          <Group position="right" mt="md">
            <Button disabled={isLoading} type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Modal>

      <NavLink onClick={open} label={"Sign In"} />
    </>
  );
}

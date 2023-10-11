"use client";

import {
  BackgroundImage,
  Button,
  Group,
  Stack,
  Text,
  Overlay,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

const signup = () => {
  console.log("clicked sign up");
};

export default function Home() {
  return (
    <BackgroundImage src="/splash-page-background.png" h="100vh">
      <Overlay color="#000" backgroundOpacity={0.5} zIndex={0} />

      <Group justify="flex-end" p={8} h={50}>
        <Button
          component={Link}
          href="/api/auth/signin"
          variant="outline"
          color="white"
        >
          Sign In
        </Button>

        <Button variant="filled" onClick={signup}>
          Sign Up
        </Button>
      </Group>

      <Stack h="100%" align="center" gap="md" justify="center" mt={-50}>
        <Image
          src="/logo.svg"
          width={0}
          height={0}
          style={{ width: "auto", height: "144px", zIndex: 1 }}
          alt="Kaizen Logo"
        />

        <Text c="white" size="xl" style={{ zIndex: 1 }} mb={16}>
          A personalized tutor for your child, through the power of AI
        </Text>

        <Button variant="filled" onClick={signup}>
          Try Risk Free 7 Day Trial
        </Button>
      </Stack>
    </BackgroundImage>
  );
}

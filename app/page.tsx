"use client";

import {
  BackgroundImage,
  Button,
  Stack,
  Text,
  Overlay,
  Group,
} from "@mantine/core";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <BackgroundImage src="/splash-page-background.png" h="100vh">
      <Overlay color="#000" backgroundOpacity={0.5} zIndex={0} />

      <Group justify="flex-end" p={8} h={50}>
        <Button variant="filled" onClick={() => signIn()}>
          Sign In
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

        <Button variant="filled" onClick={() => signIn()}>
          Try Risk Free 7 Day Trial
        </Button>
      </Stack>
    </BackgroundImage>
  );
}

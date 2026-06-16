import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || "pk_dummy_publishable_key",
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY || "sk_dummy_secret_key",
});

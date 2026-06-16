import { StackServerApp } from "@stackframe/stack";

const app = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  publishableClientKey: "pk_dummy_publishable_key",
  secretServerKey: "sk_dummy_secret_key",
});

console.log("Keys on app:", Object.keys(app));
const proto = Object.getPrototypeOf(app);
console.log("Keys on proto:", Object.getOwnPropertyNames(proto));

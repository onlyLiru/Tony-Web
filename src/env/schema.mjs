// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  /** 后端api地址 */
  UNE_BACKEND_API_URL: z.string(),
  UNE_BLOG_HOST: z.optional(z.string()),
  FATPAY_SECRET_KEY: z.optional(z.string())
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  /** cdn地址 */
  NEXT_PUBLIC_UNE_CDN_URL: z.string(),
  NEXT_PUBLIC_CHAINID: z.string(),
  NEXT_PUBLIC_VERCEL_ENV: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_UNE_CDN_URL: process.env.NEXT_PUBLIC_UNE_CDN_URL,
  NEXT_PUBLIC_CHAINID: process.env.NEXT_PUBLIC_CHAINID,
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
};

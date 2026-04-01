import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  prerender: false,
  appDirectory: "src/app",
} satisfies Config;
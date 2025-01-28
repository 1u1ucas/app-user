import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable specific ESLint rules here
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["off"],
      "react/prop-types": "off",
    },
  },
];

export default eslintConfig;
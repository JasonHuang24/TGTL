import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "_scaffold_reference/**", "tests/**"],
  },
  {
    rules: {
      // Raw apostrophes/quotes in JSX text render correctly and are UTF-8 clean
      // (gate 4 covers real encoding defects). This rule is purely cosmetic.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "react-native",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    "react-native/react-native": true,
    es2022: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    // '@typescript-eslint/prefer-const': 'error', // Removed - using built-in prefer-const
    "@typescript-eslint/no-var-requires": "off",

    // React specific rules
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react/prop-types": "off", // Using TypeScript instead
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // React Native specific rules
    "react-native/no-unused-styles": "error",
    "react-native/no-inline-styles": "warn",
    "react-native/no-color-literals": "off", // Allow colors for NativeWind

    // General rules
    "no-console": "warn",
    "no-debugger": "error",
    "no-alert": "error",
    "no-var": "error",
    "prefer-const": "error",
    "no-unused-expressions": "error",
    "no-duplicate-imports": "error",

    // SOLID principles enforcement
    "max-lines-per-function": ["warn", { max: 50 }], // Single Responsibility
    complexity: ["warn", { max: 10 }], // Single Responsibility
    "max-params": ["warn", { max: 4 }], // Interface Segregation

    // Prettier integration - must match .prettierrc.cjs exactly
    "prettier/prettier": [
      "error",
      {
        semi: true,
        singleQuote: false,
        jsxSingleQuote: false,
        quoteProps: "as-needed",
        trailingComma: "es5",
        tabWidth: 2,
        useTabs: false,
        printWidth: 80,
        endOfLine: "auto",
        arrowParens: "avoid",
        bracketSpacing: true,
        embeddedLanguageFormatting: "auto",
      },
    ],
  },
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["*.config.*", "metro.config.*", "babel.config.*"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "no-undef": "off",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    ".expo/",
    "ios/",
    "android/",
    "dist/",
    "build/",
    "*.config.js",
    "*.config.cjs",
  ],
};

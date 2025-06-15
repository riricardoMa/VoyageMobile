module.exports = {
  // Basic formatting options
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,

  // JSX specific options
  jsxSingleQuote: false,

  // Line endings
  endOfLine: "lf",

  // Other options
  arrowParens: "avoid",
  bracketSpacing: true,
  embeddedLanguageFormatting: "auto",

  // File-specific overrides
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200,
      },
    },
    {
      files: "*.md",
      options: {
        printWidth: 100,
        proseWrap: "always",
      },
    },
  ],

  // Plugin configuration
  plugins: ["prettier-plugin-tailwindcss"],
};

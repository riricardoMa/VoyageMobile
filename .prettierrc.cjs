module.exports = {
  // Basic formatting options
  semi: true,
  singleQuote: false, // Always use double quotes for strings
  quoteProps: "as-needed",
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,

  // JSX specific options
  jsxSingleQuote: false, // Always use double quotes in JSX

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
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      options: {
        singleQuote: false, // Explicitly enforce double quotes for all JS/TS files
        jsxSingleQuote: false, // Explicitly enforce double quotes for all JSX
      },
    },
  ],

  // Plugin configuration
  plugins: ["prettier-plugin-tailwindcss"],
};

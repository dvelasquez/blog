export default {
  useTabs: false,
  singleQuote: false,
  semi: true,
  tabWidth: 2,
  trailingComma: "es5",
  arrowParens: "avoid",
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

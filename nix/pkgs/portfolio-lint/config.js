/* eslint-disable no-undef */
const HEADER_LENGTH_MAX = 82;
const LINE_LENGTH_MAX = 72;
const BODY_LENGTH_MIN = 15;

module.exports = {
  parserPreset: "./.commitlint-parser-preset",
  rules: {
    // Body
    "body-leading-blank": [2, "always"],
    "body-empty": [2, "never"],
    "body-max-line-length": [2, "always", LINE_LENGTH_MAX],
    "body-min-length": [2, "always", BODY_LENGTH_MIN],

    // Footer
    "footer-leading-blank": [2, "always"],
    "footer-max-line-length": [2, "always", LINE_LENGTH_MAX],

    // Header
    "header-case": [2, "always", "lower-case"],
    "header-max-length": [2, "always", HEADER_LENGTH_MAX],

    // Scope
    "scope-empty": [2, "never"],
    "scope-enum": [2, "always", ["front", "back", "infra", "build", "cross"]],

    // Subject (commit title without type and scope)
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],

    // Type
    "type-empty": [2, "never"], //type always
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "perf",
        "fix",
        "rever",
        "style", // Do not affect the meaning of the code (formatting, etc)
        "refac",
        "test",
      ],
    ],
    "type-fix-plugin": [2, "always"], // If "type = fix" the commit must end with `- commit: $COMMIT_SHA` or `- commit: N/A`.
  },
  plugins: [
    {
      rules: {
        // @ts-expect-error, types not yet updated
        "type-fix-plugin": ({ type, body }) => {
          const COMMIT_TYPE = "fix";
          const checkBody = (/** @type {string} */ body) =>
            /- commit: ([a-zA-Z0-9]{40}|N\/A)/.test(body);

          if (type?.includes(COMMIT_TYPE)) {
            const CHECKER = checkBody(body);
            return [
              CHECKER,
              `All fixes that result from another commit must contain in the body
the id of this commit in the format \`- commit: $COMMIT_SHA\`,
if the fix does not result from another commit, use \`- commit: N/A\` instead`,
            ];
          } else {
            return ["No type found for this commit"];
          }
        },
      },
    },
  ],
};

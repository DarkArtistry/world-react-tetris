module.exports = {
  extends: ["airbnb", "airbnb/hooks", "plugin:prettier/recommended"],
  plugins: ["react", "import"],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto", trailingComma: "es5" }],
    "import/prefer-default-export": "off",
    "no-plusplus": "off",
    "no-restricted-globals": "off",
    "lines-between-class-members": "off",
    "default-param-last": "off",
    "prefer-destructuring": "off",
    "react/forbid-prop-types": "off",
    "no-useless-return": "off",
    "react/destructuring-assignment": "off",
    "react/no-danger": "off",
    "react/default-props-match-prop-types": "off",
    "react/no-access-state-in-setstate": "off",
    "react/no-array-index-key": "off",
    "react/require-default-props": "off",
    "react/no-unused-class-component-methods": "off",
    "react/jsx-filename-extension": [2, { extensions: [".js", ".jsx"] }],
    "func-names": "off",
    "new-cap": [
      2,
      { newIsCap: true, capIsNew: true, capIsNewExceptions: ["List", "Map"] },
    ],
    "linebreak-style": "off",
    quotes: "off",
    "import/no-cycle": "off",
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", "src"],
      },
    },
  },
};

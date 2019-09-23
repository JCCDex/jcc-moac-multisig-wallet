module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    "eslint:recommended",
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/recommended",
    "plugin:prettier/recommended"
  ],
  // 校验 .vue 文件
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  // 自定义规则
  rules: {
    "semi": 0,
    "no-console": "off",
    "require-atomic-updates": "off",
    "vue/max-attributes-per-line": "off",
    "prettier/prettier": ["error", {
      "trailingComma": "none",
      "semi": true,
      "tabWidth": 2,
      "singleQuote": false,
      "bracketSpacing": true,
      "jsxBracketSameLine": true,
      "printWidth": 240
    }]
  }
}
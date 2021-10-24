module.exports = {
   env: {
      browser: true,
      es2021: true,
   },
   extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:eslint-comments/recommended',
      'plugin:prettier/recommended',
   ],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
   },
   plugins: ['@typescript-eslint'],
   rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
   },
}

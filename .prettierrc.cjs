module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.tsx', '*.ts', '**/*.tsx', '**/*.ts'],
      options: {
        parser: 'typescript',
        singleQuote: true,
        semi: true,
        tabWidth: 2,
        jsxSingleQuote: false
      }
    },
    {
      files: ['*.html', '**/*.html'],
      options: {
        parser: 'html',
        tabWidth: 2,
        singleQuote: false,
        htmlWhitespaceSensitivity: 'css'
      }
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        parser: 'markdown'
      }
    }
  ]
};


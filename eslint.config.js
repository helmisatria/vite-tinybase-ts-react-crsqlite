import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  toml: {
    overrides: {
      'toml/indent': [
        'error',
        2,
        { subTables: 1, keyValuePairs: 1 },
      ],
    },
  },
})

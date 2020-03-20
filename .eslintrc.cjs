const testFile = {
  rules: {
    'import/no-extraneous-dependencies': 0,
  },
  globals: {
    before: false,
    after: false,
    beforeEach: false,
    afterEach: false,
    describe: false,
    it: false,
    expect: false,
  },
};

const endpointFile = {
  rules: {
    'class-methods-use-this': 0,
  },
};

module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'filenames'],
  rules: {
    'no-param-reassign': [2, { props: true, ignorePropertyModificationsFor: ['sofar', 'tgt', 'ctx'] }],
    'no-useless-call': 2,
    'prefer-destructuring': 0,
    'space-infix-ops': 2,

    'filenames/match-regex': [2, '^(\\d+\\.)?[a-z\\.][a-z0-9\\-\\.]+$'],
    'filenames/no-index': 2,

    'import/no-default-export': 2,
    'import/no-extraneous-dependencies': 2,
    'import/prefer-default-export': 0,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  overrides: [
    { files: ['test/**/*'], ...testFile },
    { files: ['mezcal/test-server/endpoints/**/*', 'mezcal/test-server/error-handlers/**/*'], ...endpointFile },
  ],
};

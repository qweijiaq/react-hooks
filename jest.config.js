module.exports = {
  // 使用 ts-jest/presets/js-with-ts 预设，支持 TypeScript 和 JavaScript 测试文件
  preset: 'ts-jest/presets/js-with-ts',

  // 使用 jsdom 作为测试环境
  testEnvironment: 'jsdom',

  // 清除每次测试之间的模拟
  clearMocks: true,

  // 忽略测试路径中的 .history 文件夹
  testPathIgnorePatterns: ['/.history/'],

  // 忽略模块路径中的 package.json 文件
  modulePathIgnorePatterns: ['<rootDir>/package.json'],

  // 不重置模拟
  resetMocks: false,

  // 在运行测试之前执行的设置文件
  setupFiles: ['./jest.setup.js', 'jest-localstorage-mock'],

  // 在每个测试文件运行之后执行的设置文件
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

  // 使用 ts-jest 转换 TypeScript 文件
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },

  // 模块名称映射，将 lodash-es 映射为 lodash
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },

  // 收集测试覆盖率的文件匹配模式
  collectCoverageFrom: [
    '<rootDir>/**/src/**/*.{js,jsx,ts,tsx}',
    '!**/demo/**',
    '!**/example/**',
    '!**/es/**',
    '!**/lib/**',
    '!**/dist/**',
  ],

  // 转换时忽略的文件匹配模式
  transformIgnorePatterns: ['^.+\\.js$'],
};

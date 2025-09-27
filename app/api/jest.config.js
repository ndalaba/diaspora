module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   verbose:false,
   transform: {
      '^.+\\.ts?$': 'ts-jest',
   },
   transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

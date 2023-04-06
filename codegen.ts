// eslint-disable-next-line import/no-extraneous-dependencies
import { type CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: './src/index.ts',
  documents: ['src/**/*.ts'],
  generates: {
    './src/gql/': {
      preset: 'client-preset'
    }
  }
}
 
export default config
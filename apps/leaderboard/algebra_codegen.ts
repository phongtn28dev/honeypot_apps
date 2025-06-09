import type { CodegenConfig } from '@graphql-codegen/cli';
import { QueryClient } from '@tanstack/react-query';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'https://app.ghostlogs.xyz/playgrounds/96ff5ab9-9c87-47cb-ab46-73a276d93c8b',
  ],
  documents: 'lib/algebra/graphql/queries/!(*.d).{ts,tsx}',
  generates: {
    'lib/algebra/graphql/generated/graphql.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withResultType: true,
        addQuery: true,
        addInfiniteQuery: true,
        addPagination: true,
        addInlineFragment: true,
      },
    },
  },
};

export default config;

import gql from 'graphql-tag';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import server from '..';

const executer = buildHTTPExecutor({
    fetch: server.
})
const RegisterQuery = gql`
    mutation LogIn($LoginType: LoginType!) {
    login(input: $LoginType) {
    __typename
    ... on MutationLoginSuccess {
      data {
        email
        id
        token
      }
    }
    ... on Error {
      message
    }
  }
}
`;

it('works', async () => {
  server.execut;
});

import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

export async function execute<TResult, TVariables>(
  query: any,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  console.log(`execute query`, query);
  const response = await fetch(
    'https://relieved-panther-58.hasura.app/v1/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret':
          'W6OP2ZTd9CubvmoI0xjLzQlnd71f2JL7g5exoNJUfNU58gxeSRG6WX2x5K26yr5g',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json() as TResult;
}

const videosQuery = `
  query AllVideos {
    videos {
      id
      title
      description
      source
      slug
    }
  }
`;

const useLoadVideos = () => {
  console.log(`videosQuery`, videosQuery);
  const { data, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      return await request({
        url: 'https://relieved-panther-58.hasura.app/v1/graphql',
        // @ts-ignore
        document: videosQuery,
        requestHeaders: {
          'x-hasura-admin-secret': 'ADMIN SECRET',
        },
      });
    },
  });

  return {
    // @ts-ignore
    videos: data?.videos,
    isLoading,
  };
};

export { useLoadVideos };

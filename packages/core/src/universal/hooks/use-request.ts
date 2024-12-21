import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { useQueryContext } from '../../providers/query';

interface UseRequestProps {
  queryKey: unknown[];
  getAccessToken: () => Promise<string>;
  document: string;
  variables: any;
}

const useRequest = (props: UseRequestProps) => {
  const { queryKey, getAccessToken, document, variables } = props;

  const { hasuraUrl } = useQueryContext();
  const rs = useQuery({
    queryKey,
    queryFn: async () => {
      // TODO
      // Handle token error
      const token = await getAccessToken();
      return await request({
        url: hasuraUrl,
        document,
        requestHeaders: {
          Authorization: `Bearer ${token}`,
        },
        variables,
      });
    },
  });

  return rs;
};

export { useRequest };

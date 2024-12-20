import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { useQueryContext } from '../../providers/query';

const audiosQuery = `
  query GetAudios($where: audios_bool_exp = {}) @cached {
    audios(where: $where) {
      id
      name
      source
      thumbnail_url
      public
      created_at
      audio_tags_aggregate {
        aggregate {
          count
        }
      }
      audio_tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

interface LoadAudiosProps {
  getAccessToken: () => Promise<string>;
  tagName?: string;
}

const getAudiosWhere = (tagName?: string) => {
  if (!tagName) {
    return {};
  }

  return {
    audio_tags: {
      tag: {
        name: { _eq: tagName },
      },
    },
  };
};

const useLoadAudios = (props: LoadAudiosProps) => {
  const { getAccessToken, tagName } = props;

  const { hasuraUrl } = useQueryContext();
  const { data, isLoading } = useQuery({
    queryKey: ['audios', tagName],
    queryFn: async () => {
      // TODO
      // Handle token error
      const token = await getAccessToken();
      return await request({
        url: hasuraUrl,
        // @ts-ignore
        document: audiosQuery,
        requestHeaders: {
          Authorization: `Bearer ${token}`,
        },
        variables: {
          where: getAudiosWhere(tagName),
        },
      });
    },
  });

  return {
    // @ts-ignore
    audios: data?.audios,
    isLoading,
  };
};

export { useLoadAudios };

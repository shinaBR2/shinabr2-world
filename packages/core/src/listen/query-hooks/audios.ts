import { useRequest } from '../../universal/hooks/use-request';

const audiosQuery = `
  query GetAudios($where: audios_bool_exp = {}) @cached {
    audios(where: $where) {
      id
      name
      source
      thumbnail_url
      public
      created_at
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

  const { data, isLoading } = useRequest({
    queryKey: ['audios', tagName],
    getAccessToken,
    document: audiosQuery,
    variables: {
      where: getAudiosWhere(tagName),
    },
  });

  return {
    // @ts-ignore
    audios: data?.audios,
    isLoading,
  };
};

export { useLoadAudios };

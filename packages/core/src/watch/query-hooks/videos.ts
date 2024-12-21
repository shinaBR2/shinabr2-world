import { useRequest } from '../../universal/hooks/use-request';

const videosQuery = `
  query AllVideos @cached {
    videos {
      id
      title
      description
      source
      slug
      createdAt
      user {
        username
      }
    }
  }
`;

interface LoadVideosProps {
  getAccessToken: () => Promise<string>;
}

const useLoadVideos = (props: LoadVideosProps) => {
  const { getAccessToken } = props;

  const { data, isLoading } = useRequest({
    queryKey: ['videos'],
    getAccessToken,
    document: videosQuery,
    retry: 3,
    retryDelay: 1000,
    onError: error => {
      console.error('Failed to load videos:', error);
    },
  });

  return {
    // @ts-ignore
    videos: data?.videos,
    isLoading,
  };
};

export { useLoadVideos };

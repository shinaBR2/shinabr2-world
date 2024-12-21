import { useRequest } from '../../universal/hooks/use-request';

const audiosAndFeelingsQuery = `
  query GetAudiosAndFeelings($where: audios_bool_exp = {}) @cached {
    audios(where: $where) {
      id
      name
      source
      thumbnailUrl
      public
      artistName
      createdAt
    }
    tags(where: {site: {_eq: "listen"}}) {
      id
      name
    }
  }
`;

interface LoadAudiosProps {
  getAccessToken: () => Promise<string>;
  tagName?: string;
}

const useLoadAudios = (props: LoadAudiosProps) => {
  const { getAccessToken } = props;

  const rs = useRequest({
    queryKey: ['audios-and-feelings'],
    getAccessToken,
    document: audiosAndFeelingsQuery,
  });

  return rs;
};

export { useLoadAudios };

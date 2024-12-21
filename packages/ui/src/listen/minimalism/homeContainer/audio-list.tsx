import { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import hooks, { listenQueryHooks, SAudioPlayerAudioItem } from 'core';
import { useEffect, useMemo, useState } from 'react';
import MusicWidget from '../music-widget/MusicWidget';
import { PlayingList } from './playing-list';
import { MusicWidgetSkeleton } from '../music-widget/music-widget-skeleton';
import { PlayingListSkeleton } from './playing-list-skeleton';

const { useSAudioPlayer } = hooks;

const NoItem = () => {
  return <Typography variant="body2">No audios found</Typography>;
};

interface AudioListProps {
  queryRs: ReturnType<typeof listenQueryHooks.useLoadAudios>;
  list: unknown[];
  activeFeelingId: string;
}

const toAudioItem = (item: any) => {
  return {
    ...item,
    src: item.source,
    image: item.thumbnailUrl,
    tagIds: item.audio_tags.map((t: { tag_id: string }) => t.tag_id),
  };
};

const Content = (props: AudioListProps) => {
  const { list: originalList, activeFeelingId } = props;
  // TODO
  // memorize on parent
  const list = useMemo(() => {
    return originalList
      .map(i => toAudioItem(i))
      .filter(i => !activeFeelingId || i.tagIds.indexOf(activeFeelingId) > -1);
  }, [originalList, activeFeelingId]);

  const [index, setIndex] = useState(0);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  const hookResult = useSAudioPlayer({
    audioList: list,
    index,
  });
  const { getControlsProps, playerState } = hookResult;
  const { isPlay, currentIndex } = playerState;
  const { onPlay } = getControlsProps();

  const onItemSelect = (id: string) => {
    const index = list.findIndex(a => a.id === id);
    setIndex(index);

    if (!isPlay) {
      onPlay();
    }
  };

  useEffect(() => {
    if (activeFeelingId) {
      setIndex(0);
    }
  }, [activeFeelingId]);

  const hasNoItem = !list.length;
  const currentAudio = list[currentIndex || 0];
  const showPlayingList = !isMobile && !hasNoItem && !!currentAudio;

  if (hasNoItem) {
    return <NoItem />;
  }

  return (
    <Grid container spacing={2}>
      {showPlayingList && (
        <Grid item md={8} sm={6} xs={0}>
          <Card sx={{ height: '100%', maxHeight: '600px', overflowY: 'auto' }}>
            <PlayingList
              audioList={list}
              onItemSelect={onItemSelect}
              currentId={currentAudio.id}
            />
          </Card>
        </Grid>
      )}
      <Grid item md={4} sm={6} xs={12} container justifyContent="center">
        <MusicWidget
          audioList={list}
          hookResult={hookResult}
          onItemSelect={onItemSelect}
        />
      </Grid>
    </Grid>
  );
};

const AudioList = (props: AudioListProps) => {
  const { queryRs } = props;
  const { isLoading } = queryRs;
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {!isMobile && (
          <Grid item md={8} sm={6} xs={0}>
            <PlayingListSkeleton />
          </Grid>
        )}

        <Grid item md={4} sm={6} xs={12} container justifyContent="center">
          <MusicWidgetSkeleton />
        </Grid>
      </Grid>
    );
  }

  return <Content {...props} />;
};

export { AudioList };

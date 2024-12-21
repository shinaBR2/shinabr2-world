import { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import hooks, { SAudioPlayerAudioItem } from 'core';
import { useEffect, useState } from 'react';
import MusicWidget from '../music-widget/MusicWidget';

const { useSAudioPlayer } = hooks;

interface PlayingListItemProps {
  audioList: SAudioPlayerAudioItem[];
  currentId: string;
  onItemSelect: (id: string) => void;
}

const PlayingList = (props: PlayingListItemProps) => {
  const { audioList, currentId, onItemSelect } = props;
  const onClick = (id: string) => () => onItemSelect(id);

  return (
    <List>
      {audioList.map(a => {
        const { id, name, artistName } = a;

        return (
          <ListItem key={id}>
            <ListItemButton selected={id === currentId} onClick={onClick(id)}>
              <ListItemText primary={name} secondary={artistName} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

const NoItem = () => {
  return <Typography variant="body2">No audios found</Typography>;
};

interface AudiosContainerProps {
  list: SAudioPlayerAudioItem[];
  onItemSelect: (id: string) => void;
}

const toAudioItem = (item: any) => {
  return {
    ...item,
    image: item.thumbnailUrl,
  };
};

const AudiosContainer = (props: AudiosContainerProps) => {
  const { list: originalList } = props;

  const [index, setIndex] = useState(0);
  const [list, setList] = useState(originalList);
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

  useEffect(() => {
    setList(list.map(item => toAudioItem(item)));
  }, [originalList]);

  const onItemSelect = (id: string) => {
    const index = list.findIndex(a => a.id === id);
    setIndex(index);

    if (!isPlay) {
      onPlay();
    }
  };

  const hasNoItem = !list.length;
  const currentAudio = list[currentIndex || 0];
  const showPlayingList = !isMobile && !hasNoItem && !!currentAudio;

  return (
    <Box display="flex" my={4}>
      {hasNoItem ? (
        <NoItem />
      ) : (
        <Grid container spacing={2}>
          {showPlayingList && (
            <Grid item md={8} sm={6} xs={0}>
              <Card
                sx={{ height: '100%', maxHeight: '600px', overflowY: 'auto' }}
              >
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
      )}
    </Box>
  );
};

export { AudiosContainer };

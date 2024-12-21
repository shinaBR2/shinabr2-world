import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { SAudioPlayerAudioItem } from 'core';

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

export { PlayingList };

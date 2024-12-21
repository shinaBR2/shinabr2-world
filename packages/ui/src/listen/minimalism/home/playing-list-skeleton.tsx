import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

const PlayingListSkeleton = () => {
  return (
    <Card sx={{ height: '100%', maxHeight: '600px', overflowY: 'auto' }}>
      <List>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
          <ListItem key={item}>
            <ListItemText
              primary={<Skeleton variant="text" width="80%" />}
              secondary={<Skeleton variant="text" width="60%" />}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export { PlayingListSkeleton };

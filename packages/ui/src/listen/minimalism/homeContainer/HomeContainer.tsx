import {
  Box,
  Card,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { SAudioPlayerAudioItem } from "core";
import MusicWidget from "../music-widget";

interface HomeContainerProps {
  audioList: SAudioPlayerAudioItem[];
}

const PlayingListItem = (props: HomeContainerProps) => {
  const { audioList } = props;

  return (
    <List>
      {audioList.map((a) => {
        const { id, name, artistName } = a;

        return (
          <ListItem key={id}>
            <ListItemButton>
              <ListItemText primary={name} secondary={artistName} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

const HomeContainer = (props: HomeContainerProps) => {
  const { audioList } = props;
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Typography variant="h3" component="h1" fontWeight={700}>
          Just listen
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} my={2}>
        <Chip label="Default" color="primary" onClick={() => {}} />
        {/* <Chip label="Sad" />
        <Chip label="Heroic" /> */}
      </Stack>
      <Box display="flex" my={4}>
        <Grid container spacing={2}>
          {!hidden && (
            <Grid item md={8} sm={6} xs={0}>
              <Card
                sx={{ height: "100%", maxHeight: "600px", overflowY: "auto" }}
              >
                <PlayingListItem audioList={audioList} />
              </Card>
            </Grid>
          )}
          <Grid item md={4} sm={6} xs={12} container justifyContent="center">
            <MusicWidget audioList={audioList} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomeContainer;

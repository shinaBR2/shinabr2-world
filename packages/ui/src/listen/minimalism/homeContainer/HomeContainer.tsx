import { Box, Card, Chip, Container, Grid, Typography } from "@mui/material";
import { SAudioPlayerAudioItem } from "core";
import MusicWidget from "../music-widget";

interface HomeContainerProps {
  audioList: SAudioPlayerAudioItem[];
}

const HomeContainer = (props: HomeContainerProps) => {
  const { audioList } = props;

  return (
    <Container>
      <Box>
        <Typography variant="h1" component="h1">
          Listening is all you need
        </Typography>
      </Box>
      <Box>
        <Chip label="Default" />
        <Chip label="Sad" />
        <Chip label="Heroic" />
      </Box>
      <Grid container>
        <Grid item xs={12} sm={8}>
          <Card>
            {audioList.map((a) => {
              const { id, image, name, artistName } = a;

              return (
                <Box key={id}>
                  {/* <Box>image</Box> */}
                  <Typography component="strong">{name}</Typography>
                  <Typography variant="caption">{artistName}</Typography>
                </Box>
              );
            })}
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <MusicWidget audioList={audioList} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeContainer;

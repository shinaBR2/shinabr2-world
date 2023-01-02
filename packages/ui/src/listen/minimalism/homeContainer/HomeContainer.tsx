import {
  Box,
  Card,
  Chip,
  Container,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { SAudioPlayerAudioItem } from "core";
import MusicWidget from "../music-widget";

interface HomeContainerProps {
  audioList: SAudioPlayerAudioItem[];
}

const HomeContainer = (props: HomeContainerProps) => {
  const { audioList } = props;
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

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
      <Grid container spacing={2}>
        {!hidden && (
          <Grid item md={8} sm={6} xs={0}>
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
        )}
        <Grid item md={4} sm={6} xs={12} container justifyContent="center">
          <MusicWidget audioList={audioList} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomeContainer;

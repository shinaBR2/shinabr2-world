import {
  Box,
  Card,
  Chip,
  Container,
  Grid,
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

const HomeContainer = (props: HomeContainerProps) => {
  const { audioList } = props;
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h3" component="h1" fontWeight={700}>
          Just listen
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} my={2}>
        <Chip label="Default" />
        <Chip label="Sad" />
        <Chip label="Heroic" />
      </Stack>
      <Box display="flex" my={4}>
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
      </Box>
    </Container>
  );
};

export default HomeContainer;

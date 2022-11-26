import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Controls from "./Controls";
import Seeker from "./Seeker";
//@ts-ignore
import hooks from "core";
//@ts-ignore
import { SAudioPlayerAudioItem, SAudioPlayerLoopMode } from "core";
import {
  Box,
  Grid,
  ListItemText,
  MenuItem,
  MenuList,
  Slide,
} from "@mui/material";
import PlaylistButton from "./PlaylistButton";
import { useRef, useState } from "react";
import { PlayArrowRounded } from "@mui/icons-material";

const { useSAudioPlayer } = hooks;

// FUCK typescript
// interface SAudioPlayerAudioItem {
//   src: string;
//   name: string;
//   artistName: string;
//   image: string;
// }

// interface LoopMode = SAudioPlayerLoopMode;

interface MusicWidgetProps {
  id: string;
  audioList: SAudioPlayerAudioItem[];
  index?: number;
  shuffle?: boolean;
  loopMode?: SAudioPlayerLoopMode;
}

const MusicWidget = (props: MusicWidgetProps) => {
  const { audioList } = props;
  const [index, setIndex] = useState(0);
  const { getAudioProps, getSeekerProps, getControlsProps, playerState } =
    useSAudioPlayer({
      audioList,
      index,
    });
  const { isPlay, isShuffled, loopMode, audioItem } = playerState;
  const { onPlay, onPrev, onNext, onShuffle, onChangeLoopMode } =
    getControlsProps();
  const contentRef = useRef(null);
  const [showPlayinglist, setShowPlayinglist] = useState(false);

  if (!audioItem) {
    return null;
  }

  const { name, artistName, image } = audioItem;

  const onSelect = (id: string) => () => {
    const index = audioList.findIndex((a) => a.id === id);
    setIndex(index);

    if (!isPlay) {
      onPlay();
    }
  };

  console.log(audioList);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" alt={name} height="300" image={image} />
      <CardContent ref={contentRef}>
        <Box
          component={Grid}
          container
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography gutterBottom variant="body2" component="p">
            Now playing
          </Typography>
          <PlaylistButton
            onClick={() => setShowPlayinglist(!showPlayinglist)}
          />
        </Box>
        <Typography gutterBottom variant="h4" component="strong">
          {artistName}
        </Typography>
        <Typography gutterBottom variant="h5" component="p">
          {name}
        </Typography>
        <Seeker {...getSeekerProps()} />
      </CardContent>
      <CardActions style={{ display: "block" }}>
        <Controls
          isPlay={isPlay}
          handlePlay={onPlay}
          handlePrev={onPrev}
          handleNext={onNext}
          shuffle={isShuffled}
          onShuffle={onShuffle}
          loopMode={loopMode}
          onChangeLoopMode={onChangeLoopMode}
        />
      </CardActions>
      <Slide direction="up" in={showPlayinglist} container={contentRef.current}>
        <Box
          position="absolute"
          width="300px"
          height="280px"
          top="400px"
          sx={{ backgroundColor: "red" }}
        >
          <MenuList>
            {audioList.map((a) => {
              return (
                <MenuItem key={a.id} onClick={onSelect(a.id)}>
                  <ListItemText>{a.name}</ListItemText>
                  <Typography variant="body2" color="text.secondary">
                    <PlayArrowRounded />;
                  </Typography>
                </MenuItem>
              );
            })}
          </MenuList>
        </Box>
      </Slide>
      <audio {...getAudioProps()} />
    </Card>
  );
};

export default MusicWidget;

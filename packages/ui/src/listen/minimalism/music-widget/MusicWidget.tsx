import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Controls from "./Controls";
import Seeker from "./Seeker";
import { SHooks } from "core";

const { useSAudioPlayer } = SHooks;

interface AudioItem {
  src: string;
  name: string;
  artistName: string;
  image: string;
}

enum LoopMode {
  None = "none",
  All = "all",
  One = "one",
}

interface Props {
  audioList: AudioItem[];
  index?: number;
  shuffle?: boolean;
  loopMode?: LoopMode;
}

const MusicWidget = (props: Props) => {
  const {
    audioList,
    index = 0,
    shuffle = false,
    loopMode: loop = LoopMode.All,
  } = props;
  const { getAudioProps, getSeekerProps, getControlsProps, playerState } =
    useSAudioPlayer({
      audioList,
      index,
      configs: {
        shuffle,
        loopMode: loop,
      },
    });
  const { isPlay, isShuffled, loopMode, audioItem } = playerState;
  const { onPlay, onPrev, onNext, onShuffle, onChangeLoopMode } =
    getControlsProps();

  if (!audioItem) {
    return;
  }

  const { name, artistName, image } = audioItem;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component="img" alt={name} height="300" image={image} />
      <CardContent>
        <Typography gutterBottom variant="body2" component="p">
          Now playing
        </Typography>
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
      <audio {...getAudioProps()} />
    </Card>
  );
};

export default MusicWidget;

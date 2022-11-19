import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import Seeker from "./Seeker";
import { playAudio, seek } from "./utils/actions";
import { shuffleList } from "./utils/helpers";

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

  const ref = useRef<HTMLAudioElement>(null);

  const [indexes, setIndexes] = useState<number[]>();
  const [currentIndex, setCurrentIndex] = useState<number>(index);

  const [isShuffled, setIsShuffled] = useState(shuffle);
  const [loopMode, setLoopMode] = useState(loop);

  const [isPlay, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const total = audioList.length;
  const loopModes = ["all", "one", "none"];

  useEffect(() => {
    if (total) {
      const indexes = Array.from({ length: total }).map((_v, i) => i);
      console.log("indexes");
      console.log(indexes);

      setIndexes(indexes);
    }
  }, [total]);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  useEffect(() => {
    /* if (shuffle && indexes) {
      const newIndexes = [...indexes.sort(Math.random)];

      setIndexes(newIndexes);
    } */

    setIsShuffled(shuffle);
  }, [shuffle]);

  useEffect(() => {
    setLoopMode(loop);
  }, [loop]);

  /* useEffect(() => {
    if (isShuffled && indexes && indexes.length) {
      const newIndexes = [...indexes.sort(Math.random)];

      setIndexes(newIndexes);
    }
  }, [indexes, isShuffled]); */

  // let indexes = Array.from({ length: total }).map((_v, i) => i);
  // if (isShuffled) {
  //   console.log("Recalculate indexes");
  //   indexes = [...indexes.sort(() => (Math.random() > 0.5 ? 1 : -1))];
  //   console.log("new indexes");
  //   console.log(indexes);
  // }

  const firstIndex = 0;
  const lastIndex = indexes ? indexes?.length - 1 : 0;
  const isFirst = currentIndex === firstIndex;
  const isLast = currentIndex === lastIndex;

  const i = indexes ? indexes[currentIndex] : 0;
  const audioItem = audioList && indexes ? audioList[i] : null;

  if (!audioItem) {
    return null;
  }

  const { src, name, artistName, image } = audioItem;

  const onLoaded = () => {
    if (!ref.current) {
      return;
    }

    setDuration(Math.ceil(ref.current.duration));
    if (isPlay) {
      ref.current.play();
    }
  };

  const onTimeUpdate = () => {
    if (!ref.current) {
      return;
    }

    setCurrentTime(ref.current.currentTime);
  };

  const onSeek = (position: number) => {
    if (!ref.current) {
      return;
    }

    setCurrentTime(ref.current.currentTime);
    seek(ref.current, position);
  };

  const onEnded = () => {
    if (loopMode === LoopMode.One) {
      if (!ref.current) {
        return;
      }

      setPlay(true);
      playAudio(ref.current);

      return;
    } else if (loopMode === LoopMode.All) {
      if (isLast) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }

      if (!ref.current) {
        return;
      }

      setPlay(true);
      playAudio(ref.current);

      return;
    } else {
      if (isLast) {
        return setPlay(false);
      }

      if (!ref.current) {
        return;
      }

      setPlay(true);
      playAudio(ref.current);

      return;
    }
  };

  const handlePlay = () => {
    if (!ref.current) {
      return;
    }

    setPlay(!isPlay);

    playAudio(ref.current);
  };

  const handlePrev = () => {
    if (isFirst) {
      if (loopMode === LoopMode.All) {
        return setCurrentIndex(lastIndex);
      }

      return;
    }

    setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (isLast) {
      if (loopMode === LoopMode.All) {
        return setCurrentIndex(firstIndex);
      }

      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  const onShuffle = () => {
    if (!indexes) {
      return;
    }

    if (!isShuffled) {
      const sortFunc = () => (Math.random() > 0.5 ? 1 : -1);
      const newIndexes = [...indexes.sort(sortFunc)];
      const newCurrentIndex = newIndexes.findIndex((i) => i === currentIndex);

      setIndexes(newIndexes);
      setCurrentIndex(newCurrentIndex);
    }

    setIsShuffled(!isShuffled);
  };

  const onChangeLoopMode = () => {
    const index = loopModes.indexOf(loopMode);

    let newIndex;
    if (index === 2) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }

    setLoopMode(loopModes[newIndex] as LoopMode);
  };

  // https://mui.com/material-ui/react-slider/#music-player
  const formatDuration = (value: number) => {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };

  console.log("MusicWidget.rendered: current audio");
  // console.log(indexes);
  // console.log(currentIndex);
  // console.log(isShuffled);
  // console.log(loopMode);
  console.log(name);

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
        <Seeker
          max={duration}
          position={currentTime}
          setPosition={onSeek}
          formatDuration={formatDuration}
        />
      </CardContent>
      <CardActions style={{ display: "block" }}>
        <Controls
          isPlay={isPlay}
          handlePlay={handlePlay}
          handlePrev={handlePrev}
          handleNext={handleNext}
          shuffle={isShuffled}
          onShuffle={onShuffle}
          loopMode={loopMode}
          onChangeLoopMode={onChangeLoopMode}
        />
      </CardActions>
      <audio
        ref={ref}
        src={src}
        onLoadedData={onLoaded}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
    </Card>
  );
};

export default MusicWidget;

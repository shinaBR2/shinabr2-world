import React, { useEffect, useState } from "react";
import { ListenUI, SUI } from "ui";
import { ListenCore } from "core";
import db from "../../providers/firestore";

const { SBackdrop } = SUI;
const { MusicWidget } = ListenUI.Minimalism;
const { useGetHomeAudioList } = ListenCore;

enum LoopMode {
  None = "none",
  All = "all",
  One = "one",
}

interface AudioItem {
  src: string;
  name: string;
  artistName: string;
  image: string;
}

function shuffleList<T>(array: T[]): T[] {
  if (!array) {
    return [];
  }

  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const Home = () => {
  const { values: audioList, loading } = useGetHomeAudioList(db);
  const [currentAudio, setCurrentAudio] = useState(0);
  const [shuffle, setShuffle] = useState(true);
  const [loopMode, setLoopMode] = useState("all");

  const loopModes = ["all", "one", "none"];

  const onShuffle = () => {
    setShuffle(!shuffle);
  };

  const onChangeLoopMode = () => {
    const index = loopModes.indexOf(loopMode);

    let newIndex;
    if (index === 2) {
      newIndex = 0;
    } else {
      newIndex = index + 1;
    }

    setLoopMode(loopModes[newIndex]);
  };

  return (
    <main>
      <SBackdrop open={true} loading={loading}>
        {!!audioList && (
          <MusicWidget
            audioList={audioList}
            index={currentAudio}
            setIndex={setCurrentAudio}
            loopMode={loopMode as LoopMode}
            onChangeLoopMode={onChangeLoopMode}
          />
        )}
      </SBackdrop>
    </main>
  );
};

export default Home;

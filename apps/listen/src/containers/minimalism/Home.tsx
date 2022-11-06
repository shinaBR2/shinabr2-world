import React from "react";
import { ListenUI, SUI } from "ui";

const { SBackdrop } = SUI;
const { MusicWidget } = ListenUI.Minimalism;

const Home = () => {
  const songList = [
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      name: "Song 1",
      artistName: "T. Schürger",
      image: "https://picsum.photos/300",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      name: "Song 1",
      artistName: "T. Schürger",
      image: "https://picsum.photos/300",
    },
  ];

  return (
    <main>
      <SBackdrop open={true}>
        <MusicWidget audioList={songList} index={0} />
      </SBackdrop>
    </main>
  );
};

export default Home;

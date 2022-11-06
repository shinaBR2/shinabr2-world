import React from "react";
import { MinimalismMusicWidget } from "ui";

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
      <MinimalismMusicWidget audioList={songList} index={0} />
    </main>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { ListenUI, SUI } from "ui";
import { ListenCore } from "core";
import db from "../../providers/firestore";

const { SBackdrop } = SUI;
const { AppBar, MusicWidget } = ListenUI.Minimalism;
const { useGetHomeAudioList } = ListenCore;

const Home = () => {
  const { values: audioList, loading } = useGetHomeAudioList(db);

  return (
    <main>
      <AppBar />
      <SBackdrop open={true} loading={loading}>
        {!!audioList && <MusicWidget audioList={audioList} />}
      </SBackdrop>
    </main>
  );
};

export default Home;

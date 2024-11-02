import { useParams } from "@tanstack/react-router";
import React, { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { useLoadGameConfig } from "./hooks/useLoadGameConfig";

const GameContainer = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const { config, gameSlug } = useLoadGameConfig();

  const currentScene = (scene: Phaser.Scene) => {
    console.log("current scene", scene.scene.key);
  };

  console.log("gameSlug", gameSlug);
  console.log("config", config);

  return (
    <>
      <div>GameContainer</div>
      <PhaserGame
        config={config}
        ref={phaserRef}
        currentActiveScene={currentScene}
      />
    </>
  );
};

export default GameContainer;

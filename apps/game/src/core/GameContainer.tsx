import React, { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { useLoadGameConfig } from "./hooks/useLoadGameConfig";

const GameContainer = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const { config, gameSlug } = useLoadGameConfig();

  const currentScene = (scene: Phaser.Scene) => {
    console.log("current scene", scene.scene.key);
  };

  return (
    <div id="game-container">
      <PhaserGame
        config={config}
        ref={phaserRef}
        currentActiveScene={currentScene}
      />
    </div>
  );
};

export default GameContainer;

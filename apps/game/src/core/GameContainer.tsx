import React, { useEffect, useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { useLoadGameConfig } from "./hooks/useLoadGameConfig";
import { EventBus } from "../events/EventBus";
import { RESULT_SAVED } from "../games/bobble-dungeon/events/Events";

const GameContainer = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const { config, gameSlug } = useLoadGameConfig();

  const currentScene = (scene: Phaser.Scene) => {
    console.log("current scene", scene.scene.key);
  };

  useEffect(() => {
    EventBus.on(RESULT_SAVED, (data) => {
      console.log("data on finish", data);

      // @ts-ignore
      const currentData = localStorage.getItem(RESULT_SAVED);
      console.log("current data", currentData);

      if (!currentData) {
        localStorage.setItem(RESULT_SAVED, JSON.stringify(data));
        return;
      }

      const currentResult = JSON.parse(currentData);
      const currentScore = currentResult.seconds;

      console.log("current data", currentResult);

      if (currentScore < data.seconds) {
        localStorage.setItem(RESULT_SAVED, JSON.stringify(data));
      }
    });
  }, []);

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

import React, { useEffect } from "react";
import GameContainer from "../../core/GameContainer";
import { EventBus } from "../../core/EventBus";
import config from "./config";

const Game = () => {
  return <GameContainer config={config} />;
};

export default Game;

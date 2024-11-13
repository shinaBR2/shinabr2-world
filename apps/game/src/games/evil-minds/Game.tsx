import React, { useEffect, useState } from 'react';
import { GameUI } from 'ui';
import GameContainer from '../../core/GameContainer';
import { EventBus } from '../../core/EventBus';
import config from './config';
import {
  PLAYER_DONE_READ_HOUSE_SIGN,
  PLAYER_READ_HOUSE_SIGN,
} from './events/playerEvents';

const { Dialogs, Containers } = GameUI.Minimalism;
const { GameDialogue } = Dialogs;

const dialogue: GameUI.Dialog.DialogueContent = {
  speaker: 'Merchant',
  text: 'Would you like to see my wares?',
  choices: [
    {
      text: 'Yes, show me',
      callback: () => {
        console.log('SHow med');
      },
    },
    {
      text: 'No thanks',
      nextDialogue: {
        speaker: 'Merchant',
        text: 'Come back anytime!',
      },
    },
  ],
};
const Game = () => {
  const [showDialogue, setShowDialogue] = useState(false);
  const onCloseDialogue = () => {
    console.log('onclose dialog called');
    EventBus.emit(PLAYER_DONE_READ_HOUSE_SIGN);
    setShowDialogue(false);
  };

  useEffect(() => {
    EventBus.on(PLAYER_READ_HOUSE_SIGN, (scene: Phaser.Scene) => {
      setShowDialogue(true);
    });

    return () => {
      EventBus.removeListener(PLAYER_READ_HOUSE_SIGN);
    };
  }, []);

  return (
    <>
      <GameContainer config={config} />
      <GameDialogue
        isOpen={showDialogue}
        onClose={onCloseDialogue}
        dialogue={dialogue}
      />
    </>
  );
};

export default Game;

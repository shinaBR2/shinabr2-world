import React, { useEffect, useRef, useState } from "react";
import { UniversalUI } from "ui";
import { GameUI } from "ui";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";

const { UniversalMinimalismThemeProvider } = UniversalUI.Minimalism;
const { Dialogs } = GameUI.Minimalism;
const { SignInDialog } = Dialogs;

const App = () => {
  const [showSignInDialog, setShowSignInDialog] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    EventBus.emit("signed_in", isSignedIn);
  }, [isSignedIn]);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {
    console.log("current scene", scene.scene.key);
  };

  const handleSignedIn = () => {
    console.log("sigedni ain");
    setIsSignedIn(true);
    setShowSignInDialog(false);
  };

  return (
    <UniversalMinimalismThemeProvider>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <SignInDialog open={showSignInDialog} onSubmit={handleSignedIn} />
      </div>
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </UniversalMinimalismThemeProvider>
  );
};

export default App;

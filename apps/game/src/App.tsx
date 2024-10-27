import React, { useEffect, useRef, useState } from "react";
import { Auth } from "core";
import { UniversalUI } from "ui";
import { GameUI } from "ui";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";

const { LoadingBackdrop } = UniversalUI;
const { UniversalMinimalismThemeProvider } = UniversalUI.Minimalism;

const { Dialogs } = GameUI.Minimalism;
const { SignInDialog, ChooseAvatar } = Dialogs;

const App = () => {
  const { user, isLoading, isSignedIn, signIn } = Auth.useAuthContext();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showChooseAvatarInDialog, setShowChooseAvatarInDialog] =
    useState(true);

  useEffect(() => {
    if (isSignedIn) {
      EventBus.emit("signed_in", isSignedIn);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      setShowSignInDialog(true);
    }
  }, [isLoading]);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {
    console.log("current scene", scene.scene.key);
  };

  console.log("user", user);
  console.log("isLoading", isLoading);
  console.log("isSignedIn", isSignedIn);

  const handleSignedIn = () => {
    signIn();
    setShowSignInDialog(false);
  };

  const handleSelectAvatar = (value: string) => {
    EventBus.emit("avatar_selected", value);
    setShowChooseAvatarInDialog(false);
  };

  if (isLoading) {
    return <LoadingBackdrop message="Valuable things deserve waiting" />;
  }

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
        <ChooseAvatar
          open={showChooseAvatarInDialog}
          onSubmit={handleSelectAvatar}
        />
      </div>
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
    </UniversalMinimalismThemeProvider>
  );
};

export default App;

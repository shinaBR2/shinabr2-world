import * as React from "react";
// @ts-ignore
import { createLazyFileRoute } from "@tanstack/react-router";
import { GameUI } from "ui";

const { Dialogs, Containers } = GameUI.Minimalism;
const { HomeContainer } = Containers;

const Home = () => {
  const gameList = [
    {
      id: "1",
      url: "/bobble-dungeon",
      name: "Bobble dungeon",
      slug: "bobble-dungeon",
      description: "Ride the Dungeons with just a bubble shooter.",
      imageUrl: "/assets/bobble-dungeon/bobble_dungeon_intro.png",
    },
    {
      id: "2",
      url: "/evil-minds",
      name: "Evil Minds",
      slug: "evil-minds",
      description: "Who is the next victim?",
      imageUrl: "/assets/evil-minds/intro.png",
    },
  ];

  return <HomeContainer gameList={gameList} />;
};

export const Route = createLazyFileRoute("/")({
  component: Home,
});

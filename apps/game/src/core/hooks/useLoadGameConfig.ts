import { useLoaderData, useParams } from "@tanstack/react-router";
import BobbleDungeonConfig from "../../games/bobble-dungeon/config";

export const useLoadGameConfig = () => {
  const config = useLoaderData({ from: "/$gameSlug" });
  const params = useParams({ strict: false });

  return {
    config: config,
    gameSlug: params.gameSlug,
  };
};

export const fetchGameConfig = async (gameSlug: string) => {
  if (gameSlug == "bobble-dungeon") {
    return BobbleDungeonConfig;
  }

  return {};
};

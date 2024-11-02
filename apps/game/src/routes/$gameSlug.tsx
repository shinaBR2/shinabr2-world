import { createFileRoute } from "@tanstack/react-router";
import BobbleDungeonConfig from "../games/bobble-dungeon/";

const fetchGame = async (gameSlug: string) => {
  if (gameSlug == "bobble-dungeon") {
    return BobbleDungeonConfig;
  }

  return {};
};

export const Route = createFileRoute("/$gameSlug")({
  loader: async ({ params }) => {
    return await fetchGame(params.gameSlug);
  },
});

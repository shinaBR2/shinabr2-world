import { createLazyFileRoute } from "@tanstack/react-router";
import GameContainer from "../core/GameContainer";

export const Route = createLazyFileRoute("/$gameSlug")({
  component: GameContainer,
});

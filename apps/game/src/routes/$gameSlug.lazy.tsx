import { createLazyFileRoute } from "@tanstack/react-router";
import { GamesComponent } from "./$gameSlug";

export const Route = createLazyFileRoute("/$gameSlug")({
  component: GamesComponent,
});

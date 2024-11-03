import { createFileRoute } from "@tanstack/react-router";
import { fetchGameConfig } from "../core/hooks/useLoadGameConfig";

export const Route = createFileRoute("/$gameSlug")({
  loader: async ({ params }) => {
    return await fetchGameConfig(params.gameSlug);
  },
});

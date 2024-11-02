import { useLoaderData, useParams } from "@tanstack/react-router";

export const useLoadGameConfig = () => {
  const config = useLoaderData({ from: "/$gameSlug" });
  const params = useParams({ strict: false });

  return {
    config: config,
    gameSlug: params.gameSlug,
  };
};

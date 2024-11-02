import { createFileRoute } from "@tanstack/react-router";
// import { createFileRoute } from '@tanstack/react-router'
import React from "react";

const fetchPost = async (gameSlug: string) => {
  return 1;
};

export const GamesComponent = () => {
  const { gameSlug } = Route.useParams();

  console.log("gameSlug", gameSlug);

  return <div>Games</div>;
};

export const Route = createFileRoute("/$gameSlug")({
  loader: async ({ params }) => {
    return await fetchPost(params.gameSlug);
  },
});

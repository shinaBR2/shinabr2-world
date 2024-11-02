import React from "react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { UniversalUI } from "ui";

const { UniversalMinimalismThemeProvider } = UniversalUI.Minimalism;

export const Route = createRootRoute({
  component: () => (
    <UniversalMinimalismThemeProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </UniversalMinimalismThemeProvider>
  ),
});

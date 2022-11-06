import * as React from "react";
import "./App.css";
import { CounterButton, NewTabLink } from "ui";
import { AuthProvider } from "./providers/auth";
import Home from "./containers/minimalism/Home";

const App = () => {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
};

export default App;

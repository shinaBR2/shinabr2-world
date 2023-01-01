import { Helmet } from "react-helmet-async";
import { Grid, Container, Typography } from "@mui/material";

const FeatureFlags = () => {
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>
      <Container maxWidth="xl">
        <h1>Feature flag configuration</h1>
      </Container>
    </>
  );
};

export default FeatureFlags;

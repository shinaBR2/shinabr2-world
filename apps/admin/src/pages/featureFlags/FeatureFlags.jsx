import { Helmet } from "react-helmet-async";
import { Grid, Container, Typography, Box, Tabs, Tab } from "@mui/material";
import React from "react";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const FeatureFlags = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>
      <Container maxWidth="xl">
        <h1>Feature flag configuration</h1>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab label="Listen" />
              <Tab label="Coming soon" disabled />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            Listen feature flags
          </TabPanel>
        </Box>
      </Container>
    </>
  );
};

export default FeatureFlags;

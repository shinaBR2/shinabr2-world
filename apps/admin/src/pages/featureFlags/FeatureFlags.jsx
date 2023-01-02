import { Helmet } from "react-helmet-async";
import { Grid, Container, Typography, Box, Tabs, Tab } from "@mui/material";
import React from "react";
import ListenFeatureFlags from "./Listen";
import { Entity } from "core";
import db from "../../providers/firestore";
import FullPageLoader from "../../components/@full-page-loader";

const { useListenFeatureFlag, useSaveFeatureFlag } = Entity.EntityFeatureFlag;

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

  const pathConfig = {
    path: "configs",
    pathSegments: ["listen", "features"],
  };
  const { values: listenData, loading: listenLoading } = useListenFeatureFlag(
    db,
    pathConfig
  );
  const saveFunc = useSaveFeatureFlag(db, pathConfig);

  const onSaveSingleItem = (id, data) => {
    console.log("id => data");
    console.log(id);
    console.log(data);
    saveFunc(id, data);
  };

  if (listenLoading) {
    return <FullPageLoader open={listenLoading} />;
  }

  return (
    <>
      <Helmet>
        <title> Feature Flag Configuration </title>
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
            <ListenFeatureFlags
              data={listenData}
              onSaveSingleItem={onSaveSingleItem}
            />
          </TabPanel>
        </Box>
      </Container>
    </>
  );
};

export default FeatureFlags;

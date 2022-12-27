import { Helmet } from "react-helmet-async";
import { Button, Container, Stack, Typography } from "@mui/material";
import db from "../../providers/firestore";
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import SelectionList from "../../components/@selectionList";
import { Entity, ListenCore } from "core";

const { EntityFeeling } = Entity;
const { useListenHomeFeelingList } = ListenCore;
const { useListenEntityList } = EntityFeeling;

const ListenHomeConfigFeelingList = () => {
  const { values: feelingList } = useListenEntityList(db);
  const { values: homeFeelingList } = useListenHomeFeelingList(db);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const [selectedIds, setSelectedIds] = useState();

  const renderLabel = (item) => {
    const { value } = item;

    return value;
  };

  const onSave = () => {
    // TODO
    console.log("selectedIds");
    console.log(selectedIds);
    console.log("end selectedIds");
  };

  useEffect(() => {
    const ids = homeFeelingList ? homeFeelingList.map((f) => f.id) : [];
    setSelectedIds(ids);
  }, [homeFeelingList]);

  console.log("selectedIds");
  console.log(selectedIds);
  console.log("end selectedIds");
  console.log("homeFeelingList");
  console.log(homeFeelingList);
  console.log("end homeFeelingList");

  return (
    <>
      <Helmet>
        <title> Listen: Home page feeling list </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Homepage feeling list
          </Typography>
        </Stack>

        <SelectionList
          list={feelingList}
          selectedIds={selectedIds}
          onChange={setSelectedIds}
          renderLabel={renderLabel}
        />
        <Button
          variant="contained"
          // startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={onSave}
        >
          Save
        </Button>

        {showSuccess && (
          <Snackbar
            open={showSuccess}
            autoHideDuration={6000}
            onClose={handleCloseSuccess}
          >
            <Alert
              onClose={handleCloseSuccess}
              severity="success"
              sx={{ width: "100%" }}
            >
              Success!
            </Alert>
          </Snackbar>
        )}
        {showError && (
          <Snackbar
            open={showError}
            autoHideDuration={6000}
            onClose={handleCloseError}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              sx={{ width: "100%" }}
            >
              Success!
            </Alert>
          </Snackbar>
        )}
      </Container>
    </>
  );
};

export default ListenHomeConfigFeelingList;

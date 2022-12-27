import { Helmet } from "react-helmet-async";
import { Button, Container, Stack, Typography } from "@mui/material";
import db from "../../providers/firestore";
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import SelectionList from "../../components/@selectionList";
import { Entity, ListenCore, requestHelpers } from "core";
import pw from "a-promise-wrapper";

const { EntityFeeling } = Entity;
const { useListenHomeFeelingList } = ListenCore;
const { useListenEntityList } = EntityFeeling;

const { callable } = requestHelpers;

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

  const onSave = async () => {
    const inputs = {
      feelings: selectedIds.map((id) => {
        return {
          id,
          value: feelingList.find((f) => f.id === id),
        };
      }),
    };

    console.log("inputs");
    console.log(inputs);
    console.log("end inputs");

    const { data, erorr } = await pw(
      callable("admin-listen-homepage-saveFeelings", inputs)
    );

    if (error) {
      console.error(erorr);
    }

    console.log(`success: ${JSON.stringify(data)}`);
  };

  useEffect(() => {
    const ids = homeFeelingList ? homeFeelingList.map((f) => f.id) : [];
    setSelectedIds(ids);
  }, [homeFeelingList]);

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

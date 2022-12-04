// @mui
import { Grid } from "@mui/material";
// components
// mock
import { ListenCore } from "core";
import db from "../../providers/firestore";
import AudioCard from "./components/AudioCard";
import React from "react";
import { useAuthContext } from "../../providers/auth";
import CRUDPage from "../../components/@crud-page";
import AudioCRUDForm from "./components/AudioCRUDFormDialog/AudioCRUDForm";

const {
  useListenHomeAudioList,
  useUploadHomeAudio,
  useUpdateHomeAudioItem,
  useDeleteHomeAudioItem,
} = ListenCore;
// ----------------------------------------------------------------------

const ListComponent = (props) => {
  const { data: audioList, onClickEdit } = props;

  return (
    <Grid container spacing={3}>
      {audioList &&
        audioList.map((audio, index) => (
          <AudioCard
            onEdit={onClickEdit}
            key={audio.id}
            audio={audio}
            index={index}
          />
        ))}
    </Grid>
  );
};

export default function ListenHomeConfig() {
  const { user } = useAuthContext();
  const createFunc = useUploadHomeAudio(db);
  const updateFunc = useUpdateHomeAudioItem(db);
  const deleteFunc = useDeleteHomeAudioItem(db);
  const { uid } = user;

  const buildCRUDData = (isCreate, data) => {
    const { id, src, name, artistName, image } = data;
    const createData = {
      src,
      name,
      artistName,
      image,
      uploaderId: uid,
    };
    const updateData = {
      id,
      src,
      name,
      artistName,
      image,
      editorId: uid,
    };

    return isCreate ? createData : updateData;
  };

  return (
    <CRUDPage
      htmlTitle="Listen: Home page audio list"
      entityName="Audio"
      useLoadData={useListenHomeAudioList}
      createFunc={createFunc}
      updateFunc={updateFunc}
      deleteFunc={deleteFunc}
      buildCRUDData={buildCRUDData}
      ListComponent={ListComponent}
      FormComponent={AudioCRUDForm}
    />
  );
}

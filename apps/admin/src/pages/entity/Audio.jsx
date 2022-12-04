import CRUDPage from "../../components/@crud-page";
import MockFormComponent from "../../components/_mockForDev/MockFormComponent";
import MockListComponent from "../../components/_mockForDev/MockListComponent";
import { useAuthContext } from "../../providers/auth";
// import MockFormComponent from "./MockFormComponent";
// import MockListComponent from "./MockListComponent";

import { Entity } from "core";
const { EntityFeeling } = Entity;

const { useListenEntityList, useAddEntity, useUpdateEntity, useDeleteEntity } =
  EntityFeeling;

const EntityAudioPage = () => {
  const { user } = useAuthContext();

  const htmlTitle = "Entity: Audio";
  const entityName = "Audio";
  const createFunc = useAddEntity();
  const updateFunc = useUpdateEntity();
  const deleteFunc = useDeleteEntity();
  const buildCRUDData = (isCreate, data) => {
    /**
     * TODO
     *
     * Update this logic
     */
    console.log(isCreate);
    const { uid } = user;
    console.log(`Who did action: ${uid}`);
    return { ...data };
  };

  return (
    <CRUDPage
      htmlTitle={htmlTitle}
      entityName={entityName}
      useLoadData={useListenEntityList}
      createFunc={createFunc}
      updateFunc={updateFunc}
      deleteFunc={deleteFunc}
      buildCRUDData={buildCRUDData}
      ListComponent={MockListComponent}
      FormComponent={MockFormComponent}
    />
  );
};

export default EntityAudioPage;

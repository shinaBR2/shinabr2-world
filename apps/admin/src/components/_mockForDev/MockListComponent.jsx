import { Grid } from "@mui/material";

const MockListComponent = (props) => {
  const { data: itemList, onClickEdit } = props;

  return (
    <Grid container spacing={3}>
      {itemList &&
        itemList.map((_item, index) => <p>{`Item index: ${index}`}</p>)}
    </Grid>
  );
};

export default MockListComponent;

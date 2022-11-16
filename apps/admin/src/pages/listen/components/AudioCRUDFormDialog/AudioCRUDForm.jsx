import { Box, Button, Grid, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const getDefaultValues = (data) => {
  if (!data) {
    return {
      src: "",
      name: "",
      artistName: "",
      image: "",
      // order: 0,
    };
  }

  return data;
};

const AudioCRUDForm = (props) => {
  const { data, onConfirm } = props;
  const useFormInputs = {
    defaultValues: getDefaultValues(data),
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(useFormInputs);
  const onSubmit = (data) => {
    console.log(data);
    onConfirm(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="src"
        control={control}
        render={({ field }) => (
          <TextField
            autoFocus
            margin="dense"
            id="src"
            label="Source"
            type="text"
            fullWidth
            variant="outlined"
            error={errors.src}
            helperText={errors.src && "Src is required"}
            {...field}
          />
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            error={errors.name}
            helperText={errors.name && "Name is required"}
            {...field}
          />
        )}
      />
      <Controller
        name="artistName"
        control={control}
        render={({ field }) => (
          <TextField
            autoFocus
            margin="dense"
            id="artistName"
            label="Artist name"
            type="text"
            fullWidth
            variant="outlined"
            error={errors.artistName}
            helperText={errors.artistName && "Artist name is required"}
            {...field}
          />
        )}
      />
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <TextField
            autoFocus
            margin="dense"
            id="image"
            label="Thumbnail"
            type="text"
            fullWidth
            variant="outlined"
            error={errors.image}
            helperText={errors.image && "Artist name is required"}
            {...field}
          />
        )}
      />

      <Box mt={2}>
        <Grid container justifyContent="flex-end">
          <Button color="primary" type="submit">
            Save
          </Button>
        </Grid>
      </Box>
    </form>
  );
};

export default AudioCRUDForm;

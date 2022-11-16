import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AudioCRUDForm from "./AudioCRUDForm";

const AudioCRUDFormDialog = (props) => {
  const { open, onClose, onConfirm, isCreate, data } = props;
  const title = isCreate ? "Upload audio" : "Edit audio";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <AudioCRUDForm data={isCreate ? null : data} onConfirm={onConfirm} />
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="primary" onClick={handleClose}>
          Save
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default AudioCRUDFormDialog;

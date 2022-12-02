import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AudioCRUDForm from "./AudioCRUDForm";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, DialogActions, DialogContentText } from "@mui/material";

const AudioCRUDFormDialog = (props) => {
  const { open, onClose, onConfirm, onDelete, isCreate, data } = props;
  const title = isCreate ? "Upload audio" : "Edit audio";
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {title}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        {showDeleteConfirm && (
          <DialogContentText>Are you sure to delete?</DialogContentText>
        )}
        {!showDeleteConfirm && (
          <AudioCRUDForm
            data={isCreate ? null : data}
            onConfirm={onConfirm(isCreate)}
            onDelete={handleDelete}
          />
        )}
      </DialogContent>
      {showDeleteConfirm && (
        <DialogActions>
          <Button onClick={cancelDelete} autoFocus>
            Cancel
          </Button>
          <Button onClick={onDelete} color="error" variant="outlined">
            Yes I understand the risk!
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AudioCRUDFormDialog;

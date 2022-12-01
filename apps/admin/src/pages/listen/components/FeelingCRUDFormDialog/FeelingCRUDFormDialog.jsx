import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FeelingCRUDForm from "./FeelingCRUDForm";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const FeelingCRUDFormDialog = (props) => {
  const { open, onClose, onConfirm, onDelete, isCreate, data } = props;
  const title = isCreate ? "Upload audio" : "Edit audio";

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
        <FeelingCRUDForm
          data={isCreate ? null : data}
          onConfirm={onConfirm(isCreate)}
          onDelete={onDelete}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FeelingCRUDFormDialog;

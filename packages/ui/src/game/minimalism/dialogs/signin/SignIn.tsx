import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
// import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { DialogContent } from "@mui/material";

export interface SignInProps {
  open: boolean;
  onSubmit: () => void;
}

const SignIn = (props: SignInProps) => {
  const { onSubmit, open } = props;

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <DialogContent>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          type="button"
          onClick={handleSubmit}
        >
          Join
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignIn;

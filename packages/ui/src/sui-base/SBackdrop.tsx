import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export interface SBackdropProps {
  open: boolean;
  onClick?: () => void;
  loading: boolean;
  children: React.ReactNode;
}

// https://mui.com/material-ui/react-backdrop/
const SBackdrop = (props: SBackdropProps) => {
  const { open, onClick, loading, children } = props;

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClick}
    >
      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
          <Typography>Valuable things deserve waiting</Typography>
        </Box>
      ) : (
        children
      )}
    </Backdrop>
  );
};

export default SBackdrop;

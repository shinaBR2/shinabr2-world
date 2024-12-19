import { useState } from 'react';
import { Button, Dialog, DialogContent, Box, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

interface LoginDialogProps {
  onAction: () => void;
}

export const LoginDialog = (props: LoginDialogProps) => {
  const { onAction } = props;

  return (
    <Dialog open={true} onClose={() => {}} disableEscapeKeyDown={true}>
      <DialogContent sx={{ width: 400, py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h5">Welcome Back</Typography>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ width: '100%', py: 1 }}
            onClick={onAction}
          >
            Continue with Google
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

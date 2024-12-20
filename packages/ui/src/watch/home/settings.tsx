import { Logout } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface SettingsPanelProps {
  open: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsPanel = (props: SettingsPanelProps) => {
  const { open, toggle } = props;

  return (
    <Drawer anchor="right" open={open} onClose={() => toggle(false)}>
      <Box
        sx={{
          width: 250,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List sx={{ flex: 1 }}>
          {/* <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem> */}
        </List>
        <Divider />
        <List>
          <ListItemButton>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export { SettingsPanel };

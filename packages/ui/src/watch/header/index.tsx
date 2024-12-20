import { AccountCircle } from '@mui/icons-material';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import Logo from '../../universal/logo';
import SearchBar from '../../universal/search-bar';
import SiteChoices from '../../universal/site-choices';

const Header = (props: { toggleSetting: any }) => {
  const { toggleSetting } = props;

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 'fit-content',
          }}
        >
          {/* <IconButton>
            <Menu open={false} />
          </IconButton> */}
          <Logo />
          <SiteChoices />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SearchBar />
        </Box>

        <Box sx={{ display: 'flex', minWidth: 'fit-content' }}>
          <IconButton onClick={() => toggleSetting(true)}>
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export { Header };

import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import React from 'react';
import { StyledHeader } from './Styled';
import { Logo } from '../../../universal';

// Source: https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
const Header = () => {
  return (
    <StyledHeader position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo />
        </Toolbar>
      </Container>
    </StyledHeader>
  );
};
export { Header };

import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import React from 'react';
import { StyledHeader } from './Styled';

interface Props {
  children: React.ReactNode;
}

// Source: https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
const Header = (props: Props) => {
  const { children } = props;

  return (
    <StyledHeader position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>{children}</Toolbar>
      </Container>
    </StyledHeader>
  );
};
export { Header };

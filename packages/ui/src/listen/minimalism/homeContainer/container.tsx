import Container from '@mui/material/Container';
import { ReactNode } from 'react';

interface HomeContainerProps {
  children: ReactNode;
}

const HomeContainer = (props: HomeContainerProps) => {
  return <Container maxWidth="xl">{props.children}</Container>;
};

export { HomeContainer };

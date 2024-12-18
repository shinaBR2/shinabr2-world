import { AccountCircle, Logout } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  AppBar,
  IconButton,
  Toolbar,
  Divider,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { useState } from 'react';
import Logo from '../universal/logo';
import SearchBar from '../universal/search-bar';
import SiteChoices from '../universal/site-choices';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  uploadDate: string;
  duration: string;
  channelName: string;
}

const mockVideos: Video[] = Array(12)
  .fill({
    id: '1',
    title: 'Build a Full Stack App with Next.js, Tailwind, & Prisma',
    thumbnail: '/api/placeholder/400/225',
    views: 254032,
    uploadDate: '3 days ago',
    duration: '32:14',
    channelName: 'Code with Me',
  })
  .map((video, index) => ({ ...video, id: index.toString() }));

const VideoCard = ({ video }: { video: Video }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        bgcolor: 'transparent',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          cursor: 'pointer',
        },
      }}
    >
      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={video.thumbnail}
          alt={video.title}
          sx={{
            aspectRatio: '16/9',
            objectFit: 'cover',
            bgcolor: '#e0e0e0',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 500,
          }}
        >
          {video.duration}
        </Typography>
      </Box>
      <CardContent sx={{ p: 1.5, pt: 2, '&:last-child': { pb: 1 } }}>
        <Typography
          gutterBottom
          variant="body1"
          component="h3"
          sx={{
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 0.5,
            lineHeight: 1.3,
          }}
        >
          {video.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {video.channelName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {video.views.toLocaleString()} views • {video.uploadDate}
        </Typography>
      </CardContent>
    </Card>
  );
};

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

const SettingPanel = (props: { open: any; toggle: any }) => {
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

const Homepage = () => {
  const [settingOpen, toggleSetting] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleSetting={toggleSetting} />
      <SettingPanel open={settingOpen} toggle={toggleSetting} />

      <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>
          {mockVideos.map(video => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={video.id}>
              <VideoCard video={video} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Homepage;

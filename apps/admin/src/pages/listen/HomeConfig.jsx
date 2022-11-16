import { Helmet } from "react-helmet-async";
// @mui
import { Grid, Button, Container, Stack, Typography } from "@mui/material";
// components
import Iconify from "../../components/iconify";
import { BlogPostsSort, BlogPostsSearch } from "../../sections/@dashboard/blog";
// mock
import POSTS from "../../_mock/blog";
import { ListenCore } from "core";
import db from "../../providers/firestore";
import AudioCard from "./components/AudioCard";
import FullPageLoader from "../../components/@full-page-loader";
import { useState } from "react";
import AudioCRUDFormDialog from "./components/AudioCRUDFormDialog";

const { useGetHomeAudioList } = ListenCore;
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

// ----------------------------------------------------------------------

export default function ListenHomeConfig() {
  const { values: audioList, loading } = useGetHomeAudioList(db);
  const [showForm, setShowForm] = useState(false);
  const [isCreate, setIsCreate] = useState(true);

  const onClickCreate = () => {
    setIsCreate(true);
    setShowForm(true);
  };

  const onCRUD = (data) => {
    // TODO
    const { src, name, artistName, thumbnailUrl } = data;
  };

  if (loading) {
    return <FullPageLoader open={loading} />;
  }

  return (
    <>
      <Helmet>
        <title> Listen: Home page configuration </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={onClickCreate}
          >
            New Audio
          </Button>
        </Stack>

        <Stack
          mb={5}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {audioList &&
            audioList.map((audio, index) => (
              <AudioCard key={audio.id} audio={audio} index={index} />
            ))}
        </Grid>

        {showForm && (
          <AudioCRUDFormDialog
            open={showForm}
            onClose={() => setShowForm(false)}
            onConfirm={onCRUD}
            isCreate={isCreate}
          />
        )}
      </Container>
    </>
  );
}

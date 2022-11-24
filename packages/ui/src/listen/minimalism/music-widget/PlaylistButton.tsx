import { IconButton } from "@mui/material";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const PlaylistButton = () => {
  const onClick = () => {};

  return (
    <IconButton aria-label="list audio" onClick={onClick}>
      <LibraryMusicIcon />
    </IconButton>
  );
};

export default PlaylistButton;

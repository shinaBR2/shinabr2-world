import { Select, MenuItem } from '@mui/material';

const SiteChoices = () => {
  return (
    <Select defaultValue="watch" size="small" sx={{ ml: 1, minWidth: 100 }}>
      <MenuItem value="watch">Watch</MenuItem>
      <MenuItem value="listen">Listen</MenuItem>
      <MenuItem value="play">Play</MenuItem>
    </Select>
  );
};

export default SiteChoices;

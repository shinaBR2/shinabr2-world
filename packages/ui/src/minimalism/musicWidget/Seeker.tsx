import {
  Box,
  Slider,
  styled,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";

interface Props {
  max: number;
  position: number;
  setPosition: (value: number) => void;
  formatDuration: (value: number) => string;
}

// https://mui.com/material-ui/react-slider/#music-player
const getStyles = (theme: Theme) => {
  return {
    color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
    height: 4,
    "& .MuiSlider-thumb": {
      width: 8,
      height: 8,
      transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
      "&:before": {
        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
      },
      "&:hover, &.Mui-focusVisible": {
        boxShadow: `0px 0px 0px 8px ${
          theme.palette.mode === "dark"
            ? "rgb(255 255 255 / 16%)"
            : "rgb(0 0 0 / 16%)"
        }`,
      },
      "&.Mui-active": {
        width: 20,
        height: 20,
      },
    },
    "& .MuiSlider-rail": {
      opacity: 0.28,
    },
  };
};
const getInfoStyles = () => {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mt: -2,
  };
};

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const Seeker = (props: Props) => {
  const theme = useTheme();
  const { max, position, setPosition, formatDuration } = props;

  const onChange = (_: Event, value: number | number[]) => {
    setPosition(value as number);
  };

  return (
    <>
      <Slider
        aria-label="time-indicator"
        size="small"
        value={position}
        min={0}
        step={1}
        max={max}
        onChange={onChange}
        sx={getStyles(theme)}
      />
      <Box sx={getInfoStyles()}>
        <TinyText>{formatDuration(position)}</TinyText>
        <TinyText>-{formatDuration(max - position)}</TinyText>
      </Box>
    </>
  );
};

export default Seeker;

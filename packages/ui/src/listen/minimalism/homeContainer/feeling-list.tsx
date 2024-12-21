import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface Feeling {
  id: string;
  name: string;
}

interface FeelingListProps {
  activeId: string;
  onSelect: React.Dispatch<React.SetStateAction<string>>;
  feelings: Feeling[];
}

const FeelingList = (props: FeelingListProps) => {
  const { activeId, onSelect, feelings } = props;

  return (
    <Stack direction="row" spacing={1} my={2}>
      <Chip
        label="Default"
        color={!activeId ? 'primary' : 'default'}
        onClick={() => onSelect('')}
      />
      {feelings.map(f => {
        const isActive = !!activeId && f.id === activeId;
        const color = isActive ? 'primary' : 'default';

        return (
          <Chip
            key={f.id}
            label={f.name}
            color={color}
            onClick={() => onSelect(f.id)}
          />
        );
      })}
    </Stack>
  );
};

export { FeelingList };

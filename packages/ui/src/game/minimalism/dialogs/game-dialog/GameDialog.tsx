import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
  Button,
  DialogActions,
} from '@mui/material';
import { useEffect, useReducer } from 'react';
import {
  DialogueChoice,
  DialogueContent,
  GameDialogProps,
} from '../../../types/dialog';

type DialogueState = {
  speaker: string;
  displayedText: string;
  isTyping: boolean;
  selectedChoiceIndex: number;
  currentChoices: DialogueChoice[];
  currentDialogue: DialogueContent;
  textPages: string[];
  currentPageIndex: number;
  showContinuePrompt: boolean;
};

type DialogueAction =
  | { type: 'START_TYPING'; payload: { text: string; pages: string[] } }
  | { type: 'TYPE_CHAR'; payload: { char: string } }
  | { type: 'COMPLETE_TYPING' }
  | { type: 'SET_SPEAKER'; payload: { speaker: string } }
  | { type: 'SET_CHOICES'; payload: { choices: DialogueChoice[] } }
  | { type: 'SELECT_CHOICE'; payload: { index: number } }
  | { type: 'SET_NEXT_DIALOGUE'; payload: { dialogue: DialogueContent } }
  | { type: 'NEXT_PAGE' }
  | { type: 'RESET'; payload: { dialogue: DialogueContent } };

const initialState = (
  dialogue: DialogueContent,
  charsPerPage: number
): DialogueState => {
  const pages = splitTextIntoPages(dialogue.text, charsPerPage);

  return {
    speaker: '',
    displayedText: '',
    isTyping: true,
    selectedChoiceIndex: 0,
    currentChoices: [],
    currentDialogue: dialogue,
    textPages: pages,
    currentPageIndex: 0,
    showContinuePrompt: false,
  };
};

const splitTextIntoPages = (text: string, charsPerPage: number): string[] => {
  const words = text.split(' ');
  const pages: string[] = [];
  let currentPage = '';

  for (const word of words) {
    const potentialLine = currentPage + (currentPage ? ' ' : '') + word;

    if (potentialLine.length > charsPerPage) {
      pages.push(currentPage);
      currentPage = word;
    } else {
      currentPage = potentialLine;
    }
  }

  if (currentPage) {
    pages.push(currentPage);
  }

  return pages;
};

const dialogueReducer = (
  state: DialogueState,
  action: DialogueAction
): DialogueState => {
  switch (action.type) {
    case 'START_TYPING':
      return {
        ...state,
        displayedText: '',
        isTyping: true,
        selectedChoiceIndex: 0,
        currentChoices: [],
        textPages: action.payload.pages,
        currentPageIndex: 0,
        showContinuePrompt: false,
      };

    case 'TYPE_CHAR':
      return {
        ...state,
        displayedText: state.displayedText + action.payload.char,
      };

    case 'COMPLETE_TYPING':
      return {
        ...state,
        isTyping: false,
        showContinuePrompt: state.currentPageIndex < state.textPages.length - 1,
      };

    case 'SET_CHOICES':
      return {
        ...state,
        currentChoices: action.payload.choices,
        selectedChoiceIndex: 0,
        showContinuePrompt: false,
      };

    case 'SELECT_CHOICE':
      return {
        ...state,
        selectedChoiceIndex: action.payload.index,
      };

    case 'SET_NEXT_DIALOGUE':
      return {
        ...state,
        currentDialogue: action.payload.dialogue,
        displayedText: '',
        isTyping: true,
        selectedChoiceIndex: 0,
        currentChoices: [],
        textPages: splitTextIntoPages(action.payload.dialogue.text, 100), // You might want to pass charsPerPage here
        currentPageIndex: 0,
        showContinuePrompt: false,
      };

    case 'NEXT_PAGE':
      return {
        ...state,
        currentPageIndex: state.currentPageIndex + 1,
        displayedText: '',
        isTyping: true,
        showContinuePrompt: false,
      };

    case 'RESET':
      return initialState(action.payload.dialogue, 100);

    default:
      return state;
  }
};

const GameDialog = ({
  isOpen,
  onClose,
  dialogue,
  typewriterSpeed = 50,
  charsPerPage = 100,
}: GameDialogProps) => {
  const [state, dispatch] = useReducer(
    dialogueReducer,
    { charsPerPage, dialogue },
    () => initialState(dialogue, charsPerPage)
  );

  const handleChoiceSelect = (choice: DialogueChoice) => {
    if (choice.nextDialogue) {
      console.log('should show next dialogue');
      dispatch({
        type: 'SET_NEXT_DIALOGUE',
        payload: { dialogue: choice.nextDialogue },
      });
    } else if (choice.callback) {
      choice.callback();
    } else {
      onClose();
    }
  };

  const handleInteraction = () => {
    console.log(state);
    if (state.isTyping) {
      // Complete current page immediately
      dispatch({ type: 'COMPLETE_TYPING' });
      if (state.currentDialogue.choices) {
        dispatch({
          type: 'SET_CHOICES',
          payload: { choices: state.currentDialogue.choices },
        });
      }
    } else if (state.showContinuePrompt) {
      // Move to next page
      dispatch({ type: 'NEXT_PAGE' });
    } else if (state.currentChoices.length > 0) {
      // Select current choice
      handleChoiceSelect(state.currentChoices[state.selectedChoiceIndex]);
    } else {
      // Close dialog
      onClose();
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) {
      dispatch({ type: 'RESET', payload: { dialogue } });
      return;
    }

    const currentPageText = state.textPages[state.currentPageIndex];

    dispatch({
      type: 'SET_SPEAKER',
      payload: { speaker: state.currentDialogue.speaker },
    });
    dispatch({
      type: 'START_TYPING',
      payload: { text: state.currentDialogue.text, pages: state.textPages },
    });

    let index = 0;

    const interval = setInterval(() => {
      if (index < currentPageText.length) {
        dispatch({
          type: 'TYPE_CHAR',
          payload: { char: currentPageText[index] },
        });
        index++;
      } else {
        dispatch({ type: 'COMPLETE_TYPING' });
        if (state.currentDialogue.choices) {
          dispatch({
            type: 'SET_CHOICES',
            payload: { choices: state.currentDialogue.choices },
          });
        }
        clearInterval(interval);
      }
    }, typewriterSpeed);

    return () => clearInterval(interval);
  }, [isOpen, state.currentDialogue, typewriterSpeed]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || state.isTyping) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.isTyping || state.showContinuePrompt) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInteraction();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          dispatch({
            type: 'SELECT_CHOICE',
            payload: {
              index:
                (state.selectedChoiceIndex - 1 + state.currentChoices.length) %
                state.currentChoices.length,
            },
          });

          break;
        case 'ArrowDown':
          e.preventDefault();
          dispatch({
            type: 'SELECT_CHOICE',
            payload: {
              index:
                (state.selectedChoiceIndex + 1) % state.currentChoices.length,
            },
          });

          break;
        case 'Enter':
          e.preventDefault();
          handleInteraction();

          if (!state.currentChoices.length) {
            onClose();
            return;
          }

          const index = state.selectedChoiceIndex;
          const selectedChoice = state.currentChoices[index];

          if (selectedChoice) {
            handleChoiceSelect(selectedChoice);
          }

          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, state.isTyping, state.currentChoices, state.selectedChoiceIndex]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="bg-opacity-90"
    >
      <DialogTitle className="bg-gray-800 text-yellow-400">
        {state.currentDialogue.speaker}
      </DialogTitle>
      <DialogContent className="bg-gray-800">
        <Typography className="text-white py-4">
          {state.displayedText}
        </Typography>
        {state.showContinuePrompt && !state.isTyping && (
          <div className="absolute bottom-0 right-0 animate-bounce">
            a{/* <ChevronDown className="text-white" size={24} /> */}
          </div>
        )}

        {!state.isTyping &&
          !state.showContinuePrompt &&
          state.currentChoices && (
            <Stack spacing={1} className="mt-4">
              {state.currentChoices.map((choice, index) => (
                <Button
                  key={index}
                  variant={
                    state.selectedChoiceIndex === index
                      ? 'contained'
                      : 'outlined'
                  }
                  className={`
                  text-left px-4 py-2
                  ${
                    state.selectedChoiceIndex === index
                      ? 'bg-blue-600'
                      : 'border-blue-400 text-blue-400'
                  }
                `}
                >
                  {choice.text}
                </Button>
              ))}
            </Stack>
          )}
      </DialogContent>
      {!dialogue.choices && !state.isTyping && (
        <DialogActions className="bg-gray-800">
          <Button onClick={onClose} className="text-blue-400">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default GameDialog;

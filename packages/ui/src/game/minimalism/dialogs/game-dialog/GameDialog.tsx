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
  displayedText: string;
  isTyping: boolean;
  selectedChoiceIndex: number;
  currentChoices: DialogueChoice[];
  currentDialogue: DialogueContent;
  textPages: string[];
  currentPageIndex: number;
  showContinuePrompt: boolean;
  charsPerPage: number;
  isLastPage: boolean; // Add this flag
};

type DialogueAction =
  | { type: 'TYPE_CHAR'; payload: { char: string } }
  | { type: 'COMPLETE_TYPING' }
  | { type: 'FORCE_COMPLETE_TYPING'; payload: { text: string } }
  | { type: 'SELECT_CHOICE'; payload: { index: number } }
  | { type: 'SET_NEXT_DIALOGUE'; payload: { dialogue: DialogueContent } }
  | { type: 'NEXT_PAGE' }
  | { type: 'RESET'; payload: { dialogue: DialogueContent } };

const DEFAULT_CHARACTERS_PER_PAGE = 100;

const initialState = (
  dialogue: DialogueContent,
  charsPerPage: number
): DialogueState => {
  const pages = splitTextIntoPages(dialogue.text, charsPerPage);

  return {
    displayedText: '',
    isTyping: true,
    selectedChoiceIndex: 0,
    currentChoices: [],
    currentDialogue: dialogue,
    textPages: pages,
    currentPageIndex: 0,
    showContinuePrompt: false,
    charsPerPage,
    isLastPage: pages.length === 1,
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
  let isLastPage;

  switch (action.type) {
    case 'TYPE_CHAR':
      return {
        ...state,
        displayedText: state.displayedText + action.payload.char,
      };

    case 'COMPLETE_TYPING':
      isLastPage = state.currentPageIndex === state.textPages.length - 1;
      return {
        ...state,
        isTyping: false,
        displayedText: state.textPages[state.currentPageIndex],
        showContinuePrompt: !isLastPage,
        currentChoices: isLastPage ? state.currentDialogue.choices || [] : [],
        isLastPage,
      };

    case 'FORCE_COMPLETE_TYPING':
      isLastPage = state.currentPageIndex === state.textPages.length - 1;
      return {
        ...state,
        isTyping: false,
        displayedText: action.payload.text,
        showContinuePrompt: !isLastPage,
        currentChoices: isLastPage ? state.currentDialogue.choices || [] : [],
        isLastPage,
      };

    case 'SELECT_CHOICE':
      return {
        ...state,
        selectedChoiceIndex: action.payload.index,
      };

    case 'SET_NEXT_DIALOGUE':
      const newPages = splitTextIntoPages(
        action.payload.dialogue.text,
        state.charsPerPage
      );

      return {
        ...state,
        currentDialogue: action.payload.dialogue,
        displayedText: '',
        isTyping: true,
        selectedChoiceIndex: 0,
        currentChoices: [],
        textPages: newPages,
        currentPageIndex: 0,
        showContinuePrompt: false,
        isLastPage: newPages.length === 1,
      };

    case 'NEXT_PAGE':
      const newPageIndex = state.currentPageIndex + 1;
      isLastPage = newPageIndex === state.textPages.length - 1;

      return {
        ...state,
        currentPageIndex: state.currentPageIndex + 1,
        displayedText: '',
        isTyping: true,
        showContinuePrompt: false,
        isLastPage,
      };

    case 'RESET':
      return initialState(action.payload.dialogue, DEFAULT_CHARACTERS_PER_PAGE);

    default:
      return state;
  }
};

const GameDialog = (props: GameDialogProps) => {
  const {
    isOpen,
    onClose,
    dialogue,
    typewriterSpeed = 50,
    charsPerPage = DEFAULT_CHARACTERS_PER_PAGE,
  } = props;
  const [state, dispatch] = useReducer(
    dialogueReducer,
    { charsPerPage, dialogue },
    () => initialState(dialogue, charsPerPage)
  );

  const hasChoices = state.currentChoices.length > 0;
  const isEndOfText = !state.isTyping && state.isLastPage;
  /**
   * End of conversation, no more choices, no more dialogues
   * The only action now is closing the dialog
   */
  const isConversationEnd = isEndOfText && !hasChoices;

  /**
   * Only show choices when text is finish typing
   */
  const shouldShowChoice = isEndOfText && hasChoices;

  /**
   * Should show action button to either:
   * - Move to the next page of text
   * - Close dialog when no more actionable
   */
  const canGoNextTextPage = state.showContinuePrompt && !state.isTyping;
  const shouldShowAction = canGoNextTextPage || isConversationEnd;
  const actionLabel = canGoNextTextPage ? 'Next' : 'Close';

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
    if (state.isTyping) {
      // Complete current page immediately
      dispatch({
        type: 'FORCE_COMPLETE_TYPING',
        payload: {
          text: state.textPages[state.currentPageIndex],
        },
      });
    } else if (state.showContinuePrompt) {
      // Move to next page
      dispatch({ type: 'NEXT_PAGE' });
    } else if (state.isLastPage && state.currentChoices.length > 0) {
      // Select current choice
      handleChoiceSelect(state.currentChoices[state.selectedChoiceIndex]);
    } else if (state.isLastPage && state.currentChoices.length === 0) {
      // Close dialog
      onClose();
    }
  };

  const handleActionButton = () => {
    if (isConversationEnd) {
      onClose();
      return;
    }

    handleInteraction();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (['Enter', ' ', 'ArrowUp', 'ArrowDown'].indexOf(e.key) > -1) {
      e.preventDefault();
    }

    // If typing, pressing any key should complete the typing
    if (state.isTyping) {
      handleInteraction();
      return;
    }

    // If there's more text (show continue prompt), handle navigation
    if (state.showContinuePrompt) {
      if (e.key === 'Enter' || e.key === ' ') {
        handleInteraction();
      }
      return;
    }

    // If we have choices and we're on the last page, handle choice navigation
    if (shouldShowChoice) {
      const { currentChoices, selectedChoiceIndex } = state;
      const numberOfChoices = currentChoices.length;

      switch (e.key) {
        case 'ArrowUp':
          dispatch({
            type: 'SELECT_CHOICE',
            payload: {
              index:
                (selectedChoiceIndex - 1 + numberOfChoices) % numberOfChoices,
            },
          });
          break;

        case 'ArrowDown':
          dispatch({
            type: 'SELECT_CHOICE',
            payload: {
              index: (selectedChoiceIndex + 1) % numberOfChoices,
            },
          });
          break;

        case 'Enter':
        case ' ':
          handleChoiceSelect(currentChoices[selectedChoiceIndex]);
          break;
      }
      return;
    }

    // If we're on the last page with no choices, Enter/Space should close
    if (state.isLastPage && (e.key === 'Enter' || e.key === ' ')) {
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

    let index = 0;
    let timeoutId: number | undefined;

    const typeNextChar = () => {
      if (index < currentPageText.length) {
        dispatch({
          type: 'TYPE_CHAR',
          payload: { char: currentPageText[index] },
        });
        index++;
        timeoutId = setTimeout(typeNextChar, typewriterSpeed);
      } else {
        dispatch({ type: 'COMPLETE_TYPING' });
      }
    };

    typeNextChar();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, state.currentPageIndex, typewriterSpeed]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    state.isTyping,
    state.showContinuePrompt,
    state.currentChoices,
    state.selectedChoiceIndex,
  ]);

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
        {shouldShowChoice && (
          <Stack spacing={1} className="mt-4">
            {state.currentChoices.map((choice, index) => (
              <Button
                key={index}
                variant={
                  state.selectedChoiceIndex === index ? 'contained' : 'outlined'
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
      {shouldShowAction && (
        <DialogActions className="bg-gray-800">
          <Button onClick={handleActionButton} className="text-blue-400">
            {actionLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default GameDialog;

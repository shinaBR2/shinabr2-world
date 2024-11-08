import { Scene } from 'phaser';

export interface DialogueConfig {
  windowWidth?: number;
  windowHeight?: number;
  borderPadding?: number;
  characterDelay?: number;
  defaultStyle?: Phaser.Types.GameObjects.Text.TextStyle;
}

export interface DialogueChoice {
  text: string;
  nextDialogue?: DialogueContent;
  callback?: () => void;
}

export interface DialogueContent {
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
}

interface DialogueElements {
  window: Phaser.GameObjects.Rectangle;
  nameText: Phaser.GameObjects.Text;
  dialogueText: Phaser.GameObjects.Text;
  choiceTexts: Phaser.GameObjects.Text[];
  isTyping: boolean;
}

// Default configuration
const DEFAULT_CONFIG: Required<DialogueConfig> = {
  windowWidth: 400,
  windowHeight: 150,
  borderPadding: 10,
  characterDelay: 50,
  defaultStyle: {
    fontFamily: 'Arial',
    fontSize: '16px',
    color: '#ffffff',
    wordWrap: { width: 380 },
  },
};

/**
 * Create a container for displaying dialogues
 * Each dialogue contain
 * - `nameText`: name of speaker (player/NPC/etc)
 * - `dialogueText`: dialogue content
 *
 * @param scene
 * @param config
 * @returns DialogueElements
 */
const createDialogueElements = (
  scene: Scene,
  config: DialogueConfig = {}
): DialogueElements => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const gameHeight = scene.sys.game.config.height as number;
  const gameWidth = scene.sys.game.config.width as number;

  // Create window
  const dialogueWindow = scene.add.rectangle(
    gameWidth / 2,
    gameHeight - finalConfig.windowHeight / 2 - 10,
    finalConfig.windowWidth,
    finalConfig.windowHeight,
    0x000000,
    0.7
  );

  // Create name text
  const nameText = scene.add.text(
    dialogueWindow.x - finalConfig.windowWidth / 2 + finalConfig.borderPadding,
    dialogueWindow.y - finalConfig.windowHeight / 2 + finalConfig.borderPadding,
    '',
    { ...finalConfig.defaultStyle, fontSize: '18px', color: '#ffff00' }
  );

  // Create dialogue text
  const dialogueText = scene.add.text(
    nameText.x,
    nameText.y + 30,
    '',
    finalConfig.defaultStyle
  );

  return {
    window: dialogueWindow,
    nameText,
    dialogueText,
    choiceTexts: [],
    isTyping: false,
  };
};

/**
 * Set the speaker
 * @param nameTextElement
 */
const setSpeaker = (nameTextElement: Phaser.GameObjects.Text, name: string) => {
  nameTextElement.setText(name);
};

/**
 * Only toggle visibility of dialog elements
 * @param elements
 */
const showDialogue = (elements: DialogueElements): void => {
  elements.window.setVisible(true);
  elements.nameText.setVisible(true);
  elements.dialogueText.setVisible(true);
};

/**
 * Only toggle visibility of dialog elements
 * @param elements
 */
const hideDialogue = (elements: DialogueElements): void => {
  elements.window.setVisible(false);
  elements.nameText.setVisible(false);
  elements.dialogueText.setVisible(false);
  clearChoices(elements);
};

// Typewriter effect
const typewriteText = (
  scene: Scene,
  textObject: Phaser.GameObjects.Text,
  text: string,
  onComplete?: () => void
): void => {
  let index = 0;
  textObject.setText('');

  const timer = scene.time.addEvent({
    delay: DEFAULT_CONFIG.characterDelay,
    callback: () => {
      textObject.text += text[index];
      index++;

      if (index === text.length) {
        timer.destroy();
        onComplete?.();
      }
    },
    repeat: text.length - 1,
  });
};

const showChoices = (
  scene: Scene,
  elements: DialogueElements,
  choices: DialogueChoice[]
): void => {
  clearChoices(elements);

  choices.forEach((choice, index) => {
    const choiceText = scene.add.text(
      elements.dialogueText.x,
      elements.dialogueText.y + 60 + index * 25,
      `> ${choice.text}`,
      { ...DEFAULT_CONFIG.defaultStyle, color: '#aaffaa' }
    );

    choiceText.setInteractive();
    choiceText.on('pointerdown', () => {
      if (choice.nextDialogue) {
        const nextDialogue = choice.nextDialogue;
        showDialogue(elements);
        setSpeaker(elements.nameText, nextDialogue.speaker);
        typewriteText(scene, elements.dialogueText, nextDialogue.text, () => {
          if (nextDialogue.choices) {
            showChoices(scene, elements, nextDialogue.choices);
          }
        });
      } else if (choice.callback) {
        choice.callback();
        hideDialogue(elements);
      }
    });

    elements.choiceTexts.push(choiceText);
  });
};

const clearChoices = (elements: DialogueElements): void => {
  elements.choiceTexts.forEach(text => text.destroy());
  elements.choiceTexts = [];
};

const initializeInput = (
  scene: Scene,
  elements: DialogueElements,
  currentDialogueRef: { current: DialogueContent | null },
  dialogueQueue: DialogueContent[]
): void => {
  const advanceKeys = scene.input.keyboard?.addKeys({
    space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
  });

  scene.input.keyboard?.on('keydown-SPACE', () => handleInput());
  scene.input.keyboard?.on('keydown-ENTER', () => handleInput());

  const handleInput = () => {
    console.log('handleInput called: elements.isTyping', elements.isTyping);
    console.log(
      'handleInput called: currentDialogueRef.current',
      currentDialogueRef.current
    );
    console.log('handleInput called: dialogueQueue', dialogueQueue);
    if (elements.isTyping) {
      // Skip to end of current text if still typing
      // completeTyping(scene, elements, currentDialogueRef.current!);
      scene.time.removeAllEvents();
      elements.dialogueText.setText(currentDialogueRef?.current?.text);
      elements.isTyping = false;
      showChoices(scene, elements, currentDialogueRef.current?.choices);
    } else if (!currentDialogueRef.current?.choices) {
      // Advance to next dialogue if no choices are present
      if (dialogueQueue.length > 0) {
        const nextDialogue = dialogueQueue.shift()!;
        // TODO
        showDialogue(elements);
        setSpeaker(elements.nameText, nextDialogue.speaker);
        typewriteText(scene, elements.dialogueText, nextDialogue.text, () => {
          if (nextDialogue.choices) {
            showChoices(scene, elements, nextDialogue.choices);
          }
        });
      } else {
        hideDialogue(elements);
        currentDialogueRef.current = null;
      }
    }
  };
};

/**
 * Construct dialogue
 * - Initialize elements: call `createDialogueElements`
 * - Show initialized elements (window, texts, etc)
 * - Set speaker
 * - Typewriting effect
 * - Initialize input
 *
 * @param scene
 * @param dialogues
 * @returns void
 */
const startDialogue = (scene: Scene, dialogues: DialogueContent[]) => {
  console.log('dialogues', dialogues);
  console.log('dialogues length', dialogues.length);
  if (dialogues.length === 0) return;

  const elements = createDialogueElements(scene);
  console.log('Original dialogues:', dialogues);
  const dialogueQueue = dialogues.slice(1);
  console.log('Queue after slice:', dialogueQueue);
  const firstDialogue = dialogues[0];
  const currentDialogueRef = { current: firstDialogue };

  console.log('dialogueQueue', dialogueQueue);
  console.log('dialogueQueue length', dialogueQueue.length);

  showDialogue(elements);
  initializeInput(scene, elements, currentDialogueRef, dialogueQueue);

  setSpeaker(elements.nameText, firstDialogue.speaker);
  typewriteText(scene, elements.dialogueText, firstDialogue.text, () => {
    if (firstDialogue.choices) {
      showChoices(scene, elements, firstDialogue.choices);
    }
  });
};

export { showDialogue, hideDialogue, startDialogue };

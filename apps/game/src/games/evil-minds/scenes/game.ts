import {
  DialogueContent,
  showDialogue,
  startDialogue,
} from '../../../core/helpers/dialogues';
import { handlePlayerMovement } from '../../../core/helpers/movement';
import { checkTileInteraction } from '../../../core/helpers/tileInteraction';
import DialogueManager from '../components/dialogueManager';

const SCALE = 1.5;
const TILE_SIZE = SCALE * 16;
const PLAYER_SCALE = 0.25;

class GameScene extends Phaser.Scene {
  gridEngine: any;
  borders!: Phaser.Physics.Arcade.StaticGroup;
  map!: Phaser.Tilemaps.Tilemap;
  walls!: Phaser.Physics.Arcade.StaticGroup;
  blocks!: Phaser.Physics.Arcade.StaticGroup;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  groundLayer!: Phaser.Tilemaps.TilemapLayer;
  onFloorLayer!: Phaser.Tilemaps.TilemapLayer;
  decorationLayer!: Phaser.Tilemaps.TilemapLayer;
  // coin: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // score: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  init() {}

  create() {
    const map = this.createMap();
    this.createPlayer();
    this.initGridEngine(map);
    this.setupCamera();

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    handlePlayerMovement({
      cursors: this.cursors,
      gridEngine: this.gridEngine,
    });

    checkTileInteraction({
      gridEngine: this.gridEngine,
      layer: this.decorationLayer,
      propertyKey: 'isHouseSign',
      interactKey: this.interactKey,
      onInteract: tile => {
        const dialogues: DialogueContent[] = [
          {
            speaker: 'Merchant',
            text: 'Welcome to my shop!',
          },
          {
            speaker: 'Merchant',
            text: 'Would you like to see my wares?',
            choices: [
              {
                text: 'Yes, show me',
                callback: () => {},
              },
              {
                text: 'No thanks',
                nextDialogue: {
                  speaker: 'Merchant',
                  text: 'Come back anytime!',
                },
              },
            ],
          },
        ];

        // Start the dialogue sequence
        // queueDialogues(this, this.dialogueElements, dialogues);
        startDialogue(this, dialogues);

        // console.log('tile', tile);
        // this.showMessage('my house');
        // const dialogue = {
        //   speaker: 'NPC Name',
        //   text: 'Hello traveler! Would you like to trade?',
        //   choices: [
        //     {
        //       text: 'Yes, show me your wares',
        //       callback: () => {
        //         console.log('show me the shop');
        //       },
        //     },
        //     {
        //       text: 'Not now',
        //       nextDialogue: {
        //         speaker: 'NPC Name',
        //         text: 'Come back anytime!',
        //       },
        //     },
        //   ],
        // };

        // showDialogue(this, this.dialogueElements, dialogue);

        // const dialogueSequence: DialogueContent[] = [
        //   {
        //     speaker: 'Hero',
        //     text: 'Hello there!',
        //   },
        //   {
        //     speaker: 'Merchant',
        //     text: 'Welcome to my shop!',
        //   },
        // ];
        // queueDialogues(this, this.dialogueElements, dialogueSequence);
      },
    });
  }

  /**
   * END OF LIFE CYCLES
   */
  createMap() {
    // Create the tilemap
    const map = this.make.tilemap({ key: 'map' });

    this.createMapLayers(map);

    return map;
  }

  createPlayer() {
    const offsetX = TILE_SIZE / 2;
    const offsetY = TILE_SIZE;
    this.player = this.physics.add.sprite(
      5 * TILE_SIZE + offsetX,
      14 * TILE_SIZE + offsetY,
      'player',
      55 // frame for the first load
    );
    this.player.setDepth(2);
    this.player.setScale(SCALE);

    this.interactKey = this.input.keyboard.addKey('R');

    this.messageText = this.add.text(400, 500, '', {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.messageText.setOrigin(0.5);
    this.messageText.setVisible(false);
  }

  initGridEngine(map: Phaser.Tilemaps.Tilemap) {
    /**
     * See the player.png file
     * Grid engine split the spritesheets into multiple blocks like
     * [Block 0][Block 1][Block 2][Block 3]
     * [Block 4][Block 5][Block 6][Block 7]
     *
     * Each block contains 4 rows, each row has 3 frames
     */
    const gridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: this.player,
          walkingAnimationMapping: 4, // the zero-based index of block
          startPosition: { x: 5, y: 14 },
        },
      ],
      numberOfDirections: 8,
    };
    this.gridEngine.create(map, gridEngineConfig);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      this.game.config.width as number,
      this.game.config.height as number
    );
  }

  /**
   * HELPERS
   */

  createMapLayers(map: Phaser.Tilemaps.Tilemap) {
    /**
     * addTilesetImage(tileset_name, imageKey)
     * - tileset_name: name of Tileset in Tile Map Editor
     * - imageKey: Phaser image key, first params of this.load.image()
     */
    const tileset = map.addTilesetImage(
      'cloud_map',
      'map'
    ) as Phaser.Tilemaps.Tileset;

    // Create layers (use the layer names from your Tiled map)
    this.groundLayer = map.createLayer('floor', tileset);
    this.onFloorLayer = map.createLayer('onfloor', tileset);
    this.decorationLayer = map.createLayer('decoration', tileset);
    const overlayLayer = map.createLayer('overlay', tileset);
    // this.interactLayer = map.createLayer('interact', tileset, 0, 0);

    this.groundLayer?.setDepth(0);
    this.groundLayer?.setScale(SCALE);

    this.onFloorLayer?.setDepth(1);
    this.onFloorLayer?.setScale(SCALE);

    this.decorationLayer?.setDepth(2);
    this.decorationLayer?.setScale(SCALE);

    overlayLayer?.setVisible(false);

    const layers = [this.groundLayer, this.onFloorLayer, this.decorationLayer];

    return layers;
  }

  handleNearbySign(tile) {
    // Show prompt if not already shown
    if (!this.nearSign) {
      this.nearSign = true;
      this.promptText.setVisible(true);
    }

    // Check for interaction
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.showMessage('My house');
    }
  }

  handleLeaveSign() {
    this.nearSign = false;
    this.promptText.setVisible(false);
    this.messageText.setVisible(false);
  }

  showMessage(message) {
    this.messageText.setText(message);
    this.messageText.setVisible(true);

    // Optional: Hide message after a few seconds
    this.time.delayedCall(3000, () => {
      this.messageText.setVisible(false);
    });
  }
}

export default GameScene;

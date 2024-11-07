import { checkTileInteraction } from '../../../core/helpers/tileInteraction';

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
    this.handlePlayerMovement();
  }

  /**
   * END OF LIFE CYCLES
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

  collectCoin(player, coin) {
    // Disable the coin's physics body and hide it
    coin.disableBody(true, true);

    // Update score
    this.score += 10;
    // this.scoreText.setText('Score: ' + this.score);

    // Optional: Play sound effect
    // this.sound.play('coinSound');
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

  handlePlayerMovement() {
    if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.gridEngine.move('player', 'up-left');
    } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.gridEngine.move('player', 'down-left');
    } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.gridEngine.move('player', 'up-right');
    } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.gridEngine.move('player', 'down-right');
    } else if (this.cursors.left.isDown) {
      this.gridEngine.move('player', 'left');
    } else if (this.cursors.right.isDown) {
      this.gridEngine.move('player', 'right');
    } else if (this.cursors.up.isDown) {
      this.gridEngine.move('player', 'up');
    } else if (this.cursors.down.isDown) {
      this.gridEngine.move('player', 'down');
    }

    this.checkNearbyInteractiveTiles();

    // Handle interaction
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) && this.nearDoor) {
      this.interactWithDoor();
    }
  }

  checkNearbyInteractiveTiles() {
    const canInteract = checkTileInteraction({
      gridEngine: this.gridEngine,
      layer: this.decorationLayer,
      propertyKey: 'isHouseSign',
      interactKey: this.interactKey,
      onInteract: tile => {
        console.log('tile', tile);
        this.showMessage('my house');
      },
    });
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

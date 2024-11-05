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
    const groundLayer = map.createLayer('floor', tileset);
    const onFloorLayer = map.createLayer('onfloor', tileset);
    const decorationLayer = map.createLayer('decoration', tileset);
    const overlayLayer = map.createLayer('overlay', tileset);

    // Set collision based on the custom property we created
    groundLayer?.setCollisionByProperty({ collides: true });
    groundLayer?.setDepth(0);
    groundLayer?.setScale(SCALE);

    onFloorLayer?.setCollisionByProperty({ collides: true });
    onFloorLayer?.setDepth(1);
    onFloorLayer?.setScale(SCALE);

    decorationLayer?.setCollisionByProperty({ collides: true });
    decorationLayer?.setDepth(2);
    decorationLayer?.setScale(SCALE);

    overlayLayer?.setVisible(false);

    const layers = [groundLayer, onFloorLayer, decorationLayer];

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
    if (this.cursors.left.isDown) {
      this.gridEngine.move('player', 'left');
    } else if (this.cursors.right.isDown) {
      this.gridEngine.move('player', 'right');
    } else if (this.cursors.up.isDown) {
      this.gridEngine.move('player', 'up');
    } else if (this.cursors.down.isDown) {
      this.gridEngine.move('player', 'down');
    }
  }
}

export default GameScene;

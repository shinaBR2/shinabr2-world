class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    // Initialize variables
    this.player = null;
    this.cursors = null;
  }

  create() {
    this.createMap();
    // this.createPlayer();
    // this.createAnimations();
    // this.setupCamera();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMap() {
    const map = this.make.tilemap({ key: 'cloud-city-map' });
    //
    /**
     * Add all tilesets
     * First param is name from tsx file, second is the key you used in loading
     */
    const mapTileset = map.addTilesetImage('cloud_map', 'map-tileset');
    const wallTileset = map.addTilesetImage('wall', 'wall-tileset');
    const solidTileset = map.addTilesetImage('solid', 'solid-tileset');

    /**
     * When creating layers, pass array of all tilesets
     */
    const floorLayer = map.createLayer('floor', [mapTileset], 0, 0);
    const onfloorLayer = map.createLayer(
      'onfloor',
      [wallTileset, solidTileset],
      0,
      0
    );

    const gameWidth = this.game.config.width;
    const gameHeight = this.game.config.height;
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    // Scale camera to fit
    // this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setZoom(
      Math.min(gameWidth / mapWidth, gameHeight / mapHeight)
    );

    // Center the map
    this.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);

    // objectLayer.setCollisionByProperty({ collides: true });
    // this.objectLayer = objectLayer;
  }

  createPlayer() {
    const layer = map.createLayer('player', tileset);

    // If you set collision on layer
    // layer.setCollisionByProperty({ collides: true });

    // Or if you set collision on specific tiles
    // layer.setCollisionFromCollisionGroup();
    this.player = this.physics.add.sprite(400, 300, 'player');

    // this.player.setCollideWorldBounds(true);
    // this.physics.add.collider(this.player, this.objectLayer);
  }

  createAnimations() {
    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      this.game.config.width,
      this.game.config.height
    );
  }

  update() {
    // this.handlePlayerMovement();
  }

  handlePlayerMovement() {
    const speed = 160;

    // Reset velocity
    this.player.setVelocity(0);

    // Handle movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('walk-left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('walk-right', true);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.player.anims.play('walk-up', true);
      }
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.player.anims.play('walk-down', true);
      }
    }

    // Stop animations if not moving
    if (
      this.player.body.velocity.x === 0 &&
      this.player.body.velocity.y === 0
    ) {
      this.player.anims.stop();
    }
  }
}

export default GameScene;

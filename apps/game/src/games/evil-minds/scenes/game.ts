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
    this.setupCamera();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMap() {
    const map = this.make.tilemap({ key: 'cloud-city-map' });
    const mapTileset = map.addTilesetImage('cloud_map', 'map-tileset');
    const wallTileset = map.addTilesetImage('wall', 'wall-tileset');
    const solidTileset = map.addTilesetImage('solid', 'solid-tileset');

    // Calculate proper zoom first
    const zoom = this.game.config.width / map.widthInPixels;

    // Calculate vertical offset before creating layers
    const yOffset =
      (this.game.config.height - map.heightInPixels * zoom) / 2 / zoom;

    // Create layers with offset
    const floorLayer = map.createLayer('floor', [mapTileset], 0, yOffset);
    const onfloorLayer = map.createLayer(
      'onfloor',
      [wallTileset, solidTileset],
      0,
      yOffset
    );

    // Set camera zoom
    this.cameras.main.setZoom(zoom);

    // Set physics bounds
    this.physics.world.setBounds(
      0,
      yOffset,
      map.widthInPixels,
      map.heightInPixels
    );

    onfloorLayer.setCollisionByProperty({ collides: true });

    // Add player with proper scale
    this.player = this.physics.add.sprite(48, yOffset + 48, 'player');

    // Scale player to match tile size (16px) * zoom
    const targetSize = 16 * zoom;
    this.player.setScale(targetSize / this.player.width);

    // Adjust physics body to match tile size
    this.player.body.setSize(16, 16);

    // Make sure collision is enabled
    this.physics.add.collider(this.player, onfloorLayer);

    // Enable physics and collision
    this.physics.world.enable(this.player);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, onfloorLayer);

    // Debug graphics to see collision boxes
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    onfloorLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    // Enable debug for player physics body
    this.physics.world.createDebugGraphic();
    this.player.body.debugShowBody = true;
    this.player.body.debugShowVelocity = true;
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
    this.handlePlayerMovement();
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

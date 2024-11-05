class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    // Initialize variables
    this.player = null;
    this.cursors = null;
    this.SCALE = 1.5;
    this.TILE_SIZE = 16 * this.SCALE; // Base tile size
    this.PLAYER_SCALE = 0.25; // 24x24 (1.5 tiles) for player
    this.wallPositions = new Set(); // Track wall positions
  }

  create() {
    // this.generateMap(15, 13);
    this.createMap();
    // this.createPlayer();
    // this.createAnimations();
    this.setupCamera();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMap() {
    // Create the tilemap
    const map = this.make.tilemap({ key: 'map' });

    // Add tileset image to the map
    // Parameters: (tilesetNameInTiled, imageKeyInPhaser)
    const tileset = map.addTilesetImage('cloud_map', 'map');

    // Create layers (use the layer names from your Tiled map)
    const groundLayer = map.createLayer('floor', tileset, 0, 0);
    const onFloorLayer = map.createLayer('onfloor', tileset, 0, 0);
    const decorationLayer = map.createLayer('decoration', tileset, 0, 0);

    // Set collision based on the custom property we created
    groundLayer.setCollisionByProperty({ collides: true });
    groundLayer?.setDepth(0);
    groundLayer?.setScale(this.SCALE);

    onFloorLayer.setCollisionByProperty({ collides: true });
    onFloorLayer?.setDepth(1);
    onFloorLayer?.setScale(this.SCALE);

    decorationLayer.setCollisionByProperty({ collides: true });
    decorationLayer?.setDepth(2);
    decorationLayer?.setScale(this.SCALE);

    const offsetX = this.TILE_SIZE / 2;
    const offsetY = this.TILE_SIZE;
    this.player = this.physics.add.sprite(
      5 * this.TILE_SIZE + offsetX, // Start at 2 tiles from left
      14 * this.TILE_SIZE + offsetY, // Start at 2 tiles from top
      'player',
      55 // frame for the first load
    );
    this.player.setDepth(2);
    this.player.setScale(this.SCALE);
    this.player.setOrigin(0.5, 1);

    // this.player.setPosition(
    //   6 * this.TILE_SIZE + offsetX,
    //   6 * this.TILE_SIZE + offsetY
    // );
    // this.player.setScale(16 / 96);
    // this.player.setScale(this.PLAYER_SCALE);
    // Make hitbox slightly smaller than visual size for better gameplay
    const playerVisualSize = 24; // 1.5 tiles
    const bodySize = 28; // Slightly smaller than visual
    const bodyOffset = (96 * this.PLAYER_SCALE - bodySize) / 2;

    // this.player.body.setSize(bodySize, bodySize);
    // this.player.body.setOffset(
    //   (96 - bodySize) / 2, // Center horizontally in the sprite
    //   (96 - bodySize) / 2 // Center vertically in the sprite
    // );

    // Add collision between player and layer
    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, onFloorLayer);
    this.physics.add.collider(this.player, decorationLayer);

    // Optional: Debug visualization
    // This will show collision tiles in a different color
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    groundLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
  }

  createPlayer() {
    // const layer = map.createLayer('player', tileset);

    // If you set collision on layer
    // layer.setCollisionByProperty({ collides: true });

    // Or if you set collision on specific tiles
    // layer.setCollisionFromCollisionGroup();
    this.player = this.physics.add.sprite(400, 300, 'player');

    // this.player.setCollideWorldBounds(true);
    // this.physics.add.collider(this.player, this.objectLayer);

    // Create static physics group for borders
    this.borders = this.physics.add.staticGroup();

    // Create invisible rectangles for each border
    // Top border
    this.borders.add(
      this.add
        .rectangle(0, 0, this.game.config.width, 32, 0x000000, 0)
        .setOrigin(0, 0)
    );

    // Bottom border
    this.borders.add(
      this.add
        .rectangle(
          0,
          this.game.config.height - 32,
          this.game.config.width,
          32,
          0x000000,
          0
        )
        .setOrigin(0, 0)
    );

    // Left border
    this.borders.add(
      this.add
        .rectangle(0, 0, 32, this.game.config.height, 0x000000, 0)
        .setOrigin(0, 0)
    );

    // Right border
    this.borders.add(
      this.add
        .rectangle(
          this.game.config.width - 32,
          0,
          32,
          this.game.config.height,
          0x000000,
          0
        )
        .setOrigin(0, 0)
    );

    // Add collision between player and borders
    this.physics.add.collider(this.player, this.borders);
    this.borders.getChildren().forEach(border => border.setAlpha(0.3));
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

  handleInitialScale(map) {
    // Calculate proper zoom first
    const zoom = this.game.config.width / map.widthInPixels;

    // Calculate vertical offset before creating layers
    const yOffset =
      (this.game.config.height - map.heightInPixels * zoom) / 2 / zoom;

    // Set camera zoom
    this.cameras.main.setZoom(zoom);
  }

  generateMap(width, height) {
    this.add
      .rectangle(0, 0, 9 * this.tileSize, 9 * this.tileSize, 0x00ff00)
      .setOrigin(0);
    this.map = Array(height)
      .fill()
      .map(() => Array(width).fill(0));

    this.add.sprite(0, 0, 'map-tileset').setOrigin(0).setAlpha(0.1);

    // Generate possible positions for walls
    const possiblePositions = [];

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        // Skip positions in the 3x3 safe zone
        if (!(x < 3 && y < 3)) {
          possiblePositions.push({ x, y });
        }
      }
    }

    console.log('Possible positions:', possiblePositions.length);

    // Randomly place walls in about 30% of possible positions
    const numberOfWalls = Math.floor(possiblePositions.length * 0.3);

    console.log('Number of walls to place:', numberOfWalls);

    // Shuffle array to get random positions
    for (let i = possiblePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possiblePositions[i], possiblePositions[j]] = [
        possiblePositions[j],
        possiblePositions[i],
      ];
    }

    // Place walls
    for (let i = 0; i < numberOfWalls; i++) {
      const pos = possiblePositions[i];

      console.log('Placing wall at:', pos.x, pos.y);
      this.add
        .sprite(pos.x * this.tileSize, pos.y * this.tileSize, 'solid-tileset')
        .setOrigin(0);

      // Store wall position for later use
      this.wallPositions.add(`${pos.x},${pos.y}`);
    }

    // Now place blocks in remaining positions (except where walls are)
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        // Skip safe zone and positions with walls
        if (x < 3 && y < 3) continue;
        if (this.wallPositions.has(`${x},${y}`)) continue;

        // 50% chance to place a block
        if (Math.random() < 0.5) {
          console.log('Placing block at:', x, y);
          this.add
            .sprite(x * this.tileSize, y * this.tileSize, 'wall-tileset')
            .setOrigin(0);
        }
      }
    }

    // OLD CODE BELOW

    // Create map array
    // this.map = Array(height)
    //   .fill()
    //   .map(() => Array(width).fill(0));

    // // Place indestructible walls in grid pattern
    // for (let y = 0; y < height; y++) {
    //   for (let x = 0; x < width; x++) {
    //     if (x % 2 === 0 && y % 2 === 0) {
    //       this.map[y][x] = 1;
    //     }
    //   }
    // }

    // // Randomly place destructible blocks
    // for (let y = 0; y < height; y++) {
    //   for (let x = 0; x < width; x++) {
    //     // Skip indestructible walls
    //     if (this.map[y][x] === 1) continue;

    //     // Keep spawn points clear (corners)
    //     if ((x <= 1 && y <= 1) || (x >= width - 2 && y >= height - 2)) {
    //       continue;
    //     }

    //     // 40% chance for destructible block
    //     if (Math.random() < 0.4) {
    //       this.map[y][x] = 2;
    //     }
    //   }
    // }

    // Place tiles based on map array
    // this.placeTiles();
  }

  placeTiles() {
    this.walls = this.physics.add.staticGroup();
    this.blocks = this.physics.add.staticGroup();

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[0].length; x++) {
        const tileType = this.map[y][x];
        const xPos = x * 16;
        const yPos = y * 16;

        switch (tileType) {
          case 0: // Empty space
            // Place floor/background tile
            this.add.sprite(xPos, yPos, 'map-tileset').setOrigin(0);
            break;
          case 1: // Indestructible wall
            this.add.sprite(xPos, yPos, 'map-tileset').setOrigin(0);
            this.add.sprite(xPos, yPos, 'solid-tileset').setOrigin(0);
            break;
          case 2: // Destructible block
            this.add.sprite(xPos, yPos, 'map-tileset').setOrigin(0);
            this.add.sprite(xPos, yPos, 'wall-tileset').setOrigin(0);
            break;
        }
      }
    }
  }

  update() {
    this.handlePlayerMovement();
  }

  handlePlayerMovement() {
    const speed = 100;

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

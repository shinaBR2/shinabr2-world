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
    // this.createMap();
    this.createPlayer();
    // this.createAnimations();
    this.setupCamera();
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMap() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');

    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const objectLayer = map.createLayer('Objects', tileset, 0, 0);

    objectLayer.setCollisionByProperty({ collides: true });
    this.objectLayer = objectLayer;
  }

  createPlayer() {
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

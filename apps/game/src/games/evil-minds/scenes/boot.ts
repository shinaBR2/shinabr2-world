class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.createLoadingScreen();
    this.loadAssets();
  }

  createLoadingScreen() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

    // Loading text
    const loadingText = this.add.text(
      width / 2,
      height / 2 - 50,
      'Loading...',
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
      }
    );
    loadingText.setOrigin(0.5);

    // Percentage text
    const percentText = this.add.text(width / 2, height / 2 + 70, '0%', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
    });
    percentText.setOrigin(0.5);

    // Loading file text
    const assetText = this.add.text(width / 2, height / 2 + 100, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
    });
    assetText.setOrigin(0.5);

    // Register loading events
    this.load.on('progress', value => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        width / 4 + 10,
        height / 2 - 20,
        (width / 2 - 20) * value,
        30
      );
      percentText.setText(`${Number.parseInt(value * 100)}%`);
    });

    this.load.on('fileprogress', file => {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', () => {
      this.createAnimations();
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();

      this.startGame();
    });
  }

  loadAssets() {
    // Load all game assets here
    const basePath = 'assets/evil-minds';
    this.load.tilemapTiledJSON('map', `${basePath}/map.json`);
    // Load ALL tileset images used in the map
    this.load.image('map', `${basePath}/map/tileset.png`);

    console.log('Loading map from:', `${basePath}/map.json`);
    console.log('Loading tileset from:', `${basePath}/map/tileset.png`);

    // Character sprites
    this.load.spritesheet('player', `${basePath}/player.png`, {
      frameWidth: 96,
      frameHeight: 96,
    });
    // this.load.spritesheet('npc', 'assets/characters/npc.png', {
    //   frameWidth: 32,
    //   frameHeight: 48,
    // });

    // // Tilesets
    // this.load.image('interior-tileset', 'assets/tilesets/interior.png');
    // this.load.image('exterior-tileset', 'assets/tilesets/exterior.png');

    // // Maps
    // this.load.tilemapTiledJSON('house-map', 'assets/maps/house.json');
    // this.load.tilemapTiledJSON('world-map', 'assets/maps/world.json');

    // // UI elements
    // this.load.image('dialog-box', 'assets/ui/dialog-box.png');
    // this.load.image('menu-background', 'assets/ui/menu-bg.png');
    // this.load.spritesheet('ui-buttons', 'assets/ui/buttons.png', {
    //   frameWidth: 64,
    //   frameHeight: 32,
    // });

    // // Audio
    // this.load.audio('bgm-main', 'assets/audio/background-music.mp3');
    // this.load.audio('sfx-footsteps', 'assets/audio/footsteps.mp3');
    // this.load.audio('sfx-dialog', 'assets/audio/dialog-blip.mp3');

    // // Fonts
    // this.load.bitmapFont(
    //   'pixel-font',
    //   'assets/fonts/pixel.png',
    //   'assets/fonts/pixel.xml'
    // );

    // // Effects
    // this.load.spritesheet('particles', 'assets/effects/particles.png', {
    //   frameWidth: 16,
    //   frameHeight: 16,
    // });
  }

  startGame() {
    // Optional: Add a slight delay before starting the game
    this.time.delayedCall(500, () => {
      // You can add a fade out effect here
      this.cameras.main.fadeOut(1000);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        // Start with the menu scene first
        this.scene.start('GameScene');
      });
    });
  }

  createPlayerAnimations() {
    /**
     * Generally:
     * Lower frameRate (4-6) = slower, more leisurely animations
     * Medium frameRate (8-12) = typical walking animations
     * Higher frameRate (15+) = faster animations, good for running
     */
    const frameRate = 8;
    const repeat = -1; // -1 means loop forever

    // Front-facing animations
    this.anims.create({
      key: 'idle-down',
      frames: [{ key: 'player', frame: 1 }], // Middle frame of first row
      frameRate,
    });

    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 2,
        first: 0,
      }),
      frameRate: frameRate,
      repeat,
    });

    // Left-facing animations (second row, frames 3-5)
    this.anims.create({
      key: 'idle-left',
      frames: [{ key: 'player', frame: 4 }], // Middle frame of second row
      frameRate: frameRate,
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 3,
        end: 5,
      }),
      frameRate: frameRate,
      repeat: repeat,
    });

    // Right-facing animations (third row, frames 6-8)
    this.anims.create({
      key: 'idle-right',
      frames: [{ key: 'player', frame: 7 }], // Middle frame of third row
      frameRate: frameRate,
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 6,
        end: 8,
      }),
      frameRate: frameRate,
      repeat: repeat,
    });

    // Back-facing animations (fourth row, frames 9-11)
    this.anims.create({
      key: 'idle-up',
      frames: [{ key: 'player', frame: 10 }], // Middle frame of fourth row
      frameRate: frameRate,
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', {
        start: 9,
        end: 11,
      }),
      frameRate: frameRate,
      repeat: repeat,
    });
  }

  createAnimations() {
    this.createPlayerAnimations();
  }
}

export default BootScene;

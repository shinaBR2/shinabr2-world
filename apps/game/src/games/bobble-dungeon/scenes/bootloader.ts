export default class Bootloader extends Phaser.Scene {
  private loadBar: Phaser.GameObjects.Graphics;
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "bootloader" });
  }

  preload(): void {
    this.createBars();
    this.setLoadEvents();
    this.loadFonts();
    this.loadImages();
    this.loadMaps();
    this.loadAudios();
    this.loadSpritesheets();
  }

  private setLoadEvents(): void {
    this.load.on(
      "progress",
      function (this: Bootloader, value: number) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x0088aa, 1);
        this.progressBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2 - 16,
          (this.cameras.main.width / 2) * value,
          16
        );
      },
      this
    );

    this.load.on(
      "complete",
      () => {
        this.scene.start("splash");
      },
      this
    );
  }

  private loadFonts(): void {
    this.load.bitmapFont(
      "default",
      "assets/fonts/pico.png",
      "assets/fonts/pico.xml"
    );
  }

  private loadImages(): void {
    this.load.image("pello", "assets/images/pello_ok.png");
    this.load.image("fireball", "assets/images/fireball.png");
    this.load.image("tiles", "assets/maps/pixel-poem-tiles.png");
    this.load.image("block", "assets/images/block.png");
    this.load.image("seesaw", "assets/images/seesaw.png");
    this.load.image("bubble", "assets/images/bubble.png");
    this.load.image("platform", "assets/images/platform.png");
  }

  private loadMaps(): void {
    this.load.tilemapTiledJSON("scene0", "assets/maps/level.json");
  }

  private loadAudios(): void {
    Array(5)
      .fill(0)
      .forEach((_, i) => {
        this.load.audio(`climb${i}`, `assets/sounds/climb${i}.mp3`);
      });

    this.load.audio("splash", "assets/sounds/splash.mp3");
    this.load.audio("music", "assets/sounds/music.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("bubble", "assets/sounds/bubble.mp3");
    this.load.audio("trap", "assets/sounds/trap.mp3");
    this.load.audio("crash", "assets/sounds/crash.mp3");
    this.load.audio("fireball", "assets/sounds/fireball.mp3");
    this.load.audio("win", "assets/sounds/win.mp3");
    this.load.audio("start", "assets/sounds/start.mp3");
    this.load.audio("death", "assets/sounds/death.mp3");
  }

  private loadSpritesheets(): void {
    this.load.spritesheet("player", "assets/images/player.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("dust", "assets/images/dust.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("coin", "assets/images/coin.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("keys", "assets/images/keys.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("bat", "assets/images/bat.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("wizard", "assets/images/wizard.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  private createBars(): void {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0x00aafb, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}

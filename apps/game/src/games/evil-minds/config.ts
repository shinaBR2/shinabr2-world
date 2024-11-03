import BootScene from './scenes/boot';
import GameScene from './scenes/game';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#ddd',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // No gravity for top-down view
      debug: false,
    },
  },
  scene: [
    BootScene, // Loading assets
    // MenuScene, // Main menu
    GameScene, // Main gameplay
    // DialogScene, // Dialog overlay
    // PauseScene, // Pause menu
  ],
};

export default config;

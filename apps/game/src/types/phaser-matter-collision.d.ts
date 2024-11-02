// src/types/phaser-matter-collision.d.ts

// First, define our collision plugin types
interface CollisionData {
  bodyA: MatterJS.BodyType;
  bodyB: MatterJS.BodyType;
  gameObjectA?: any;
  gameObjectB?: any;
  pair: any;
}

interface CollisionConfig {
  objectA: any;
  objectB?: any;
  callback: (data: CollisionData) => void;
  context?: any;
}

interface MatterCollisionPlugin {
  addOnCollideStart(config: CollisionConfig): () => void;
  addOnCollideEnd(config: CollisionConfig): () => void;
  addOnCollideActive(config: CollisionConfig): () => void;
}

// Then extend Phaser's types
declare module "phaser" {
  interface Scene {
    matterCollision: MatterCollisionPlugin;
  }

  namespace Scenes {
    interface Systems {
      matterCollision: MatterCollisionPlugin;
    }
  }
}

import Fireball from "./fireball";
import Bubble from "./bubble";

export default class Wizard extends Phaser.Physics.Matter.Sprite {
  label: string;
  startX: number;
  direction: number;
  timer: Phaser.Time.TimerEvent;
  unsubscribeBatCollide: any;
  delayedTurn: Phaser.Time.TimerEvent;
  fireball: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture = "wizard") {
    super(scene.matter.world, x, y, texture, 0);
    this.label = "wizard";
    this.scene.add.existing(this);
    this.startX = x;
    this.direction = Phaser.Math.RND.pick([-1, 1]);

    this.setFixedRotation();
    this.addCollisions();
    this.init();
  }

  /*
This function inits the wizard. It creates the animations and the update event. Also, we create a timer that will be used to shoot the fireballs.
  */
  init() {
    this.anims.play(this.label, true);
    this.scene.events.on("update", this.update, this);
    this.timer = this.scene.time.addEvent({
      delay: 3000,
      callback: this.directShot,
      callbackScope: this,
      loop: true,
    });
  }

  /*
As we did with the player and the bat, we create this callback to handle the collision with the bubble.
  */
  addCollisions() {
    this.unsubscribeBatCollide = this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: this.onWizardCollide,
      context: this,
    });
  }

  /*
This will be called when the bubble hits the wizard. We "load" the wizard inside the bubble and destroy the wizard.
  */
  onWizardCollide({ gameObjectB }: { gameObjectB: any }) {
    if (gameObjectB instanceof Bubble) {
      gameObjectB.load("wizard");
      this.destroy();
    }
  }

  /*
The wizard will try to shoot directly at the player. It will shoot a fireball and then turn around.
  */
  directShot() {
    this.scene.playAudio("fireball");
    const distance = Phaser.Math.Distance.BetweenPoints(
      this.scene.player,
      this
    );
    this.anims.play("wizardshot", true);
    const fireball = new Fireball(this.scene, this.x, this.y, this.direction);
    this.delayedTurn = this.scene.time.delayedCall(
      1000,
      () => {
        this.turn();
      },
      undefined,
      this
    );
  }

  /*
  This method takes care of turning the wizard around.
  */
  turn() {
    this.direction = -this.direction;
    this.flipX = this.direction > 0;
    this.setFlipX(this.direction > 0);
    this.setVelocityX(this.direction * 5);
  }

  /*
This will be called when the wizard is destroyed. We destroy the timer and the delayed turn before destroying the wizard.
  */
  destroy() {
    if (this.timer) this.timer.destroy();
    if (this.delayedTurn) this.delayedTurn.destroy();
    if (this.fireball) this.fireball.destroy();
    super.destroy();
  }
}

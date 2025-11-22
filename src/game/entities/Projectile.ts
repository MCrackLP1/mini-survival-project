import { Entity } from "./Entity";
import { Vector2 } from "../core/Vector2";
import { Sprite } from "../core/Sprite";
import { Assets } from "../core/Assets";

export class Projectile extends Entity {
  velocity: Vector2;
  damage: number;
  duration: number = 2.0;
  sprite: Sprite;
  hitEnemies: Set<string> = new Set();

  constructor(position: Vector2, velocity: Vector2, damage: number = 10) {
    super(position, 5);
    this.velocity = velocity;
    this.damage = damage;

    this.sprite = new Sprite(Assets.projectile(), 2);
    this.sprite.addAnimation("idle", [{x:0, y:0, w:8, h:8, duration: 100}]);
    this.sprite.play("idle");
  }

  update(dt: number): void {
    const movement = this.velocity.scale(dt);
    this.position = this.position.add(movement);

    this.duration -= dt;
    if (this.duration <= 0) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.sprite.draw(ctx, this.position);
  }
}

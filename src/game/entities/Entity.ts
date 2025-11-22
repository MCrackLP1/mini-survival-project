import { Vector2 } from "../core/Vector2";

export abstract class Entity {
  position: Vector2;
  radius: number;
  markedForDeletion: boolean = false;

  constructor(position: Vector2, radius: number = 10) {
    this.position = position;
    this.radius = radius;
  }

  abstract update(dt: number, ...args: any[]): any;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}

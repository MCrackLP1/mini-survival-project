import { Vector2 } from "./Vector2";

export class Boundary {
  private static instance: Boundary;

  private minX: number = 0;
  private minY: number = 0;
  private maxX: number = 0;
  private maxY: number = 0;
  private padding: number = 30;

  private constructor() {}

  static getInstance(): Boundary {
    if (!Boundary.instance) {
      Boundary.instance = new Boundary();
    }
    return Boundary.instance;
  }

  updateBounds(width: number, height: number, padding: number = 30) {
    this.padding = padding;
    this.minX = padding;
    this.minY = padding;
    this.maxX = width - padding;
    this.maxY = height - padding;
  }

  clampPosition(position: Vector2, radius: number = 0): Vector2 {
    return new Vector2(
      Math.max(this.minX + radius, Math.min(this.maxX - radius, position.x)),
      Math.max(this.minY + radius, Math.min(this.maxY - radius, position.y))
    );
  }

  isInBounds(position: Vector2, radius: number = 0): boolean {
    return position.x >= this.minX + radius &&
           position.x <= this.maxX - radius &&
           position.y >= this.minY + radius &&
           position.y <= this.maxY - radius;
  }

  getBounds() {
    return {
      minX: this.minX,
      minY: this.minY,
      maxX: this.maxX,
      maxY: this.maxY,
      padding: this.padding,
      width: this.maxX - this.minX,
      height: this.maxY - this.minY
    };
  }

  getCenter(): Vector2 {
    return new Vector2(
      (this.minX + this.maxX) / 2,
      (this.minY + this.maxY) / 2
    );
  }
}

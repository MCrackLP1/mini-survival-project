import { Entity } from "../entities/Entity";

export class Collision {
  static check(a: Entity, b: Entity): boolean {
    const dist = a.position.distanceTo(b.position);
    return dist < (a.radius + b.radius);
  }
}

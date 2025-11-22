import { Entity } from "./Entity";
import { Vector2 } from "../core/Vector2";
import { Player } from "./Player";

export const PickupType = {
  XP: "xp",
  GOLD: "gold"
} as const;

export type PickupType = typeof PickupType[keyof typeof PickupType];

export class Pickup extends Entity {
  type: PickupType;
  value: number;
  magnetized: boolean = false;
  magnetSpeed: number = 300;
  bobOffset: number = 0;

  constructor(position: Vector2, type: PickupType, value: number) {
    super(position, 6);
    this.type = type;
    this.value = value;
    this.bobOffset = Math.random() * Math.PI * 2;
  }

  update(dt: number, player: Player): void {
    this.bobOffset += dt * 5;

    const dist = this.position.distanceTo(player.position);
    if (dist < 100) {
        this.magnetized = true;
    }

    if (this.magnetized) {
        const dir = player.position.sub(this.position).normalize();
        this.position = this.position.add(dir.scale(this.magnetSpeed * dt));
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const bobY = Math.sin(this.bobOffset) * 4;
    const drawPos = new Vector2(this.position.x, this.position.y + bobY);
    const pulseScale = 1 + Math.sin(this.bobOffset * 2) * 0.15;

    ctx.save();
    ctx.translate(Math.floor(drawPos.x), Math.floor(drawPos.y));
    ctx.scale(pulseScale, pulseScale);

    if (this.type === PickupType.XP) {
      ctx.shadowColor = "#0af";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#4299e1";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#63b3ed";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.shadowColor = "#fa0";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#ecc94b";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

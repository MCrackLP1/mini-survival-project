import { Entity } from "./Entity";
import { Vector2 } from "../core/Vector2";
import { Player } from "./Player";
import { Sprite } from "../core/Sprite";
import { Assets } from "../core/Assets";
import { GameConfig } from "../core/GameConfig";

export const EnemyType = {
  BASIC: "basic",
  FAST: "fast",
  TANK: "tank",
} as const;

export type EnemyType = typeof EnemyType[keyof typeof EnemyType];

export class Enemy extends Entity {
  id: string;
  speed: number;
  hp: number;
  maxHp: number;
  damage: number;
  target: Player;
  sprite: Sprite;
  type: EnemyType;
  xpValue: number;

  constructor(position: Vector2, type: EnemyType, target: Player, difficultyMultiplier: number = 1.0) {
    super(position, 12);
    this.id = Math.random().toString(36).substr(2, 9);
    this.target = target;
    this.type = type;

    let stats;
    switch(type) {
        case EnemyType.FAST: stats = GameConfig.ENEMIES.FAST; break;
        case EnemyType.TANK: stats = GameConfig.ENEMIES.TANK; break;
        default: stats = GameConfig.ENEMIES.BASIC; break;
    }

    this.maxHp = Math.floor(stats.HP * difficultyMultiplier);
    this.hp = this.maxHp;
    this.speed = stats.SPEED;
    this.damage = Math.floor(stats.DAMAGE * difficultyMultiplier);
    this.radius = stats.RADIUS;
    this.xpValue = stats.XP_VALUE;

    const assetType = type === EnemyType.FAST ? "fast" : "basic";
    this.sprite = new Sprite(Assets.enemy(assetType), 2);
    this.sprite.addAnimation("idle", [{x:0, y:0, w:16, h:16, duration: 100}]);
    this.sprite.play("idle");
  }

  update(dt: number): void {
    this.sprite.update(dt);

    const dir = this.target.position.sub(this.position).normalize();
    const movement = dir.scale(this.speed * dt);
    this.position = this.position.add(movement);
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.markedForDeletion = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.sprite.draw(ctx, this.position);
    
    // Health bar
    if (this.hp < this.maxHp) {
      const barWidth = 30;
      const barHeight = 3;
      const barX = this.position.x - barWidth / 2;
      const barY = this.position.y - this.radius - 8;
      
      ctx.fillStyle = "#000";
      ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
      
      ctx.fillStyle = "#c53030";
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      const hpPercent = this.hp / this.maxHp;
      ctx.fillStyle = "#48bb78";
      ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
    }
  }
}

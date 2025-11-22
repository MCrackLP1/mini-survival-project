import { Entity } from "./Entity";
import { Vector2 } from "../core/Vector2";
import { Input } from "../core/Input";
import { Sprite } from "../core/Sprite";
import { Assets } from "../core/Assets";
import { GameConfig, MathHelpers } from "../core/GameConfig";
import { Boundary } from "../core/Boundary";

export class Player extends Entity {
  private input: Input;
  private sprite: Sprite;

  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  xp: number = 0;
  level: number = 1;
  nextLevelXp: number;
  
  fireRate: number;
  timeSinceLastShot: number = 0;
  projectileSpeed: number;

  constructor(position: Vector2, input: Input) {
    super(position, 12);
    this.input = input;
    
    this.maxHp = GameConfig.PLAYER.BASE_HP;
    this.hp = this.maxHp;
    this.speed = GameConfig.PLAYER.BASE_SPEED;
    this.damage = GameConfig.PLAYER.BASE_DAMAGE;
    this.fireRate = GameConfig.PLAYER.BASE_FIRE_RATE;
    this.projectileSpeed = GameConfig.PLAYER.BASE_PROJECTILE_SPEED;
    this.nextLevelXp = MathHelpers.getXpForLevel(this.level);

    this.sprite = new Sprite(Assets.player(), 2);
    this.sprite.addAnimation("idle", [{x:0, y:0, w:16, h:16, duration: 100}]);
    this.sprite.play("idle");
  }

  update(dt: number): void {
    this.sprite.update(dt);
    
    const axis = this.input.getAxis();
    
    if (axis.x !== 0 || axis.y !== 0) {
      const dir = new Vector2(axis.x, axis.y).normalize();
      const movement = dir.scale(this.speed * dt);
      this.position = this.position.add(movement);
      
      const boundary = Boundary.getInstance();
      this.position = boundary.clampPosition(this.position, this.radius);
    }
    
    this.timeSinceLastShot += dt;
  }

  canShoot(): boolean {
    return this.timeSinceLastShot >= this.fireRate;
  }

  resetShotTimer() {
    this.timeSinceLastShot = 0;
  }

  addXp(amount: number) {
    this.xp += amount;
    while (this.xp >= this.nextLevelXp) {
      this.levelUp();
    }
  }

  private levelUp() {
    this.level++;
    this.nextLevelXp = MathHelpers.getXpForLevel(this.level);
    
    this.maxHp += 10;
    this.hp = Math.min(this.hp + 20, this.maxHp);
    this.damage = Math.floor(this.damage * 1.1);
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
    const barWidth = 40;
    const barHeight = 4;
    const barX = this.position.x - barWidth / 2;
    const barY = this.position.y - this.radius - 10;
    
    ctx.fillStyle = "#000";
    ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
    
    ctx.fillStyle = "#c53030";
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = "#48bb78";
    ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
  }
}

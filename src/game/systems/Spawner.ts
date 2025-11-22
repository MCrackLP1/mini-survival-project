import { Enemy, EnemyType } from "../entities/Enemy";
import { Player } from "../entities/Player";
import { Vector2 } from "../core/Vector2";

export class Spawner {
  private timeSinceLastSpawn: number = 0;
  private screenWidth: number;
  private screenHeight: number;

  constructor(width: number, height: number) {
      this.screenWidth = width;
      this.screenHeight = height;
  }

  update(dt: number, player: Player, enemies: Enemy[], difficultyMultiplier: number) {
      this.timeSinceLastSpawn += dt;

      const targetSpawnRate = Math.max(0.3, 2.0 - (difficultyMultiplier - 1) * 0.3);

      if (this.timeSinceLastSpawn >= targetSpawnRate) {
          this.spawn(player, enemies, difficultyMultiplier);
          this.timeSinceLastSpawn = 0;
      }
  }

  resize(width: number, height: number) {
      this.screenWidth = width;
      this.screenHeight = height;
  }

  private getSpawnPos(): Vector2 {
      const side = Math.floor(Math.random() * 4);

      switch(side) {
          case 0:
             return new Vector2(Math.random() * this.screenWidth, -50);
          case 1:
             return new Vector2(this.screenWidth + 50, Math.random() * this.screenHeight);
          case 2:
             return new Vector2(Math.random() * this.screenWidth, this.screenHeight + 50);
          case 3:
          default:
             return new Vector2(-50, Math.random() * this.screenHeight);
      }
  }

  private spawn(player: Player, enemies: Enemy[], difficulty: number) {
      const pos = this.getSpawnPos();
      
      const rand = Math.random();
      let type: EnemyType = EnemyType.BASIC;
      
      if (difficulty > 1.5) {
          if (rand < 0.3) type = EnemyType.FAST;
          else if (rand < 0.5) type = EnemyType.TANK;
      } else if (difficulty > 1.2) {
          if (rand < 0.2) type = EnemyType.FAST;
      }

      const enemy = new Enemy(pos, type, player, difficulty);
      enemies.push(enemy);
  }
}

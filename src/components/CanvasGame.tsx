import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GameLoop } from "@/game/core/GameLoop";
import { Input } from "@/game/core/Input";
import { Vector2 } from "@/game/core/Vector2";
import { Player } from "@/game/entities/Player";
import { Enemy } from "@/game/entities/Enemy";
import { Projectile } from "@/game/entities/Projectile";
import { Pickup, PickupType } from "@/game/entities/Pickup";
import { Spawner } from "@/game/systems/Spawner";
import { Collision } from "@/game/systems/Collision";
import { Boundary } from "@/game/core/Boundary";
import { MathHelpers } from "@/game/core/GameConfig";

export const CanvasGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const gameRef = useRef<{
    player: Player | null;
    enemies: Enemy[];
    projectiles: Projectile[];
    pickups: Pickup[];
    spawner: Spawner | null;
    gameLoop: GameLoop | null;
    input: Input | null;
    time: number;
  }>({
    player: null,
    enemies: [],
    projectiles: [],
    pickups: [],
    spawner: null,
    gameLoop: null,
    input: null,
    time: 0,
  });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        
        if (gameRef.current.spawner) {
          gameRef.current.spawner.resize(canvas.width, canvas.height);
        }
        
        const boundary = Boundary.getInstance();
        boundary.updateBounds(canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize game
    const input = new Input();
    gameRef.current.input = input;

    const initGame = () => {
      const centerPos = new Vector2(canvas.width / 2, canvas.height / 2);
      gameRef.current.player = new Player(centerPos, input);
      gameRef.current.enemies = [];
      gameRef.current.projectiles = [];
      gameRef.current.pickups = [];
      gameRef.current.spawner = new Spawner(canvas.width, canvas.height);
      gameRef.current.time = 0;
      
      setGameStarted(true);
      toast.success("Game gestartet! WASD zum Bewegen");
    };

    const gameLoop = new GameLoop((dt) => {
      if (!gameRef.current.player || !ctx) return;

      const { player, enemies, projectiles, pickups, spawner } = gameRef.current;
      
      // Update time
      gameRef.current.time += dt;
      const difficulty = MathHelpers.getDifficultyMultiplier(gameRef.current.time);

      // Clear canvas
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update player
      player.update(dt);

      // Auto-shoot at nearest enemy
      if (player.canShoot() && enemies.length > 0) {
        let nearestEnemy = enemies[0];
        let nearestDist = player.position.distanceTo(nearestEnemy.position);
        
        for (const enemy of enemies) {
          const dist = player.position.distanceTo(enemy.position);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestEnemy = enemy;
          }
        }

        const dir = nearestEnemy.position.sub(player.position).normalize();
        const velocity = dir.scale(player.projectileSpeed);
        projectiles.push(new Projectile(player.position.copy(), velocity, player.damage));
        player.resetShotTimer();
      }

      // Update projectiles
      for (const projectile of projectiles) {
        projectile.update(dt);
      }

      // Update enemies
      for (const enemy of enemies) {
        enemy.update(dt);
      }

      // Update pickups
      for (const pickup of pickups) {
        pickup.update(dt, player);
      }

      // Spawn enemies
      if (spawner) {
        spawner.update(dt, player, enemies, difficulty);
      }

      // Check collisions - projectiles vs enemies
      for (const projectile of projectiles) {
        for (const enemy of enemies) {
          if (!enemy.markedForDeletion && !projectile.markedForDeletion && 
              Collision.check(projectile, enemy)) {
            enemy.takeDamage(projectile.damage);
            projectile.markedForDeletion = true;
            
            if (enemy.markedForDeletion) {
              const dropRoll = MathHelpers.rollDrop();
              if (dropRoll) {
                const pickupType = dropRoll === 'gold' ? PickupType.GOLD : PickupType.XP;
                const value = dropRoll === 'gold' ? 15 : 2;
                pickups.push(new Pickup(enemy.position.copy(), pickupType, value));
              }
              
              setScore(s => s + enemy.xpValue * 10);
            }
          }
        }
      }

      // Check collisions - player vs enemies
      for (const enemy of enemies) {
        if (!enemy.markedForDeletion && Collision.check(player, enemy)) {
          player.takeDamage(enemy.damage);
          enemy.takeDamage(999); // Kill enemy on contact
        }
      }

      // Check collisions - player vs pickups
      for (const pickup of pickups) {
        if (!pickup.markedForDeletion && Collision.check(player, pickup)) {
          if (pickup.type === PickupType.XP) {
            player.addXp(pickup.value);
          }
          pickup.markedForDeletion = true;
        }
      }

      // Remove dead entities
      gameRef.current.enemies = enemies.filter(e => !e.markedForDeletion);
      gameRef.current.projectiles = projectiles.filter(p => !p.markedForDeletion);
      gameRef.current.pickups = pickups.filter(p => !p.markedForDeletion);

      // Draw everything
      for (const pickup of pickups) {
        pickup.draw(ctx);
      }
      
      for (const projectile of projectiles) {
        projectile.draw(ctx);
      }
      
      for (const enemy of enemies) {
        enemy.draw(ctx);
      }
      
      player.draw(ctx);

      // Draw HUD
      drawHUD(ctx, canvas.width, canvas.height, player, gameRef.current.time);

      // Check game over
      if (player.markedForDeletion) {
        gameLoop.stop();
        setGameStarted(false);
        toast.error(`Game Over! Score: ${score}`);
      }
    });

    gameRef.current.gameLoop = gameLoop;

    // Show start screen
    const drawStartScreen = () => {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#ecc94b";
      ctx.font = "64px 'VT323', monospace";
      ctx.textAlign = "center";
      ctx.fillText("MINI SURVIVOR", canvas.width / 2, canvas.height / 2 - 50);
      
      ctx.fillStyle = "#a0aec0";
      ctx.font = "32px 'VT323', monospace";
      ctx.fillText("Press SPACE to Start", canvas.width / 2, canvas.height / 2 + 30);
      
      ctx.font = "20px 'VT323', monospace";
      ctx.fillText("WASD or Arrows to move", canvas.width / 2, canvas.height / 2 + 80);
      ctx.fillText("Auto-fire at enemies", canvas.width / 2, canvas.height / 2 + 110);
    };

    drawStartScreen();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !gameStarted) {
        initGame();
        gameLoop.start();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      gameLoop.stop();
    };
  }, [gameStarted, score]);

  const drawHUD = (ctx: CanvasRenderingContext2D, width: number, height: number, player: Player, time: number) => {
    ctx.font = "24px 'VT323', monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    
    ctx.fillText(`Level: ${player.level}`, 20, 30);
    ctx.fillText(`XP: ${player.xp}/${player.nextLevelXp}`, 20, 60);
    ctx.fillText(`Score: ${score}`, 20, 90);
    ctx.fillText(`Time: ${Math.floor(time)}s`, 20, 120);
    
    ctx.shadowBlur = 0;
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      style={{ 
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)" 
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};

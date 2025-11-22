import { Vector2 } from "./Vector2";

export interface AnimationFrame {
  x: number;
  y: number;
  w: number;
  h: number;
  duration: number;
}

export interface AnimationState {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
}

export class Sprite {
  image: HTMLCanvasElement | HTMLImageElement;
  scale: number;

  private animations: Map<string, AnimationState> = new Map();
  private currentAnim: string | null = null;
  private currentFrameIndex: number = 0;
  private frameTimer: number = 0;
  private flipped: boolean = false;

  constructor(image: HTMLCanvasElement | HTMLImageElement, scale: number = 1) {
    this.image = image;
    this.scale = scale;
  }

  addAnimation(name: string, frames: AnimationFrame[], loop: boolean = true) {
    this.animations.set(name, { name, frames, loop });
  }

  play(name: string) {
    if (this.currentAnim === name) return;
    if (this.animations.has(name)) {
        this.currentAnim = name;
        this.currentFrameIndex = 0;
        this.frameTimer = 0;
    }
  }

  setFlipped(flipped: boolean) {
      this.flipped = flipped;
  }

  update(dt: number) {
    if (!this.currentAnim) return;

    const anim = this.animations.get(this.currentAnim)!;
    const frame = anim.frames[this.currentFrameIndex];

    this.frameTimer += dt * 1000;
    if (this.frameTimer >= frame.duration) {
        this.frameTimer -= frame.duration;
        this.currentFrameIndex++;

        if (this.currentFrameIndex >= anim.frames.length) {
            if (anim.loop) {
                this.currentFrameIndex = 0;
            } else {
                this.currentFrameIndex = anim.frames.length - 1;
            }
        }
    }
  }

  draw(ctx: CanvasRenderingContext2D, position: Vector2) {
    if (!this.currentAnim) return;

    const anim = this.animations.get(this.currentAnim)!;
    const frame = anim.frames[this.currentFrameIndex];

    const drawW = frame.w * this.scale;
    const drawH = frame.h * this.scale;

    ctx.save();
    ctx.translate(Math.floor(position.x), Math.floor(position.y));
    
    if (this.flipped) {
        ctx.scale(-1, 1);
    }

    ctx.drawImage(
        this.image,
        frame.x, frame.y, frame.w, frame.h,
        -drawW / 2, -drawH / 2, drawW, drawH
    );

    ctx.restore();
  }
}

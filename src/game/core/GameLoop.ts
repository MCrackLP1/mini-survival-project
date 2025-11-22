export class GameLoop {
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private callback: (dt: number) => void;

  constructor(callback: (dt: number) => void) {
    this.callback = callback;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.isRunning = false;
  }

  private loop(currentTime: number) {
    if (!this.isRunning) return;

    const dt = (currentTime - this.lastTime) / 1000; // Delta time in seconds
    this.lastTime = currentTime;

    this.callback(dt);

    requestAnimationFrame(this.loop.bind(this));
  }
}

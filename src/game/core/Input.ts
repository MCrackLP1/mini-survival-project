export class Input {
  private keys: Set<string> = new Set();
  private justPressed: Set<string> = new Set();

  constructor() {
    window.addEventListener("keydown", (e) => {
      if (!this.keys.has(e.code)) {
        this.justPressed.add(e.code);
      }
      this.keys.add(e.code);

      // Also track by key for abilities
      if (!this.keys.has(e.key)) {
        this.justPressed.add(e.key);
      }
      this.keys.add(e.key);
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.code);
      this.keys.delete(e.key);
    });
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }

  wasKeyJustPressed(key: string): boolean {
    return this.justPressed.has(key);
  }

  clearJustPressed() {
    this.justPressed.clear();
  }

  getAxis(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (this.isKeyDown("KeyW") || this.isKeyDown("ArrowUp")) y -= 1;
    if (this.isKeyDown("KeyS") || this.isKeyDown("ArrowDown")) y += 1;
    if (this.isKeyDown("KeyA") || this.isKeyDown("ArrowLeft")) x -= 1;
    if (this.isKeyDown("KeyD") || this.isKeyDown("ArrowRight")) x += 1;

    return { x, y };
  }
}

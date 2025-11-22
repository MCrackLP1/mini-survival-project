import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const CanvasGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to fill container
    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Placeholder - your game will be initialized here
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ecc94b";
    ctx.font = "48px 'VT323', monospace";
    ctx.textAlign = "center";
    ctx.fillText("MINI SURVIVOR", canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.fillStyle = "#a0aec0";
    ctx.font = "24px 'VT323', monospace";
    ctx.fillText("Game wird geladen...", canvas.width / 2, canvas.height / 2 + 20);

    toast.success("Canvas initialisiert!");

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

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

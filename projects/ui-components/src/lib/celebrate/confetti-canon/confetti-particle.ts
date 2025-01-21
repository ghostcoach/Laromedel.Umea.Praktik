export interface IConfettiParticle {
  color: {
    front: string;
    back: string;
  };
  dimensions: {
    x: number;
    y: number;
  };
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  scale: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
}

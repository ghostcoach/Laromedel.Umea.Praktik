import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-confetti-canon',
  templateUrl: './confetti-canvas.component.html',
  styleUrls: ['./confetti-canvas.component.css'],
  standalone: true,
})
export class ConfettiCanonComponent implements AfterViewInit {
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private confetti: any[] = [];
  private colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' },
  ];

  private gravity = 0.7;
  private terminalVelocity = 3;
  private drag = 0.075;
  private readonly NUMBER_OF_ROUNDS: number = 4;
  private roundCounter: number = 0;

  constructor() {}

  ngAfterViewInit() {
    this.initCanvas();
    this.initConfetti();
    this.render();
  }

  private initCanvas() {
    const canvas = this.confettiCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  @HostListener('document:click')
  onClick() {
    this.initConfetti();
  }

  private initConfetti() {
    this.roundCounter++;
    const confettiCount = 300;
    for (let i = 0; i < confettiCount; i++) {
      this.confetti.push({
        color: this.colors[Math.floor(this.randomRange(0, this.colors.length))],
        dimensions: {
          x: this.randomRange(10, 20),
          y: this.randomRange(10, 30),
        },
        position: {
          x: this.randomRange(0, this.ctx.canvas.width),
          y: this.ctx.canvas.height - 1,
        },
        rotation: this.randomRange(0, 2 * Math.PI),
        scale: {
          x: 1,
          y: 1,
        },
        velocity: {
          x: this.randomRange(-25, 25),
          y: this.randomRange(0, -50),
        },
      });
    }
  }

  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private resizeCanvas() {
    const canvas = this.confettiCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.confetti.forEach((confetto, index) => {
      let width = confetto.dimensions.x * confetto.scale.x;
      let height = confetto.dimensions.y * confetto.scale.y;

      // Move canvas to position and rotate
      this.ctx.translate(confetto.position.x, confetto.position.y);
      this.ctx.rotate(confetto.rotation);

      // Apply forces to velocity
      confetto.velocity.x -= confetto.velocity.x * this.drag;
      confetto.velocity.y = Math.min(
        confetto.velocity.y + this.gravity,
        this.terminalVelocity
      );
      confetto.velocity.x +=
        Math.random() > 0.5 ? Math.random() : -Math.random();

      // Set position
      confetto.position.x += confetto.velocity.x;
      confetto.position.y += confetto.velocity.y;

      // Delete confetti when out of frame
      if (confetto.position.y >= this.ctx.canvas.height)
        this.confetti.splice(index, 1);

      // Loop confetto x position
      if (confetto.position.x > this.ctx.canvas.width) confetto.position.x = 0;
      if (confetto.position.x < 0) confetto.position.x = this.ctx.canvas.width;

      // Spin confetto by scaling y
      confetto.scale.y = Math.cos(confetto.position.y * 0.1);
      this.ctx.fillStyle =
        confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

      // Draw confetti
      this.ctx.fillRect(-width / 2, -height / 2, width, height);

      // Reset transform matrix
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    // Fire off another round of confetti
    if (
      this.confetti.length <= 10 &&
      this.roundCounter < this.NUMBER_OF_ROUNDS
    ) {
      this.initConfetti();
    } else {
    }

    window.requestAnimationFrame(() => this.render());
  }
}

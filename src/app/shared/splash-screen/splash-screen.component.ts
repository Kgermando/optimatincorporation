import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  @Output() splashDone = new EventEmitter<void>();

  progress = 0;
  isHiding = false;
  letters = 'OPTIMAT INCORPORATION'.split('');
  particles: { x: number; y: number; size: number; delay: number; duration: number; color: string }[] = [];

  private timer: ReturnType<typeof setTimeout> | null = null;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.generateParticles();

    // Animate progress bar
    this.progressInterval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += Math.random() * 4 + 1;
        if (this.progress > 100) this.progress = 100;
        this.cdr.markForCheck();
      } else {
        if (this.progressInterval) clearInterval(this.progressInterval);
      }
    }, 60);

    // Start fade-out after 3.2s
    this.timer = setTimeout(() => {
      this.isHiding = true;
      this.cdr.markForCheck();
      setTimeout(() => this.splashDone.emit(), 900);
    }, 3200);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.progressInterval) clearInterval(this.progressInterval);
  }

  private generateParticles(): void {
    const colors = ['#00b4ff', '#ff3d9a', '#ffd700', '#00b4ff', '#00b4ff'];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  get progressWidth(): string {
    return `${this.progress}%`;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioFiles = [
    '/assets/audio/try-again/try-again_1.mp3',
    '/assets/audio/try-again/try-again_2.mp3',
    '/assets/audio/try-again/try-again_3.mp3'
  ];
  audio: HTMLAudioElement | null = null;
  audioIndex = 0; // Keep track of which audio to play next

  playIncorrectAudio(): void {
    // Get the current audio file
    this.audio = new Audio(this.audioFiles[this.audioIndex]); 
    
    // Play the audio
    this.audio.play();

    // Move to the next file, looping back to the start
    this.audioIndex = (this.audioIndex + 1) % this.audioFiles.length;
  }

}

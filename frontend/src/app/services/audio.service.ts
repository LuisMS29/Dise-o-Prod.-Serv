import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  reproducirMensaje(mensaje: string): void {
    if (!this.synth) {
      console.warn('SpeechSynthesis no disponible');
      return;
    }

    // Cancelar cualquier reproduccion anterior
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-PE';
    utterance.rate = 0.9; // Ligeramente mas lento para agricultores
    utterance.pitch = 1;
    utterance.volume = 1;

    this.synth.speak(utterance);
  }

  detener(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  estaDisponible(): boolean {
    return 'speechSynthesis' in window;
  }
}

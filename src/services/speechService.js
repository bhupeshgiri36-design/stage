/**
 * Web Speech API Anchor Voice Synthesizer
 * Synchronizes character mouth animations & captions with voice output
 */

class SpeechService {
  constructor() {
    this.isEnabled = true;
    this.currentUtterance = null;
  }

  speak(text, onStart, onEnd) {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window) || !this.isEnabled) {
      if (onStart) onStart();
      // Estimate duration based on word count
      const words = text.split(' ').length;
      const durationMs = Math.max(1600, words * 280);
      setTimeout(() => {
        if (onEnd) onEnd();
      }, durationMs);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.08;

      // Select an expressive voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.includes('en') || v.lang.includes('hi')) && 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Alex'))
      ) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 2000);
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  toggleSpeech() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }

  getEnabled() {
    return this.isEnabled;
  }
}

export const speechService = new SpeechService();

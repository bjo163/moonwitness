import { Howl, Howler } from 'howler';
import { EventBus } from '../core/EventBus';

export class AudioManager {
  private static bgm: Howl | null = null;
  private static sfxMap: Map<string, Howl> = new Map();
  private static masterVolume: number = 1.0;

  static initialize() {
    // Listen for cross-boundary audio requests
    EventBus.on('audio:play_sfx', (key: string) => this.playSFX(key));
    EventBus.on('audio:play_bgm', (key: string) => this.playBGM(key));
    EventBus.on('audio:set_volume', (vol: number) => this.setVolume(vol));
  }

  static loadSFX(key: string, src: string) {
    if (!this.sfxMap.has(key)) {
      this.sfxMap.set(key, new Howl({ src: [src] }));
    }
  }

  static playSFX(key: string, volume: number = 1.0) {
    const sfx = this.sfxMap.get(key);
    if (sfx) {
      sfx.volume(volume * this.masterVolume);
      sfx.play();
    } else {
      console.warn(`SFX ${key} not loaded.`);
    }
  }

  static playBGM(src: string, volume: number = 0.5) {
    if (this.bgm) {
      this.bgm.stop();
    }
    this.bgm = new Howl({
      src: [src],
      loop: true,
      volume: volume * this.masterVolume
    });
    this.bgm.play();
  }

  static stopBGM() {
    if (this.bgm) {
      this.bgm.stop();
    }
  }

  static setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }
}

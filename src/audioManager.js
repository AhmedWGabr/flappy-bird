import { Settings } from './settings.js';

export class AudioManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    loadSounds() {
        Object.entries(Settings.AUDIO_PATHS).forEach(([key, path]) => {
            this.sounds[key] = new Audio(path);
        });
    }

    play(soundKey) {
        const sound = this.sounds[soundKey];
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    stop(soundKey) {
        const sound = this.sounds[soundKey];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}
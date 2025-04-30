export class Settings {
    static CANVAS_WIDTH = 480;  // Maintaining 16:9 aspect ratio for 720p
    static CANVAS_HEIGHT = 720;
    // Scale factor compared to original size
    static SCALE = 720 / 480; // = 1.5
    
    // Scale all measurements
    static BIRD_WIDTH = 34 * 1.5;
    static BIRD_HEIGHT = 24 * 1.5;
    static BIRD_INITIAL_X = 75;
    static BIRD_INITIAL_Y = 360;
    static GRAVITY = 0.35 * 1.5;
    static JUMP_STRENGTH = -6 * 1.5;
    static PIPE_WIDTH = 52 * 1.5;
    static INITIAL_PIPE_GAP = 175 * 1.5;  // Starting gap is wider
    static MIN_PIPE_GAP = 125 * 1.5;      // Minimum gap size (current default)
    static INITIAL_PIPE_SPACING = 300;     // Initial distance between pipes
    static MIN_PIPE_SPACING = 200;         // Minimum distance between pipes
    static GAP_DECREASE_RATE = 2;          // How much to decrease gap per score
    static SPACING_DECREASE_RATE = 3;      // How much to decrease spacing per score
    static BASE_HEIGHT = 60 * 1.5;
    static INITIAL_SPEED = 2 * 1.5;
    static SPEED_INCREASE = 0.02 * 1.5;
    static BIRD_ANIMATION_SPEED = 0.2;
    static BIRD_DEATH_ROTATION_SPEED = 0.08;
    static FPS = 60;
    
    static BIRD_COLORS = {
        YELLOW: {
            downflap: '../assets/sprites/yellowbird-downflap.png',
            midflap: '../assets/sprites/yellowbird-midflap.png',
            upflap: '../assets/sprites/yellowbird-upflap.png'
        },
        BLUE: {
            downflap: '../assets/sprites/bluebird-downflap.png',
            midflap: '../assets/sprites/bluebird-midflap.png',
            upflap: '../assets/sprites/bluebird-upflap.png'
        },
        RED: {
            downflap: '../assets/sprites/redbird-downflap.png',
            midflap: '../assets/sprites/redbird-midflap.png',
            upflap: '../assets/sprites/redbird-upflap.png'
        }
    };

    static DAY_NIGHT_CYCLE_DURATION = 30000; // 30 seconds for one full cycle
    static DAY_DURATION = 15000; // 15 seconds of daytime
    static NIGHT_DURATION = 15000; // 15 seconds of nighttime
    static TRANSITION_DURATION = 2000; // 2 seconds fade transition

    static SPRITE_PATHS = {
        BACKGROUND_DAY: '../assets/sprites/background-day.png',
        BACKGROUND_NIGHT: '../assets/sprites/background-night.png',
        BASE: '../assets/sprites/base.png',
        PIPE_GREEN: '../assets/sprites/pipe-green.png',
        PIPE_RED: '../assets/sprites/pipe-red.png',
        GAME_OVER: '../assets/sprites/gameover.png',
        MESSAGE: '../assets/sprites/message.png'
    };

    static AUDIO_PATHS = {
        DIE: '../assets/audio/die.wav',
        HIT: '../assets/audio/hit.wav',
        POINT: '../assets/audio/point.wav',
        SWOOSH: '../assets/audio/swoosh.wav',
        WING: '../assets/audio/wing.wav'
    };

    static DIGITS = Array.from({length: 10}, (_, i) => `../assets/sprites/${i}.png`);
}
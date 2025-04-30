import { Settings } from './settings.js';

export class SpriteManager {
    constructor() {
        this.sprites = {
            bird: {},
            backgroundDay: new Image(),
            backgroundNight: new Image(),
            base: new Image(),
            pipeTopGreen: new Image(),
            pipeBottomGreen: new Image(),
            pipeTopRed: new Image(),
            pipeBottomRed: new Image(),
            gameOver: new Image(),
            message: new Image(),
            digits: []
        };
        this.currentBirdColor = 'YELLOW';
        this.isNightTime = false;
        this.transitionAlpha = 0;
    }

    async loadSprites() {
        // Load static sprites
        this.sprites.backgroundDay.src = Settings.SPRITE_PATHS.BACKGROUND_DAY;
        this.sprites.backgroundNight.src = Settings.SPRITE_PATHS.BACKGROUND_NIGHT;
        this.sprites.base.src = Settings.SPRITE_PATHS.BASE;
        this.sprites.pipeTopGreen.src = Settings.SPRITE_PATHS.PIPE_GREEN;
        this.sprites.pipeBottomGreen.src = Settings.SPRITE_PATHS.PIPE_GREEN;
        this.sprites.pipeTopRed.src = Settings.SPRITE_PATHS.PIPE_RED;
        this.sprites.pipeBottomRed.src = Settings.SPRITE_PATHS.PIPE_RED;
        this.sprites.gameOver.src = Settings.SPRITE_PATHS.GAME_OVER;
        this.sprites.message.src = Settings.SPRITE_PATHS.MESSAGE;

        // Load bird sprites
        await this.setBirdColor(this.currentBirdColor);

        // Load digit sprites
        this.sprites.digits = Settings.DIGITS.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });

        // Wait for all sprites to load
        const allSprites = [
            ...Object.values(this.sprites.bird),
            this.sprites.backgroundDay,
            this.sprites.backgroundNight,
            this.sprites.base,
            this.sprites.pipeTopGreen,
            this.sprites.pipeBottomGreen,
            this.sprites.pipeTopRed,
            this.sprites.pipeBottomRed,
            this.sprites.gameOver,
            this.sprites.message,
            ...this.sprites.digits
        ];

        return Promise.all(allSprites.map(sprite => 
            new Promise(resolve => {
                if (sprite.complete) {
                    resolve();
                } else {
                    sprite.onload = resolve;
                }
            })
        ));
    }

    async setBirdColor(color) {
        if (!Settings.BIRD_COLORS[color]) return;
        
        this.currentBirdColor = color;
        this.sprites.bird = {
            downflap: new Image(),
            midflap: new Image(),
            upflap: new Image()
        };

        const birdSprites = Settings.BIRD_COLORS[color];
        this.sprites.bird.downflap.src = birdSprites.downflap;
        this.sprites.bird.midflap.src = birdSprites.midflap;
        this.sprites.bird.upflap.src = birdSprites.upflap;

        // Wait for bird sprites to load
        return Promise.all(Object.values(this.sprites.bird).map(sprite => 
            new Promise(resolve => {
                if (sprite.complete) {
                    resolve();
                } else {
                    sprite.onload = resolve;
                }
            })
        ));
    }

    getBirdSprite(frame) {
        const sprites = [
            this.sprites.bird.downflap,
            this.sprites.bird.midflap,
            this.sprites.bird.upflap
        ];
        return sprites[frame % sprites.length];
    }

    drawScore(ctx, score) {
        const scoreStr = score.toString();
        const digitWidth = 24;
        const spacing = 2;
        const totalWidth = scoreStr.length * (digitWidth + spacing) - spacing;
        let x = (ctx.canvas.width - totalWidth) / 2;

        for (const digit of scoreStr) {
            const digitSprite = this.sprites.digits[parseInt(digit)];
            if (digitSprite) {
                ctx.drawImage(digitSprite, x, 20, digitWidth, 36);
                x += digitWidth + spacing;
            }
        }
    }

    drawBackground(ctx, cycleTime) {
        // Calculate transition alpha based on cycle time
        const halfCycle = Settings.DAY_NIGHT_CYCLE_DURATION / 2;
        const transitionStart = this.isNightTime ? 0 : halfCycle;
        const timeSinceTransition = (cycleTime - transitionStart) % Settings.DAY_NIGHT_CYCLE_DURATION;
        
        if (timeSinceTransition < Settings.TRANSITION_DURATION) {
            // During transition
            this.transitionAlpha = this.isNightTime ? 
                (timeSinceTransition / Settings.TRANSITION_DURATION) :
                1 - (timeSinceTransition / Settings.TRANSITION_DURATION);
        } else if (timeSinceTransition >= halfCycle && 
                   timeSinceTransition < halfCycle + Settings.TRANSITION_DURATION) {
            // During opposite transition
            const transitionTime = timeSinceTransition - halfCycle;
            this.transitionAlpha = this.isNightTime ? 
                1 - (transitionTime / Settings.TRANSITION_DURATION) :
                (transitionTime / Settings.TRANSITION_DURATION);
            
            if (transitionTime >= Settings.TRANSITION_DURATION) {
                this.isNightTime = !this.isNightTime;
            }
        }

        // Draw day background
        ctx.globalAlpha = 1;
        ctx.drawImage(this.sprites.backgroundDay, 0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw night background with transition alpha
        ctx.globalAlpha = this.transitionAlpha;
        ctx.drawImage(this.sprites.backgroundNight, 0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Reset alpha for other sprites
        ctx.globalAlpha = 1;
    }

    getPipeSprites() {
        return {
            top: this.isNightTime ? this.sprites.pipeTopRed : this.sprites.pipeTopGreen,
            bottom: this.isNightTime ? this.sprites.pipeBottomRed : this.sprites.pipeBottomGreen
        };
    }
}
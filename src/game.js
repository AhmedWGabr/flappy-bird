import { Settings } from './settings.js';
import { AudioManager } from './audioManager.js';
import { SpriteManager } from './spriteManager.js';
import { GameStateManager, GameState } from './gameState.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = Settings.CANVAS_WIDTH;
        this.canvas.height = Settings.CANVAS_HEIGHT;

        this.spriteManager = new SpriteManager();
        this.audioManager = new AudioManager();
        this.gameStateManager = new GameStateManager(this.spriteManager);

        this.bird = {
            x: Settings.BIRD_INITIAL_X,
            y: Settings.BIRD_INITIAL_Y,
            velocity: 0,
            frame: 0,
            animationCounter: 0,
            rotation: 0,
            deathRotation: 0,
            fallSpeed: 0
        };

        this.pipes = [];
        this.score = 0;
        this.groundX = 0;
        this.currentSpeed = Settings.INITIAL_SPEED;
        this.currentPipeGap = Settings.INITIAL_PIPE_GAP;
        this.currentPipeSpacing = Settings.INITIAL_PIPE_SPACING;
        this.cycleStartTime = Date.now();
        this.lastTime = 0;
        this.deltaTime = 0;
        this.frameInterval = 1000 / Settings.FPS;
        this.accumulator = 0;
        
        this.setupEventListeners();
        this.init();
    }

    async init() {
        await this.spriteManager.loadSprites();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.gameStateManager.isMenu()) {
                    this.startGame();
                } else if (this.gameStateManager.isPlaying()) {
                    this.jump();
                } else if (this.gameStateManager.isGameOver()) {
                    this.startGame(); // Changed from resetGame to startGame to properly restart
                }
            }
        });

        this.canvas.addEventListener('click', async () => {
            if (this.gameStateManager.isMenu()) {
                await this.gameStateManager.cycleBirdColor();
            } else if (this.gameStateManager.isPlaying()) {
                this.jump();
            } else if (this.gameStateManager.isGameOver()) {
                this.gameStateManager.returnToMenu();
            }
        });
    }

    startGame() {
        this.resetGame();
        this.gameStateManager.startGame();
        this.bird.velocity = Settings.GRAVITY * 2;
        this.audioManager.play('SWOOSH');
    }

    resetGame() {
        this.bird.y = Settings.BIRD_INITIAL_Y;
        this.bird.velocity = 0;
        this.bird.frame = 0;
        this.bird.animationCounter = 0;
        this.bird.rotation = 0;
        this.bird.deathRotation = 0;
        this.bird.fallSpeed = 0;
        this.pipes = [];
        this.score = 0;
        this.groundX = 0;
        this.currentSpeed = Settings.INITIAL_SPEED;
        this.currentPipeGap = Settings.INITIAL_PIPE_GAP;
        this.currentPipeSpacing = Settings.INITIAL_PIPE_SPACING;
        this.createPipe();
    }

    jump() {
        if (this.gameStateManager.isPlaying()) {
            this.bird.velocity = Settings.JUMP_STRENGTH;
            this.audioManager.play('WING');
        }
    }

    createPipe() {
        const gapStart = Math.random() * (this.canvas.height - this.currentPipeGap - Settings.BASE_HEIGHT - 100) + 50;
        this.pipes.push({
            x: this.canvas.width,
            gapStart: gapStart,
            passed: false,
            gapSize: this.currentPipeGap
        });
    }

    checkCollision(pipe) {
        const birdRight = this.bird.x + Settings.BIRD_WIDTH * 0.8;
        const birdLeft = this.bird.x + Settings.BIRD_WIDTH * 0.2;
        const birdTop = this.bird.y + Settings.BIRD_HEIGHT * 0.2;
        const birdBottom = this.bird.y + Settings.BIRD_HEIGHT * 0.8;
        
        if (birdRight > pipe.x && birdLeft < pipe.x + Settings.PIPE_WIDTH) {
            if (birdTop < pipe.gapStart || birdBottom > pipe.gapStart + pipe.gapSize) {
                return true;
            }
        }
        return false;
    }

    gameLoop(timestamp = 0) {
        // Calculate delta time
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Update with fixed time step for consistent physics
        this.accumulator += this.deltaTime;
        while (this.accumulator >= this.frameInterval) {
            this.update(this.frameInterval / 1000); // Convert to seconds
            this.accumulator -= this.frameInterval;
        }

        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(dt) {
        // Always update bird animation
        this.bird.animationCounter += Settings.BIRD_ANIMATION_SPEED;
        this.bird.frame = Math.floor(this.bird.animationCounter) % 3;

        if (this.gameStateManager.isMenu()) {
            this.bird.y = Settings.BIRD_INITIAL_Y + Math.sin(Date.now() / 200) * 8;
            return;
        }

        if (this.gameStateManager.isPlaying()) {
            // Physics updates using delta time
            this.bird.velocity += Settings.GRAVITY * dt * 60;
            this.bird.y += this.bird.velocity * dt * 60;
            this.bird.rotation = Math.min(Math.max(this.bird.velocity * 0.2, -0.5), 0.5);

            // Ground movement
            this.groundX = (this.groundX - this.currentSpeed * dt * 60) % 48;

            // Pipe updates
            if (this.pipes.length === 0 || 
                this.pipes[this.pipes.length - 1].x < this.canvas.width - this.currentPipeSpacing) {
                this.createPipe();
            }

            for (let i = this.pipes.length - 1; i >= 0; i--) {
                this.pipes[i].x -= this.currentSpeed * dt * 60;

                if (this.checkCollision(this.pipes[i])) {
                    this.handleGameOver();
                    break;
                }

                if (!this.pipes[i].passed && this.pipes[i].x + Settings.PIPE_WIDTH < this.bird.x) {
                    this.pipes[i].passed = true;
                    this.score++;
                    
                    // Update difficulty based on score
                    this.currentSpeed = Settings.INITIAL_SPEED + (this.score * Settings.SPEED_INCREASE);
                    
                    // Decrease gap size but don't go below minimum
                    this.currentPipeGap = Math.max(
                        Settings.MIN_PIPE_GAP,
                        Settings.INITIAL_PIPE_GAP - (this.score * Settings.GAP_DECREASE_RATE)
                    );
                    
                    // Decrease pipe spacing but don't go below minimum
                    this.currentPipeSpacing = Math.max(
                        Settings.MIN_PIPE_SPACING,
                        Settings.INITIAL_PIPE_SPACING - (this.score * Settings.SPACING_DECREASE_RATE)
                    );
                    
                    this.audioManager.play('POINT');
                }

                if (this.pipes[i].x + Settings.PIPE_WIDTH < 0) {
                    this.pipes.splice(i, 1);
                }
            }

            // Boundary checks
            if (this.bird.y < 0) {
                this.bird.y = 0;
                this.bird.velocity = 0;
            }
            if (this.bird.y + Settings.BIRD_HEIGHT > this.canvas.height - Settings.BASE_HEIGHT) {
                this.handleGameOver();
            }
        } else if (this.gameStateManager.isGameOver()) {
            this.bird.fallSpeed += Settings.GRAVITY * dt * 60;
            this.bird.y += this.bird.fallSpeed * dt * 60;
            this.bird.deathRotation = Math.min(this.bird.deathRotation + Settings.BIRD_DEATH_ROTATION_SPEED, Math.PI/2);
            
            if (this.bird.y + Settings.BIRD_HEIGHT > this.canvas.height - Settings.BASE_HEIGHT) {
                this.bird.y = this.canvas.height - Settings.BASE_HEIGHT - Settings.BIRD_HEIGHT;
            }
        }
    }

    handleGameOver() {
        this.gameStateManager.endGame();
        this.bird.fallSpeed = this.bird.velocity;
        this.audioManager.play('HIT');
        setTimeout(() => this.audioManager.play('DIE'), 500);
    }

    draw() {
        const currentTime = Date.now() - this.cycleStartTime;
        
        // Draw background with day/night cycle
        this.spriteManager.drawBackground(this.ctx, currentTime);

        // Draw pipes
        this.pipes.forEach(pipe => {
            // Draw pipes with day/night transition
            // Day pipes (green)
            this.ctx.save();
            this.ctx.globalAlpha = 1 - this.spriteManager.transitionAlpha;
            
            // Top green pipe
            this.ctx.save();
            this.ctx.translate(pipe.x, pipe.gapStart);
            this.ctx.scale(1, -1);
            this.ctx.drawImage(this.spriteManager.sprites.pipeTopGreen, 0, 0, Settings.PIPE_WIDTH, pipe.gapStart);
            this.ctx.restore();

            // Bottom green pipe
            this.ctx.drawImage(
                this.spriteManager.sprites.pipeBottomGreen,
                pipe.x,
                pipe.gapStart + pipe.gapSize,
                Settings.PIPE_WIDTH,
                this.canvas.height - (pipe.gapStart + pipe.gapSize)
            );
            this.ctx.restore();

            // Night pipes (red)
            this.ctx.save();
            this.ctx.globalAlpha = this.spriteManager.transitionAlpha;
            
            // Top red pipe
            this.ctx.save();
            this.ctx.translate(pipe.x, pipe.gapStart);
            this.ctx.scale(1, -1);
            this.ctx.drawImage(this.spriteManager.sprites.pipeTopRed, 0, 0, Settings.PIPE_WIDTH, pipe.gapStart);
            this.ctx.restore();

            // Bottom red pipe
            this.ctx.drawImage(
                this.spriteManager.sprites.pipeBottomRed,
                pipe.x,
                pipe.gapStart + pipe.gapSize,
                Settings.PIPE_WIDTH,
                this.canvas.height - (pipe.gapStart + pipe.gapSize)
            );
            this.ctx.restore();
        });

        // Reset alpha for remaining sprites
        this.ctx.globalAlpha = 1;

        // Draw ground (scrolling) - ensure it's always at the bottom
        const groundY = this.canvas.height - Settings.BASE_HEIGHT;
        this.ctx.drawImage(this.spriteManager.sprites.base, this.groundX, groundY);
        this.ctx.drawImage(
            this.spriteManager.sprites.base, 
            this.groundX + this.spriteManager.sprites.base.width, 
            groundY
        );

        // Draw bird with rotation
        this.ctx.save();
        this.ctx.translate(this.bird.x + Settings.BIRD_WIDTH/2, this.bird.y + Settings.BIRD_HEIGHT/2);
        this.ctx.rotate(this.gameStateManager.isGameOver() ? this.bird.deathRotation : this.bird.rotation);
        this.ctx.drawImage(
            this.spriteManager.getBirdSprite(this.bird.frame),
            -Settings.BIRD_WIDTH/2,
            -Settings.BIRD_HEIGHT/2,
            Settings.BIRD_WIDTH,
            Settings.BIRD_HEIGHT
        );
        this.ctx.restore();

        // Draw score
        if (this.gameStateManager.isPlaying() || this.gameStateManager.isGameOver()) {
            this.spriteManager.drawScore(this.ctx, this.score);
        }

        // Draw menu or game over screen
        this.gameStateManager.drawMenu(this.ctx);
        this.gameStateManager.drawGameOver(this.ctx, this.score);
    }
}

// Start the game when the window loads
window.addEventListener('load', () => {
    new Game();
});
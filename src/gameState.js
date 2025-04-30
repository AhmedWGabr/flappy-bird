export const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

export class GameStateManager {
    constructor(spriteManager) {
        this.state = GameState.MENU;
        this.spriteManager = spriteManager;
        this.selectedBirdColor = 'YELLOW';
        this.birdColorOptions = ['YELLOW', 'RED', 'BLUE'];
        this.currentColorIndex = 0;
    }

    isMenu() {
        return this.state === GameState.MENU;
    }

    isPlaying() {
        return this.state === GameState.PLAYING;
    }

    isGameOver() {
        return this.state === GameState.GAME_OVER;
    }

    startGame() {
        this.state = GameState.PLAYING;
    }

    endGame() {
        this.state = GameState.GAME_OVER;
    }

    returnToMenu() {
        this.state = GameState.MENU;
    }

    async cycleBirdColor() {
        this.currentColorIndex = (this.currentColorIndex + 1) % this.birdColorOptions.length;
        this.selectedBirdColor = this.birdColorOptions[this.currentColorIndex];
        await this.spriteManager.setBirdColor(this.selectedBirdColor);
    }

    drawMenu(ctx) {
        if (!this.isMenu()) return;

        // Draw welcome message
        const messageSprite = this.spriteManager.sprites.message;
        ctx.drawImage(
            messageSprite,
            (ctx.canvas.width - messageSprite.width) / 2,
            50
        );

        // Draw text with pixel font
        ctx.fillStyle = 'white';
        ctx.font = '16px "FlappyBird"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add pixel-perfect text shadow
        ctx.fillStyle = 'black';
        ctx.fillText('PRESS SPACE', ctx.canvas.width / 2 + 2, ctx.canvas.height - 100 + 2);
        ctx.fillText('TO START', ctx.canvas.width / 2 + 2, ctx.canvas.height - 70 + 2);
        ctx.font = '12px "FlappyBird"';
        ctx.fillText('CLICK TO CHANGE BIRD', ctx.canvas.width / 2 + 2, ctx.canvas.height - 40 + 2);

        // Draw main text
        ctx.fillStyle = 'white';
        ctx.font = '16px "FlappyBird"';
        ctx.fillText('PRESS SPACE', ctx.canvas.width / 2, ctx.canvas.height - 100);
        ctx.fillText('TO START', ctx.canvas.width / 2, ctx.canvas.height - 70);
        ctx.font = '12px "FlappyBird"';
        ctx.fillText('CLICK TO CHANGE BIRD', ctx.canvas.width / 2, ctx.canvas.height - 40);
    }

    drawGameOver(ctx, score) {
        if (!this.isGameOver()) return;

        const gameOverSprite = this.spriteManager.sprites.gameOver;
        ctx.drawImage(
            gameOverSprite,
            (ctx.canvas.width - gameOverSprite.width) / 2,
            ctx.canvas.height / 3
        );

        // Draw text with pixel font
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add pixel-perfect text shadow
        ctx.fillStyle = 'black';
        ctx.font = '16px "FlappyBird"';
        ctx.fillText('PRESS SPACE', ctx.canvas.width / 2 + 2, ctx.canvas.height - 100 + 2);
        ctx.fillText('TO RETRY', ctx.canvas.width / 2 + 2, ctx.canvas.height - 70 + 2);
        ctx.font = '12px "FlappyBird"';
        ctx.fillText('CLICK TO MENU', ctx.canvas.width / 2 + 2, ctx.canvas.height - 40 + 2);

        // Draw main text
        ctx.fillStyle = 'white';
        ctx.font = '16px "FlappyBird"';
        ctx.fillText('PRESS SPACE', ctx.canvas.width / 2, ctx.canvas.height - 100);
        ctx.fillText('TO RETRY', ctx.canvas.width / 2, ctx.canvas.height - 70);
        ctx.font = '12px "FlappyBird"';
        ctx.fillText('CLICK TO MENU', ctx.canvas.width / 2, ctx.canvas.height - 40);
    }
}
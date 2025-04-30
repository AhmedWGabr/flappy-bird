# Flappy Bird Clone

A modern implementation of the classic Flappy Bird game using HTML5 Canvas and Electron.

![Flappy Bird](assets/sprites/message.png)

## Features

- Classic Flappy Bird gameplay mechanics
- Progressive difficulty system
- Day/night cycle with dynamic background transitions
- Multiple bird characters (Yellow, Red, Blue)
- Original sound effects
- Pixel-perfect collision detection
- Responsive design that scales with window size

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd flappy-bird
```

2. Install dependencies
```bash
npm install
```

## Running the Game

### Development Mode
To run the game in development mode:
```bash
npm run dev
```

### Desktop Application
To run as an Electron desktop application:
```bash
npm start
```

### Building Executable
To build a standalone executable:
```bash
npm run build
```
The executable will be available in the `dist` folder.

## How to Play

- Press SPACE or Click to start the game
- Press SPACE or Click to make the bird flap
- Avoid hitting the pipes and the ground
- Click in the menu to change bird color
- Score points by passing through pipe gaps
- The game gets progressively harder as your score increases

## Technical Details

- Built with HTML5 Canvas for rendering
- Electron for desktop application packaging
- Implements a custom physics system
- Features a progressive difficulty system where:
  - Pipe gaps start wider and gradually narrow
  - Pipe spacing decreases as score increases
  - Game speed gradually increases

## Credits

- Original game design by .GEARS (Dong Nguyen)
- Assets used are for educational purposes only
- Sound effects and sprites are part of the original game

## License

This project is created for educational purposes only.
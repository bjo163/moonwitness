import { Boot } from './scenes/Boot';
import { HUD } from './scenes/HUD';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { WorldMap } from './scenes/WorldMap';
import { Dialogue } from './scenes/Dialogue';
import { BattleScene } from './scenes/BattleScene';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
        },
    },
    scene: [
        Boot,
        Preloader,
        MainGame,
        WorldMap,
        Dialogue,
        BattleScene,
        HUD,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;

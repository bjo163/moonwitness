import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/main';
import { EventBus } from './game/EventBus';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref)
{
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {
            game.current = StartGame("game-container");

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {
                currentActiveScene(scene_instance);
            }

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: scene_instance };
            }
        });

        EventBus.on('scene-change', (data: { targetScene: string }) => {
            if (game.current && data.targetScene) {
                const g = game.current;
                setTimeout(() => {
                    const scene = g.scene.scenes.find(s => s.scene.key === data.targetScene);
                    if (scene) {
                        g.scene.start(data.targetScene);
                    } else {
                        console.warn(`[Rocksoul] Scene key not found: ${data.targetScene}`);
                    }
                }, 50);
            }
        });

        return () =>
        {
            EventBus.removeListener('current-scene-ready');
            EventBus.removeListener('scene-change');
        }
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container"></div>
    );
});
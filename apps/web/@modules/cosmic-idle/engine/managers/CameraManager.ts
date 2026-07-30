import Phaser from 'phaser';

export class CameraManager {
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    this.camera = camera;
  }

  follow(target: Phaser.GameObjects.GameObject, lerpX: number = 0.1, lerpY: number = 0.1) {
    this.camera.startFollow(target, true, lerpX, lerpY);
  }

  stopFollow() {
    this.camera.stopFollow();
  }

  shake(duration: number = 250, intensity: number = 0.01) {
    this.camera.shake(duration, intensity);
  }

  fade(duration: number = 1000, r: number = 0, g: number = 0, b: number = 0, callback?: () => void) {
    this.camera.fade(duration, r, g, b);
    if (callback) {
      this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
    }
  }

  flash(duration: number = 250, r: number = 255, g: number = 255, b: number = 255) {
    this.camera.flash(duration, r, g, b);
  }

  setBounds(x: number, y: number, width: number, height: number) {
    this.camera.setBounds(x, y, width, height);
  }
}

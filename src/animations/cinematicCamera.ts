import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { Animation } from "@babylonjs/core/Animations/animation";
import { EasingFunction, QuadraticEase } from "@babylonjs/core/Animations/easing";

export class CinematicCamera {
  scene: Scene;
  canvas: HTMLCanvasElement;
  camera: FreeCamera;
  pos_animation: Animation;
  rot_animation: Animation;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
    this.camera = this.createCamera();
    this.pos_animation = this.createAnimation("pos", "position");
    this.rot_animation = this.createAnimation("rot", "rotation");
    this.fillAnimation();
    this.playAnimation();
  }

  createCamera(): FreeCamera {
    const camera = new FreeCamera(
      "CinematicCamera",
      new Vector3(0, 2, 0),
      this.scene
    );
    camera.fov = 1.2;
    // this.scene.activeCamera = camera;
    camera.setTarget(new Vector3(2, 2, 0));
    return camera;
  }

  createAnimation(name: string, property: string): Animation {
    const animation = new Animation(
      name,
      property,
      10,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    return animation;
  }

  fillAnimation(): void {
    const pos_keys = [
      {
        frame: 0,
        value: new Vector3(0, 2, 0),
        outTangent: new Vector3(0, 0, -1),
      },
      {
        frame: 30,
        value: new Vector3(-8, 2, 4),
        inTangent: new Vector3(0, 0, 1),
        outTangent: new Vector3(0, 0, 1),
      },
      {
        frame: 60,
        value: new Vector3(0, 2, 0),
        inTangent: new Vector3(0, 0, -1),
      },
    ];
    this.pos_animation.setKeys(pos_keys);

    const easing = new QuadraticEase();
    easing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

    // this.pos_animation.setEasingFunction(easing);
  }

  playAnimation(): void {
    this.camera.animations = [this.pos_animation];
    this.scene.beginAnimation(this.camera, 0, 60, true, 0.5);
  }

  stopAnimation(): void {}
}

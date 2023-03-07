import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { Animation } from "@babylonjs/core/Animations/animation";

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
  }

  createCamera(): FreeCamera {
    const camera = new FreeCamera(
      "CinematicCamera",
      new Vector3(0, 2, 0),
      this.scene
    );
    camera.fov = 1.2;
    this.scene.activeCamera = camera;
    camera.setTarget(new Vector3(2, 2, 0));
    return camera;
  }

  createAnimation(name: string, property: string): Animation {
    const animation = new Animation(
      name,
      property,
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    return animation;
  }

  fillAnimation(): void {}

  playAnimation(): void {}

  stopAnimation(): void {}
}

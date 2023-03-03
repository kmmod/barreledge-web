import { AbstractMesh, MeshBuilder } from "@babylonjs/core/Meshes";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { PlayerInput } from "./input";

export class Player {
  scene: Scene;
  canvas: HTMLCanvasElement;
  input: PlayerInput;
  collider: AbstractMesh;
  camera: FreeCamera;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
    this.input = new PlayerInput(this.scene);
    this.collider = this.playerCollider();
    this.camera = this.createCamera();
    this.init();
  }

  init(): void {
    this.scene.registerBeforeRender(() => {
      this.update();
    });
  }

  private createCamera(): FreeCamera {
    const camera = new FreeCamera("player", new Vector3(0, 1, 0), this.scene);
    camera.setTarget(new Vector3(2, 1, 0));
    camera.attachControl(this.canvas, true);
    camera.speed = 0.0;
    camera.angularSensibility = 2000;
    camera.parent = this.collider;
    return camera;
  }

  private playerCollider(): AbstractMesh {
    const capsule = MeshBuilder.CreateCapsule(
      "playerCollider",
      { tessellation: 8, subdivisions: 1, capSubdivisions: 2 },
      this.scene
    );
    capsule.position.y = 5;

    // TODO: Create proper onCollision events
    capsule.onCollide = (collider) => {
      if (collider?.physicsImpostor && collider.physicsImpostor.mass > 0) {
        collider.physicsImpostor.applyImpulse(
          collider
            .getAbsolutePosition()
            .subtract(capsule.getAbsolutePosition())
            .normalize(),
          collider.getAbsolutePosition()
        );
      }
    };
    capsule.checkCollisions = true;
    return capsule;
  }

  attachControl(): void {
    this.camera.attachControl(this.canvas, true);
  }

  getMovementVector(): Vector3 {
    const inputVector = this.input.getInputVector();
    const direction = this.camera.getDirection(inputVector);
    // TODO: gravity should include slope normal to prevent sliding to some
    // degree (pun intended)
    const gravity = this.input.jumpValue > 0 ? 1 : -1;
    const movementVector = new Vector3(direction.x, gravity, direction.z);
    return movementVector.scale(0.1);
  }

  update(): void {
    this.collider.moveWithCollisions(this.getMovementVector());
  }
}

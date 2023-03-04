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
  velocity: Vector3;
  movementVector: Vector3;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
    this.input = new PlayerInput(this.scene);
    this.collider = this.playerCollider();
    this.camera = this.createCamera();
    this.velocity = new Vector3(0, 0, 0);
    this.movementVector = new Vector3(0, 0, 0);
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
    camera.inertia = 0.8;
    camera.parent = this.collider;
    camera.fov = 1.5;
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

  updateMovementVector(): void {
    this.movementVector.x =
      this.input.inputVector.x * Math.cos(this.camera.rotation.y) +
      this.input.inputVector.z * Math.sin(this.camera.rotation.y);

    this.movementVector.z =
      this.input.inputVector.x * Math.sin(this.camera.rotation.y * -1) +
      this.input.inputVector.z * Math.cos(this.camera.rotation.y * -1);

    this.movementVector.y -= 0.1;
  }

  updateVelocity(): void {
    this.velocity = Vector3.Lerp(this.velocity, this.movementVector, 0.1);
  }

  update(): void {
    this.updateMovementVector();
    this.updateVelocity();
    this.collider.moveWithCollisions(this.velocity.scale(0.1));
  }
}

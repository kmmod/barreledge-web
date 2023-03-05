import { AbstractMesh, MeshBuilder } from "@babylonjs/core/Meshes";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { PlayerInput } from "./input";
import { Ray } from "@babylonjs/core/Culling/ray";

export class Player {
  scene: Scene;
  canvas: HTMLCanvasElement;
  input: PlayerInput;
  collider: AbstractMesh;
  camera: FreeCamera;
  velocity: Vector3;
  movementVector: Vector3;
  speed: number;
  jumpSpeed: number;
  velocityDamping: number;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
    this.input = new PlayerInput(this.scene);
    this.collider = this.playerCollider();
    this.camera = this.createCamera();
    this.velocity = new Vector3(0, 0, 0);
    this.movementVector = new Vector3(0, 0, 0);
    this.speed = 0.15;
    this.jumpSpeed = 0.18;
    this.velocityDamping = 0.1;
    this.init();
  }

  init(): void {
    this.scene.registerBeforeRender(() => {
      this.update();
    });
  }

  private createCamera(): FreeCamera {
    const camera = new FreeCamera("player", new Vector3(0, 0.5, 0), this.scene);
    camera.setTarget(new Vector3(2, 0.5, 0));
    camera.attachControl(this.canvas, true);
    camera.speed = 0.0;
    camera.angularSensibility = 1500;
    camera.inertia = 0.65;
    camera.parent = this.collider;
    camera.fov = 1.3;
    camera.minZ = 0.1;
    return camera;
  }

  private playerCollider(): AbstractMesh {
    const capsule = MeshBuilder.CreateCapsule(
      "playerCollider",
      { tessellation: 12, subdivisions: 1, capSubdivisions: 4 },
      this.scene
    );
    capsule.position.y = 5;
    capsule.position.x = -3;

    // TODO: Create proper onCollision events
    capsule.onCollide = (collider) => {
      if (collider?.physicsImpostor && collider.physicsImpostor.mass > 0) {
        collider.physicsImpostor.applyImpulse(
          collider
            .getAbsolutePosition()
            .subtract(capsule.getAbsolutePosition())
            .normalize()
            .scale(15.0),
          collider.getAbsolutePosition()
        );
      }
    };
    capsule.ellipsoid = new Vector3(0.5, 0.75, 0.5);
    capsule.checkCollisions = true;
    return capsule;
  }

  attachControl(): void {
    this.camera.attachControl(this.canvas, true);
  }

  private updateMovementVector(): void {
    this.movementVector.x =
      this.input.inputVector.x * Math.cos(this.camera.rotation.y) +
      this.input.inputVector.z * Math.sin(this.camera.rotation.y);

    this.movementVector.z =
      this.input.inputVector.x * Math.sin(this.camera.rotation.y * -1) +
      this.input.inputVector.z * Math.cos(this.camera.rotation.y * -1);

    this.movementVector.y = 0;
    this.movementVector.normalize().scaleInPlace(this.speed);
  }

  private isGrounded(): boolean {
    const ray = new Ray(this.collider.position, new Vector3(0, -1, 0), 1.1);
    const hit = this.scene.pickWithRay(ray, (mesh) => mesh !== this.collider);
    return (hit && hit.hit) || false;
  }

  private updateVelocity(): void {
    if (this.isGrounded() && this.input.inputVector.y > 0.0) {
      this.velocity.y = this.jumpSpeed;
    } else if (this.isGrounded()) {
      this.velocity.y = 0.0;
    } else {
      this.velocity.y -= 0.01;
    }
    this.velocity.x = Scalar.Lerp(
      this.velocity.x,
      this.movementVector.x,
      this.velocityDamping
    );
    this.velocity.z = Scalar.Lerp(
      this.velocity.z,
      this.movementVector.z,
      this.velocityDamping
    );
  }

  update(): void {
    this.updateMovementVector();
    this.updateVelocity();
    this.collider.moveWithCollisions(this.velocity);
  }
}

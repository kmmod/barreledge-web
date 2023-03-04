import cannon from "cannon";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Collisions/collisionCoordinator";
import "@babylonjs/core/Physics/physicsEngineComponent";
import { CannonJSPlugin } from "@babylonjs/core/Physics/Plugins/cannonJSPlugin";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PhysicsImpostor } from "@babylonjs/core/Physics/v1/physicsImpostor";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import { Player } from "./player/player";

window.CANNON = cannon;

class App {
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;
  player: Player;

  constructor() {
    this.canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    this.engine = new Engine(this.canvas);
    this.scene = this.createScene();
    this.player = new Player(this.scene, this.canvas);
    this.createEnvironment();
    this.init();
  }

  createScene(): Scene {
    const scene = new Scene(this.engine);
    const gravityVector = new Vector3(0, -9.81, 0);
    const physicsPlugin = new CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    // scene.forceWireframe = true;
    return scene;
  }

  createEnvironment(): void {
    const light = new HemisphericLight(
      "light1",
      new Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.7;

    const sphere = CreateSphere(
      "sphere1",
      { segments: 4, diameter: 2 },
      this.scene
    );
    sphere.position.y = 4;
    sphere.position.x = 7;
    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 25, restitution: 0.0 },
      this.scene
    );

    sphere.checkCollisions = true;

    const ground = CreateGround(
      "ground1",
      { width: 40, height: 40, subdivisions: 2 },
      this.scene
    );

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9 },
      this.scene
    );

    ground.checkCollisions = true;

    const slope = CreateGround(
      "slope1",
      { width: 30, height: 20, subdivisions: 2 },
      this.scene
    );
    slope.position.x = 20;
    slope.rotation.z = Math.PI / 8;

    slope.physicsImpostor = new PhysicsImpostor(
      slope,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 },
      this.scene
    );

    slope.checkCollisions = true;
  }

  init(): void {
    this.canvas.addEventListener("click", () => {
      this.canvas.requestPointerLock();
    });
    
    window.addEventListener("resize", () => {
      this.engine.resize();
    });

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}

new App();

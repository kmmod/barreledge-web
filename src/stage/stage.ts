import "@babylonjs/loaders";
import { CreateBox, CreateGround, CreateSphere } from "@babylonjs/core/Meshes";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PhysicsImpostor } from "@babylonjs/core/Physics/v1/physicsImpostor";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { PBRMetallicRoughnessMaterial } from "@babylonjs/core/Materials/PBR/pbrMetallicRoughnessMaterial";
import { VertexBuffer } from "@babylonjs/core/Buffers/buffer";
import { PhysicsViewer } from "@babylonjs/core/Debug/physicsViewer";

export class Stage {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.enviroment();
    this.init();
    // this.createTestEnvironment();
  }

  enviroment(): void {
    const light = new HemisphericLight(
      "light1",
      new Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.7;
  }

  init(): void {
    const physicsViewer = new PhysicsViewer(this.scene);
    const lightMap = new Texture("lightmap.png", this.scene);
    lightMap.coordinatesIndex = 1;
    lightMap.vScale = -1;

    SceneLoader.ImportMesh(
      null,
      "",
      "stage_test.gltf",
      this.scene,
      (meshes: any) => {
        meshes
          .filter((mesh: any) => mesh.geometry)
          .forEach((mesh: any) => {
            // TODO: Wonky physics - maybe switch to ammo.js? Or use own
            // collision events calculations?

            mesh.checkCollisions = true;
            mesh.material.lightmapTexture = lightMap;
            mesh.material.useLightmapAsShadowmap = true;
            // mesh.physicsImpostor = new PhysicsImpostor(
            //   mesh,
            //   PhysicsImpostor.BoxImpostor,
            //   { mass: 0, restitution: 0.9, friction: 0.5, ignoreParent: true },
            //   this.scene
            // );

            // physicsViewer.showImpostor(mesh.physicsImpostor);
          });
      }
    );
  }

  createTestEnvironment(): void {
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
      { mass: 5, restitution: 0.01, friction: 0.5 },
      this.scene
    );

    sphere.physicsImpostor.physicsBody.angularDamping = 0.8;

    sphere.checkCollisions = true;

    const ground = CreateGround(
      "ground1",
      { width: 40, height: 40, subdivisions: 2 },
      this.scene
    );

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.9, friction: 0.5 },
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

    for (let i = 0; i < 20; i++) {
      const stair = CreateBox(
        "stair1",
        { width: 11, height: 1, depth: 5 },
        this.scene
      );
      stair.position.x = 20 - i;
      stair.position.y = 0.5 * i;
      stair.position.z = 10 + 2 * i;

      stair.physicsImpostor = new PhysicsImpostor(
        stair,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 1 },
        this.scene
      );

      stair.checkCollisions = true;
    }
  }
}

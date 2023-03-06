import "@babylonjs/loaders";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import {
  CreateBox,
  CreateCylinder,
  CreateGround,
  CreateSphere,
} from "@babylonjs/core/Meshes";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { PhysicsImpostor } from "@babylonjs/core/Physics/v1/physicsImpostor";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { PhysicsViewer } from "@babylonjs/core/Debug/physicsViewer";
import { Texture } from "@babylonjs/core/Materials/Textures";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { SkyMaterial } from "@babylonjs/materials/sky";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";

export class Stage {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.enviroment();
    this.init();
    this.createTestCorridorWithLights();
    // this.createTestEnvironment();
  }

  enviroment(): void {
    const skyMaterial = new SkyMaterial("sky", this.scene);
    skyMaterial.backFaceCulling = false;

    const skybox = CreateBox("skyBox", { size: 1000 }, this.scene);
    skybox.material = skyMaterial;

    skyMaterial.turbidity = 120;
    skyMaterial.luminance = 0.25;
    skyMaterial.azimuth = 0.4;
    skyMaterial.inclination = 0.5;
    skyMaterial.mieDirectionalG = 0.4;
    skyMaterial.mieCoefficient = 0.005;
    skyMaterial.rayleigh = 0.1;

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

  createTestCorridorWithLights(): void {
    const light_1 = new PointLight(
      "light_1",
      new Vector3(15, 4, -8),
      this.scene
    );
    light_1.intensity = 100;
    light_1.range = 20;
    const shadowGenerator_1 = new ShadowGenerator(1024, light_1);

    const light_2 = new PointLight(
      "light_2",
      new Vector3(20, 4, -8),
      this.scene
    );
    light_2.intensity = 100;
    light_2.range = 20;
    const shadowGenerator_2 = new ShadowGenerator(1024, light_2);

    const light_3 = new PointLight(
      "light_3",
      new Vector3(30, 4, -8),
      this.scene
    );
    light_3.intensity = 100;
    light_3.range = 20;
    const shadowGenerator_3 = new ShadowGenerator(1024, light_3);

    const light_4 = new PointLight(
      "light_4",
      new Vector3(35, 4, -8),
      this.scene
    );
    light_4.intensity = 100;
    light_4.range = 20;
    const shadowGenerator_4 = new ShadowGenerator(1024, light_4);

    const light_5 = new PointLight(
      "light_5",
      new Vector3(40, 4, -8),
      this.scene
    );
    light_5.intensity = 100;
    light_5.range = 20;
    const shadowGenerator_5 = new ShadowGenerator(1024, light_5);

    const material = new PBRMaterial("material", this.scene);
    material.albedoColor = new Color3(0.6, 0.6, 0.6);
    material.metallic = 0.0;
    material.roughness = 0.9;
    material.maxSimultaneousLights = 8;

    const ground = CreateGround(
      "ground1",
      { width: 80, height: 40, subdivisions: 2 },
      this.scene
    );

    ground.position.x = 45;
    ground.position.y = -1;
    ground.checkCollisions = true;
    ground.receiveShadows = true;
    ground.material = material;
    shadowGenerator_1.addShadowCaster(ground, true);
    shadowGenerator_2.addShadowCaster(ground, true);
    shadowGenerator_3.addShadowCaster(ground, true);
    shadowGenerator_4.addShadowCaster(ground, true);
    shadowGenerator_5.addShadowCaster(ground, true);

    for (let i = 0; i < 20; i++) {
      const cylinder = CreateCylinder(
        "cylinder" + i,
        { height: 8, diameter: 1 },
        this.scene
      );
      cylinder.position.x = 12 + i * 2;
      cylinder.position.y = 3;
      cylinder.position.z = i % 2 === 0 ? 5 : -5;
      cylinder.checkCollisions = true;
      cylinder.receiveShadows = true;
      cylinder.material = material;
      shadowGenerator_1.addShadowCaster(cylinder, true);
      shadowGenerator_2.addShadowCaster(cylinder, true);
      shadowGenerator_3.addShadowCaster(cylinder, true);
      shadowGenerator_4.addShadowCaster(cylinder, true);
      shadowGenerator_5.addShadowCaster(cylinder, true);
    }
    let time = 0;
    this.scene.registerBeforeRender(() => {
      light_1.position.z = Math.sin(time) * 8;
      light_2.position.z = Math.sin(time + 4) * 8;
      light_3.position.z = Math.sin(time + 8) * 8;
      light_4.position.z = Math.sin(time + 12) * 8;
      light_5.position.z = Math.sin(time + 16) * 8;

      if (this.scene.deltaTime) {
        time += this.scene.deltaTime / 1500;
      }
    });
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

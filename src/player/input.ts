import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { ExecuteCodeAction } from "@babylonjs/core/Actions/directActions";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";

export class PlayerInput {
  scene: Scene;
  inputMap: { [key: string]: boolean };
  verticalAxis: number;
  horizontalAxis: number;
  jumpValue: number;
    inputVector: Vector3;

  constructor(scene: Scene) {
    this.scene = scene;
    this.inputMap = {};
    this.verticalAxis = 0;
    this.horizontalAxis = 0;
    this.inputVector = new Vector3(0, 0, 0);
    this.jumpValue = 0;
    this.init();
  }

  init(): void {
    this.scene.actionManager = new ActionManager(this.scene);
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      })
    );
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      })
    );
    this.scene.onBeforeRenderObservable.add(() => {
      this.update();
    });
  }

  getInputVector(): Vector3 {
    return this.inputVector;
  }

  update(): void {
    if (this.inputMap["w"] || this.inputMap["ArrowUp"]) {
      this.inputVector.z = 1;
    } else if (this.inputMap["s"] || this.inputMap["ArrowDown"]) {
      this.inputVector.z = -1;
    } else {
      this.inputVector.z = 0;
    }
    if (this.inputMap["a"] || this.inputMap["ArrowLeft"]) {
      this.inputVector.x = -1;
    } else if (this.inputMap["d"] || this.inputMap["ArrowRight"]) {
      this.inputVector.x = 1;
    } else {
      this.inputVector.x = 0;
    }
    if (this.inputMap[" "]) {
      this.inputVector.y = 1;
    } else {
      this.inputVector.y = 0;
    }
  }
}

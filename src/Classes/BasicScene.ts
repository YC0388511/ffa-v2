import { AmmoJSPlugin, Engine, Scene } from "@babylonjs/core";
import AMMO from "ammojs-typed";

export abstract class BasicScene {
  engine!: Engine;
  scene!: Scene;
  physicsPlugin!: AmmoJSPlugin;
  constructor(private canvas: HTMLCanvasElement) {
    (async () => {
      const ammo = await AMMO();
      this.physicsPlugin = new AmmoJSPlugin(true, ammo);
      this.engine = new Engine(this.canvas, true);

      this.scene = this.CreateScene();
      if (this.afterSceneCreate) this.afterSceneCreate();

      this.engine.runRenderLoop(() => {
        if (this.scene.cameras.length) this.scene.render();
      });
      this.scene.beforeRender = () => {
        if (this.beforeRender) this.beforeRender();
      };
    })();
  }

  abstract CreateScene(): Scene;

  afterSceneCreate?(): void;
  beforeRender?(): void;
}

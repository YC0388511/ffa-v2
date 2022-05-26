import { BasicScene } from "@/Classes/BasicScene";
import { Player } from "@/Classes/Player";
import {
  HemisphericLight,
  Material,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  PhysicsImpostor,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";

export class MainScene extends BasicScene {
  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    scene.enablePhysics(new Vector3(0, -9.81, 0), this.physicsPlugin);
    scene.onPointerDown = (evt) => {
      if (evt.button == 0) {
        this.engine.enterPointerlock();
      } else if (evt.button == 1) {
        this.engine.exitPointerlock();
      }
    };
    this.CreateFloor();
    this.CreateAmbientLight();
    this.CreateRoom().then(() => {
      this.player = this.CreatePlayer();
    });
    return scene;
  }

  player?: Player;
  CreatePlayer(): Player {
    return new Player(this);
  }

  CreateFloor(): Mesh {
    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 100,
        height: 100,
      },
      this.scene
    );
    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.5 },
      this.scene
    );
    ground.position.y -= 1;
    return ground;
  }

  async CreateRoom(): Promise<Mesh[]> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "full_room.gltf",
      this.scene
    );

    const enableAlphaMap: { [mesh: string]: boolean } = {
      inner_window_primitive1: true,
      outer_window_primitive1: true,
    };
    const massMap: { [mesh: string]: number } = {
      chair: 10,
    };
    for (const mesh of meshes) {
      if (!(mesh instanceof Mesh)) continue;
      const mass = massMap[mesh.name] ?? 0;
      if (mass) {
        mesh.parent = null;
      }
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        PhysicsImpostor.MeshImpostor,
        {
          mass,
          friction: 0.6,
        },
        this.scene
      );
      if (enableAlphaMap[mesh.name] && mesh.material instanceof PBRMaterial) {
        mesh.material.transparencyMode = Material.MATERIAL_ALPHABLEND;
        mesh.material.albedoTexture!.hasAlpha = true;
        mesh.material.useAlphaFromAlbedoTexture = true;
      }
    }
    return meshes as Mesh[];
  }

  CreateAmbientLight(): HemisphericLight {
    const hemi = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    hemi.intensity = 0.25;
    return hemi;
  }

  beforeRender(): void {
    this.player?.beforeRender();
  }
}

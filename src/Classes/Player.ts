import {
  FreeCamera,
  KeyboardEventTypes,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  Ray,
  SpotLight,
  Vector3,
} from "@babylonjs/core";
import { BasicScene } from "@/Classes/BasicScene";
import { HUD } from "@/Classes/HUD";

export class Player {
  sprint = 7.5;
  walk = 3.5;
  jump = 15;
  camera: FreeCamera;
  character: Mesh;
  flashlight: SpotLight;
  hud = new HUD(this.sceneClass);
  moveInput = {
    forward: false,
    back: false,
    left: false,
    right: false,
    sprinting: false,
  };
  velocity = new Vector3();
  grounded = false;
  teleportCooldown = 30;

  constructor(public sceneClass: BasicScene) {
    this.character = this.CreateCharacter();
    this.camera = this.CreateCamera();
    this.flashlight = this.CreateFlashlight();
    this.ListenToMovement();
  }

  ListenToMovement() {
    const keysPressed: { [keyCode: string]: boolean } = {};
    this.sceneClass.scene.onKeyboardObservable.add((evd) => {
      const down = evd.type === KeyboardEventTypes.KEYDOWN;
      const up = evd.type === KeyboardEventTypes.KEYUP;

      const newState = down ? true : up ? false : null;

      const code = evd.event.code;

      if (newState === keysPressed[code]) return;

      if (down) {
        keysPressed[code] = true;
      } else if (up) keysPressed[code] = false;

      const keyMap: {
        [str: string]: "forward" | "back" | "right" | "left" | "sprinting";
      } = {
        KeyW: "forward",
        KeyS: "back",
        KeyD: "right",
        KeyA: "left",
        ShiftLeft: "sprinting",
        ShiftRight: "sprinting",
      };

      if (Object.keys(keyMap).includes(code) && (down || up)) {
        this.moveInput[keyMap[code]] = keysPressed[code];
      } else if (
        code === "Space" &&
        evd.type === KeyboardEventTypes.KEYDOWN &&
        this.grounded
      ) {
        this.character.physicsImpostor!.applyImpulse(
          new Vector3(0, this.jump, 0),
          new Vector3()
        );
      } else if (code === "KeyB" && evd.type === KeyboardEventTypes.KEYDOWN) {
        HUD.DEBUG_ENABLED = !HUD.DEBUG_ENABLED;
      }
    });
  }

  CreateCharacter(): Mesh {
    const mesh = MeshBuilder.CreateCylinder(
      "player",
      {
        diameter: 0.5,
        height: 2,
      },
      this.sceneClass.scene
    );
    mesh.position = new Vector3(1.5, 1.5, -3);
    const impost = new PhysicsImpostor(
      mesh,
      PhysicsImpostor.CylinderImpostor,
      { mass: 3, friction: 0.6 },
      this.sceneClass.scene
    );
    mesh.physicsImpostor = impost;
    impost.beforeStep = () => {
      impost.setAngularVelocity(new Vector3(0, 0, 0));

      this.teleportCooldown--;
      if (this.teleportCooldown > 0) return;
      const vel = impost.getLinearVelocity() ?? new Vector3();

      const x = (this.moveInput.right ? 1 : 0) + (this.moveInput.left ? -1 : 0);
      const z =
        (this.moveInput.forward ? 1 : 0) + (this.moveInput.back ? -1 : 0);
      const camera = this.camera;
      const cameraRight = camera.getDirection(new Vector3(1, 0, 0));
      const cameraDirection = camera.getDirection(new Vector3(0, 0, 1));

      impost.setLinearVelocity(
        new Vector3(0, vel.y, 0).add(
          cameraRight
            .scale(x)
            .add(cameraDirection.scale(z))
            .multiply(new Vector3(1, 0, 1))
            .normalize()
            .scale(this.moveInput.sprinting ? this.sprint : this.walk)
        )
      );
    };
    return mesh;
  }

  CreateCamera(): FreeCamera {
    const cam = new FreeCamera(
      "camera",
      new Vector3(0, 1, 0),
      this.sceneClass.scene
    );
    cam.minZ = 0.4;

    cam.attachControl();
    cam.angularSensibility = 4000;

    // cam.keysUp.push(87);
    // cam.keysDown.push(83);
    // cam.keysLeft.push(65);
    // cam.keysRight.push(68);
    cam.speed = 0.1;

    cam.parent = this.character;

    return cam;
  }

  CreateFlashlight(): SpotLight {
    const light = new SpotLight(
      "flashlight",
      this.camera.position,
      this.camera.getForwardRay(1).direction,
      45 * (Math.PI / 180),
      0.25,
      this.sceneClass.scene
    );
    light.parent = this.camera;
    light.intensity = 0.5;
    return light;
  }

  beforeRender(): void {
    this.character.rotation = new Vector3();

    const scene = this.sceneClass.scene;
    const groundCast = scene.pickWithRay(
      new Ray(this.character.position, new Vector3(0, -1.2, 0), 1),
      (mesh) => mesh.name !== "player"
    );
    this.grounded = (groundCast && groundCast.hit) ?? false;

    const camera = this.camera;
    const ray = new Ray(
      camera.globalPosition,
      camera.getDirection(new Vector3(0, 0, 1))
    );
    const cast = scene.pickWithRay(ray, (mesh) => mesh.name !== "player");
    this.hud.getInfo(cast?.pickedMesh?.name);
    this.hud.getDebug(
      this.character,
      this.camera,
      cast?.pickedMesh ?? undefined
    );
  }
}

import {
  AbstractMesh,
  FreeCamera,
  Mesh,
  Vector3,
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Control,
  Image,
  TextBlock,
} from "@babylonjs/gui";
import { BasicScene } from "./BasicScene";

export class HUD {
  debugText: TextBlock;
  infoText: TextBlock;
  crosshair: Image;
  constructor(public sceneClass: BasicScene) {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const crosshair = new Image("crosshair", "./textures/crosshair.png");
    crosshair.name = "crosshair";
    crosshair.width = "16px";
    crosshair.height = "16px";
    crosshair.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    crosshair.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(crosshair);
    this.crosshair = crosshair;

    const debugText = new TextBlock();
    debugText.text = "";
    debugText.color = "white";
    debugText.fontSize = 12;
    debugText.name = "debugText";
    debugText.textWrapping = true;
    debugText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    debugText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    debugText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    debugText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    debugText.width = "25%";
    debugText.left = 10;
    debugText.top = 10;
    advancedTexture.addControl(debugText);
    this.debugText = debugText;

    const infoText = new TextBlock();
    infoText.text = "";
    infoText.color = "blue";
    infoText.fontSize = 24;
    infoText.name = "infoText";
    infoText.textWrapping = true;
    infoText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    // infoText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    infoText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    // infoText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    infoText.width = "75%";
    infoText.top = -20;
    advancedTexture.addControl(infoText);
    this.infoText = infoText;
  }

  infoMap: { [id: string]: string } = {
    chair: "Chair\nIt's literally just a chair",
    table: "Table\nNormally you'd put stuff on top of this thing",
    monitor:
      "Monitor\nThe new high-tech monitor available for only $1,000,000,000",
    keyboard: "Keyboard\nYour average keyboard",
    mouse: "Mouse\nNo, this is not the animal",
    mouse_pad: "Mouse Pad\nKeeps your mouse's feet nice and clean",
    textbook: "Textbook\nFor all your studying needs",
    books: "Books\nSomeone does a bit of reading",
    pencil_holder:
      "Pencil Holder\nYou don't want those writing materials all over your desk, do you?",
    desk: "Desk\nIt's just a desk",
    shelf: "Shelf\nA mysterious structure used to hold stuff",
    door: "Door\nMake sure not to slam into this one, it hurts, don't ask why I know",
    door_knob: "Door Knob\nHow else are you gonna open the door?",

    // Crime related messages
    bed: "Bed\nSuspected location of victim's death",
    pillow:
      "Pillow\nMessy placement of pillows indicates that the suspect likely dragged the victim's body out of bed",
    blood_puddle:
      "Blood Puddle\nLikely left behind from the body lying there for a period of time",
    muddy_footprint:
      "Muddy Footprint\nIndicates that the suspect must have entered through the window",
    bloody_handprint:
      "Bloody Handprint\nThe suspect may have touched the inside of the window on their way out",
    knife: "Knife\nLikely the weapon used to commit the murder",
    blanket: "Blanket\nThe blanket used to wrap the dead body",
    right_foot: "Dead Body\nThe victim's body",
    left_foot: "Dead Body\nThe victim's body",
    inner_window_primitive1: "Window\nSuspected mode of entry and exit",
    outer_window_primitive1: "Window\nSuspected mode of entry and exit",
  };
  getInfo(id = "") {
    const info = this.infoMap[id];
    if (!info) {
      this.infoText.isVisible = false;
    } else {
      if (!this.infoText.isVisible) this.infoText.isVisible = true;
      this.infoText.text = info;
    }
  }

  prevFPS = 0;
  prevTime = 0;
  getDebug(character: Mesh, camera: FreeCamera, target?: AbstractMesh) {
    if (!HUD.DEBUG_ENABLED) {
      this.debugText.isVisible = false;
    } else if (!this.debugText.isVisible) this.debugText.isVisible = true;

    const scene = this.sceneClass.scene;
    const engine = scene.getEngine();
    const time = new Date().getTime();
    const FPS =
      time - this.prevTime > 500
        ? Math.floor(1 / (engine.getDeltaTime() / 1000))
        : this.prevFPS;
    if (time - this.prevTime > 500) this.prevTime = time;
    this.prevFPS = FPS;

    let castText = `{
  Name: Null
  Parent Name: Null
  Mass: Null
}`;
    if (target) {
      castText = `{
  Name: ${target.name}
  Parent: ${target.parent?.name ?? "Null"}
  Mass: ${target.physicsImpostor?.mass ?? "Null"}
}`;
    }

    this.debugText.text = `Position: ${character.position
      .toArray([])
      .asArray()
      .map((v) => v.toFixed(2))}
Rotation: ${((camera.rotation.x * 180) / Math.PI).toFixed(2)}, ${(
      (camera.rotation.y * 180) /
      Math.PI
    ).toFixed(2)}
Character Rotation: ${character.rotation
      .toArray([])
      .asArray()
      .map((v) => v.toFixed(2))}
Velocity: ${(character.physicsImpostor?.getLinearVelocity() ?? new Vector3())
      .toArray([])
      .asArray()
      .map((v) => v.toFixed(2))}
Looking At: ${castText}
FPS: ${FPS}`;
  }

  static DEBUG_ENABLED = false;
}

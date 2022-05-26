import { Mesh, Quaternion, Vector3 } from "@babylonjs/core";

export class VectorMath {
  // Source: https://forum.babylonjs.com/t/ammojs-apply-force/26492
  static vmult(v: Vector3, q: Quaternion) {
    const target = new Vector3();

    const x = v.x,
      y = v.y,
      z = v.z;

    const qx = q.x,
      qy = q.y,
      qz = q.z,
      qw = q.w;

    // q*v
    const ix = qw * x + qy * z - qz * y,
      iy = qw * y + qz * x - qx * z,
      iz = qw * z + qx * y - qy * x,
      iw = -qx * x - qy * y - qz * z;

    target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return target;
  }
  // Source: https://forum.babylonjs.com/t/ammojs-apply-force/26492
  static vectorToWorldFrame(
    localVector: Vector3,
    quaternion: Quaternion
  ): Vector3 {
    let result = new Vector3();
    result = this.vmult(localVector, quaternion);
    return result;
  }
  // Source: https://forum.babylonjs.com/t/ammojs-apply-force/26492
  static pointToWorldFrame(
    localPoint: Vector3,
    quaternion: Quaternion,
    position: Vector3
  ): Vector3 {
    let result = new Vector3();
    result = this.vmult(localPoint, quaternion);
    result = result.add(position);
    return result;
  }
  // Source: https://forum.babylonjs.com/t/ammojs-apply-force/26492
  static applyLocalForce(
    mesh: Mesh,
    localForce: Vector3,
    localPoint: Vector3 = new Vector3()
  ): void {
    let worldForce = new Vector3();
    let worldPoint = new Vector3();

    // Transform the force vector to world space
    worldForce = this.vectorToWorldFrame(localForce, mesh.rotationQuaternion!);
    worldPoint = this.pointToWorldFrame(
      localPoint,
      mesh.rotationQuaternion!,
      mesh.getAbsolutePosition()
    );
    mesh.physicsImpostor!.applyForce(worldForce, worldPoint);
  }
}

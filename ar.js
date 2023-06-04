import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let ratio = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function main() {
  const canvas = document.getElementById("canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, 1.33, 0.1, 10000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  const arjs = new THREEx.LocationBased(scene, camera);
  const cam = new THREEx.WebcamRenderer(renderer);

  const loader = new GLTFLoader();

  // Load in objects
  const objects = [
    { fileName: "creature_1", lon: 51.983467, lat: 5.908757, scale: 1.0 },
    { fileName: "creature_1", lon: 51.9833337, lat: 5.9107146, scale: 0.1 },
    { fileName: "creature_1", lon: 51.9833928, lat: 5.9105004, scale: 0.25 },
    { fileName: "creature_1", lon: 51.9834287, lat: 5.9101768, scale: 0.5 },
    { fileName: "creature_1", lon: 51.9834675, lat: 5.9097467, scale: 1.5 },
    { fileName: "creature_1", lon: 51.9834917, lat: 5.909287, scale: 2 },
    { fileName: "creature_1", lon: 51.98331, lat: 5.908704, scale: 2.5 },
    { fileName: "creature_1", lon: 51.9832918, lat: 5.9078798, scale: 5 },
    { fileName: "creature_1", lon: 51.9832602, lat: 5.9066457, scale: 10 },
    { fileName: "creature_1", lon: 51.9831811, lat: 5.9046317, scale: 20 },
  ];

  objects.forEach((object) => {
    loader.load(`/glb_files/${object.fileName}.glb`, function (glb) {
      console.log(glb);
      console.log(`set scale: ${object.scale}`);
      const scale = object.scale;
      glb.scene.scale.setScalar(scale);
      console.log(glb.scene.scale);
      arjs.add(glb.scene, object.lon, object.lat);
    });
  });

  const geom = new THREE.BoxGeometry(20, 20, 20);
  const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const box = new THREE.Mesh(geom, mtl);
  arjs.add(box, 51.9835303, 5.9090838);

  // Create the device orientation tracker
  const deviceOrientationControls = new THREEx.DeviceOrientationControls(
    camera
  );

  // Start the GPS
  arjs.startGps();

  requestAnimationFrame(render);

  function render() {
    if (
      canvas.width != canvas.clientWidth ||
      canvas.height != canvas.clientHeight
    ) {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      const aspect = canvas.clientWidth / canvas.clientHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }

    // Update the scene using the latest sensor readings
    deviceOrientationControls.update();

    cam.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
}

main();

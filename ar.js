import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function main() {
  const canvas = document.getElementById("canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, 1.33, 0.1, 10000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  const arjs = new THREEx.LocationBased(scene, camera);
  const cam = new THREEx.WebcamRenderer(renderer);

  // Create the device orientation tracker
  const deviceOrientationControls = new THREEx.DeviceOrientationControls(
    camera
  );

  // Adding in hemisphere light to mimic natural sunlight
  const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
  scene.add(hemiLight);

  // Load in objects
  const objects = [
    { fileName: "creature_1", lat: 5.9108008, lon: 51.9829402, scale: 1.0 },
  ];

  const loader = new GLTFLoader();
  objects.forEach((object) => {
    loader.load(`/glb_files/${object.fileName}.glb`, function (glb) {
      const scale = object.scale;
      glb.scene.scale.setScalar(scale);
      arjs.add(glb.scene, object.lat, object.lon);
    });
  });

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

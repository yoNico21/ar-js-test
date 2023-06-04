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
    { fileName: "monkey", lon: 51.98348, lat: 5.906594 },
    { fileName: "creature_1", lon: 51.983467, lan: 5.908757 },
    { fileName: "monkey", lon: 51.9829284, lat: 5.9108081 },
    { fileName: "creature_1", lon: 51.982974, lan: 5.90107615 },
  ];

  objects.forEach((object) => {
    loader.load(`/glb_files/${object.fileName}.glb`, function (glb) {
      console.log(glb);
      arjs.add(glb.scene, object.lon, object.lat);
    });
  });

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

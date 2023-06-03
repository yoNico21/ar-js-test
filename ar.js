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
  const camera = new THREE.PerspectiveCamera(
    90,
    ratio.height / ratio.width,
    0.1,
    10000
  );
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  const arjs = new THREEx.LocationBased(scene, camera);
  const cam = new THREEx.WebcamRenderer(renderer);

  /* put my objects here */

  const loader = new GLTFLoader();
  loader.load("/glb_files/monkey.glb", function (glb) {
    console.log(glb);
    const root = glb.scene;
    arjs.add(root);
  });

  //const monkey = loader.load("/glb_files/monkey.glb");
  /* ------------------- */

  //arjs.add(monkey.scene, 51.9829333, 5.9108212);

  // Create the device orientation tracker
  const deviceOrientationControls = new THREEx.deviceOrientationControls(
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
      const aspect = canvas.clientHeight / canvas.clientWidth;
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

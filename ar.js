import * as THREE from "three";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex-location-only";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

function main() {
  const canvas = document.getElementById("canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, 1.33, 0.1, 10000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  const arjs = new THREEx.LocationBased(scene, camera);
  const cam = new THREEx.WebcamRenderer(renderer);

  let envmaploader = new THREE.PMREMGenerator(renderer);

  // assigning HDR
  const HDRLoader = new RGBELoader();
  HDRLoader.load("/hdr/noon_grass_8k.hdr", function (hdrmap) {
    hdrmap.mapping = THREE.EquirectangularReflectionMapping;
    let envmap = envmaploader.fromCubemap(hdrmap);
    scene.environment = envmap;

    requestAnimationFrame(render);

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
  });

  // Create the device orientation tracker
  const deviceOrientationControls = new THREEx.DeviceOrientationControls(
    camera
  );

  // Start the GPS
  arjs.startGps();

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

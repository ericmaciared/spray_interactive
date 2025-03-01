import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set a black background color
scene.background = new THREE.Color(0x000000); // Black color

// Add a spotlight for focus light effect
const spotlight = new THREE.SpotLight(0xffffff, 1);
spotlight.position.set(5, 10, 5);
spotlight.angle = Math.PI / 4;
spotlight.penumbra = 0.1;
spotlight.decay = 2;
spotlight.distance = 200;
spotlight.castShadow = true;
scene.add(spotlight);

const spotlightTarget = new THREE.Object3D();
spotlightTarget.position.set(0, 0, 0);
scene.add(spotlightTarget);
spotlight.target = spotlightTarget;

// Load GLB model
const gltfLoader = new GLTFLoader();
let model;

gltfLoader.load(
  "/pepper_spray.glb",
  (gltf) => {
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          map: child.material.map,
        }); // Use MeshBasicMaterial
      }
    });
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

let angle = 0;
let radius = 5;
let zooming = true;
camera.position.set(0, 0, radius);
camera.lookAt(0, 0, 0);

// Add event listener for mouse wheel
window.addEventListener("wheel", onScroll, { passive: false });

function onScroll(event) {
  event.preventDefault(); // Prevent the default scroll behavior
  const delta = event.deltaY * 0.005;

  if (zooming) {
    camera.position.z -= delta;
    if (camera.position.z <= 2) {
      // Adjust the threshold as needed
      zooming = false;
      camera.position.x = radius * Math.cos(angle);
      radius = camera.position.z; // Set the radius to the current camera position
    }
  } else {
    angle += delta;
    camera.position.x = radius * Math.cos(angle);
    camera.position.z = radius * Math.sin(angle);
  }
  camera.lookAt(0, 0, 0);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

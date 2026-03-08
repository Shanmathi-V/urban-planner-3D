import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

function WalkthroughViewer({ modelUrl, onClose }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    camera.position.set(0, 1.6, 0.15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const loader = new GLTFLoader();

    // loader.load(modelUrl, (gltf) => {
    //   scene.add(gltf.scene);
    // });

    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Compute model size
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Move model so center is at origin
      model.position.sub(center);

      // Position camera relative to model size
      const maxDim = Math.max(size.x, size.y, size.z);

      camera.position.set(0, size.y * 0.5, maxDim * 1.2);

      controls.getObject().position.copy(camera.position);
    });

    const controls = new PointerLockControls(camera, renderer.domElement);
    //
    scene.add(camera);

    // document.addEventListener("click", () => {
    //   controls.lock();
    // });

    renderer.domElement.addEventListener("click", () => {
      controls.lock();
    });

    const move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      lookForward: false,
    };

    const speed = 0.1;

    const keyDown = (e) => {
      switch (e.code) {
        case "KeyW":
          move.forward = true;
          break;
        case "KeyS":
          move.backward = true;
          break;
        case "KeyA":
          move.left = true;
          break;
        case "KeyD":
          move.right = true;
          break;
        case "KeyQ":
          move.up = true;
          break;
        case "KeyE":
          move.down = true;
          break;
        case "KeyR":
          move.lookForward = true;
          break;
      }
    };

    const keyUp = (e) => {
      switch (e.code) {
        case "KeyW":
          move.forward = false;
          break;
        case "KeyS":
          move.backward = false;
          break;
        case "KeyA":
          move.left = false;
          break;
        case "KeyD":
          move.right = false;
          break;
        case "KeyQ":
          move.up = false;
          break;
        case "KeyE":
          move.down = false;
          break;
        case "KeyR":
          move.lookForward = false;
          break;
      }
    };

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function animate() {
      requestAnimationFrame(animate);

      if (move.forward) controls.moveForward(speed);
      if (move.backward) controls.moveForward(-speed);
      if (move.left) controls.moveRight(-speed);
      if (move.right) controls.moveRight(speed);
      if (move.up) camera.position.y += speed;
      if (move.down) camera.position.y -= speed;
      if (move.lookForward) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        camera.position.add(direction.multiplyScalar(speed));
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      if (renderer) renderer.dispose();

      if (mountRef.current && renderer?.domElement) {
        if (mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-white px-4 py-2 rounded-lg font-semibold"
      >
        Close Walkthrough
      </button>

      <div ref={mountRef}></div>
    </div>
  );
}

export default WalkthroughViewer;

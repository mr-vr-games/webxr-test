import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/webxr/VRButton.js';
import { Sky } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/objects/Sky.js';
import { Water } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/objects/Water.js';

// シーン、カメラ、レンダラーの設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild(renderer.domElement);

// VRの設定
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local-floor');
document.body.appendChild(VRButton.createButton(renderer));

// VRモード開始ボタンのカスタマイズ
const enterVRButton = document.getElementById('enter-vr-button');
enterVRButton.addEventListener('click', async () => {
    try {
        if (!navigator.xr) {
            alert('WebXRはこのブラウザでサポートされていません。');
            return;
        }

        const session = await navigator.xr.requestSession('immersive-vr', {
            requiredFeatures: ['local-floor']
        });
        
        await renderer.xr.setSession(session);
        
        // VRセッション終了時の処理
        session.addEventListener('end', () => {
            renderer.xr.setSession(null);
        });
    } catch (error) {
        console.error('VRセッションの開始に失敗しました:', error);
        alert('VRセッションの開始に失敗しました。\n' + error.message);
    }
});

// VRセッション開始時の処理
function onSessionStarted(session) {
    renderer.xr.setSession(session);
}

// コントロールの設定（非VRモード用）
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// 環境光と平行光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// 空の設定
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

const sun = new THREE.Vector3();
const phi = THREE.MathUtils.degToRad(90 - 45);
const theta = THREE.MathUtils.degToRad(180);
sun.setFromSphericalCoords(1, phi, theta);

skyUniforms['sunPosition'].value.copy(sun);

// 草原の作成
const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x4CAF50,
    roughness: 0.8,
    metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 草原のテクスチャ
const grassTextureLoader = new THREE.TextureLoader();
grassTextureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/terrain/grasslight-big.jpg', (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(100, 100);
    groundMaterial.map = texture;
    groundMaterial.needsUpdate = true;
});

// 小さな草を追加
function addGrass() {
    const instanceCount = 5000;
    const grassGeometry = new THREE.PlaneGeometry(0.2, 0.3);
    grassGeometry.translate(0, 0.15, 0);
    
    const grassMaterial = new THREE.MeshStandardMaterial({
        color: 0x7CFC00,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    });
    
    const grassInstancedMesh = new THREE.InstancedMesh(
        grassGeometry,
        grassMaterial,
        instanceCount
    );
    
    const matrix = new THREE.Matrix4();
    
    for (let i = 0; i < instanceCount; i++) {
        const radius = 50 * Math.sqrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        
        const rotation = Math.random() * Math.PI * 2;
        const scale = 0.8 + Math.random() * 0.5;
        
        matrix.makeRotationY(rotation);
        matrix.setPosition(x, 0, z);
        matrix.scale(new THREE.Vector3(scale, scale, scale));
        
        grassInstancedMesh.setMatrixAt(i, matrix);
    }
    
    grassInstancedMesh.castShadow = true;
    grassInstancedMesh.receiveShadow = true;
    scene.add(grassInstancedMesh);
}

addGrass();

// 木を追加
function addTrees() {
    const treeCount = 30;
    
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
    trunkGeometry.translate(0, 1, 0);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.9
    });
    
    const leavesGeometry = new THREE.SphereGeometry(1, 16, 16);
    leavesGeometry.translate(0, 2.5, 0);
    const leavesMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        roughness: 0.8
    });
    
    for (let i = 0; i < treeCount; i++) {
        const radius = 40 * Math.sqrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        
        const scale = 1 + Math.random();
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 0, z);
        trunk.scale.set(scale, scale, scale);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        scene.add(trunk);
        
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(x, 0, z);
        leaves.scale.set(scale, scale, scale);
        leaves.castShadow = true;
        scene.add(leaves);
    }
}

addTrees();

// 湖を追加
function addLake() {
    const waterGeometry = new THREE.CircleGeometry(15, 32);
    
    const water = new Water(
        waterGeometry,
        {
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals: new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    
    water.rotation.x = -Math.PI / 2;
    water.position.set(-20, 0.05, 0);
    scene.add(water);
}

addLake();

// 動物（鹿）を追加
function addDeer() {
    const loader = new GLTFLoader();
    const deerPositions = [
        { x: 10, z: 15 },
        { x: 12, z: 13 },
        { x: 15, z: 10 }
    ];
    
    // ダミーの鹿（モデルが読み込めない場合のフォールバック）
    deerPositions.forEach(pos => {
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        bodyGeometry.rotateZ(Math.PI / 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(pos.x, 1.2, pos.z);
        body.castShadow = true;
        scene.add(body);
        
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(pos.x + 0.8, 1.4, pos.z);
        head.castShadow = true;
        scene.add(head);
        
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        
        [-0.3, 0.3].forEach(xOffset => {
            [-0.3, 0.3].forEach(zOffset => {
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(pos.x + xOffset, 0.5, pos.z + zOffset);
                leg.castShadow = true;
                scene.add(leg);
            });
        });
    });
    
    // 実際の鹿モデルを読み込む試み
    // loader.load('https://example.com/deer.glb', (gltf) => {
    //     const model = gltf.scene;
    //     model.scale.set(0.5, 0.5, 0.5);
    //     model.position.set(10, 0, 15);
    //     model.traverse((child) => {
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     });
    //     scene.add(model);
    // });
}

addDeer();

// 乗り物（車）を追加
function addVehicle() {
    // シンプルな車のモデル
    const carGroup = new THREE.Group();
    
    // 車体
    const bodyGeometry = new THREE.BoxGeometry(3, 0.8, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000, metalness: 0.7, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    carGroup.add(body);
    
    // キャビン
    const cabinGeometry = new THREE.BoxGeometry(1.5, 0.7, 1.4);
    const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0.2, 1.35, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);
    
    // タイヤ
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    wheelGeometry.rotateX(Math.PI / 2);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.7 });
    
    const wheelPositions = [
        { x: -1, y: 0.3, z: 0.8 },
        { x: -1, y: 0.3, z: -0.8 },
        { x: 1, y: 0.3, z: 0.8 },
        { x: 1, y: 0.3, z: -0.8 }
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.castShadow = true;
        carGroup.add(wheel);
    });
    
    carGroup.position.set(15, 0, -15);
    scene.add(carGroup);
    
    // 実際の車モデルを読み込む試み
    // const loader = new GLTFLoader();
    // loader.load('https://example.com/car.glb', (gltf) => {
    //     const model = gltf.scene;
    //     model.scale.set(0.5, 0.5, 0.5);
    //     model.position.set(15, 0, -15);
    //     model.traverse((child) => {
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     });
    //     scene.add(model);
    // });
}

addVehicle();

// リサイズ対応
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// アニメーションループ
renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
}); 
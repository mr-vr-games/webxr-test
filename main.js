import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

// シーン、カメラ、レンダラーの初期化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

// カスタムVRボタン
const enterVRButton = document.getElementById('enter-vr-button');

// OrbitControlsの設定（非VRモード用）
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.6, 0);
controls.update();

// WebXRの設定
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local-floor');

// VRセッション開始ボタンの設定
if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
            enterVRButton.disabled = false;
            enterVRButton.addEventListener('click', onEnterVR);
        } else {
            enterVRButton.textContent = 'VRはサポートされていません';
        }
    });
} else {
    enterVRButton.textContent = 'WebXRはサポートされていません';
}

function onEnterVR() {
    navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor']
    }).then(onSessionStarted, onRequestSessionError);
}

function onSessionStarted(session) {
    enterVRButton.style.display = 'none';
    renderer.xr.setSession(session);
    session.addEventListener('end', onSessionEnded);
    setupVRControllers();
}

function onRequestSessionError(error) {
    console.error('VRセッション開始エラー:', error);
    enterVRButton.textContent = 'VRセッションエラー';
}

function onSessionEnded() {
    enterVRButton.style.display = 'block';
}

// カメラ初期位置
camera.position.set(0, 1.6, 5);

// ライティング
setupLighting();

// 地形と環境の作成
createTerrain();
createSkybox();
createTrees();
createGrass();
createAnimals();
createVehicle();

// VRコントローラーの設定
let controller1, controller2;
let controllerGrip1, controllerGrip2;
const controllerModelFactory = new XRControllerModelFactory();

// コントローラー移動関連の変数
const playerVelocity = new THREE.Vector3();
const tempVector = new THREE.Vector3();
const moveSpeed = 2.0;
const rotationSpeed = 0.05;

function setupVRControllers() {
    // コントローラー1
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('connected', function(event) {
        controller1.userData.gamepad = event.data.gamepad;
    });
    controller1.addEventListener('disconnected', function() {
        controller1.userData.gamepad = null;
    });
    scene.add(controller1);

    // コントローラー1のグリップ
    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    // コントローラー2
    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('connected', function(event) {
        controller2.userData.gamepad = event.data.gamepad;
    });
    controller2.addEventListener('disconnected', function() {
        controller2.userData.gamepad = null;
    });
    scene.add(controller2);

    // コントローラー2のグリップ
    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    // コントローラーの視覚化
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
    ]);
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    const line = new THREE.Line(geometry, material);
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());
}

// 照明のセットアップ
function setupLighting() {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 太陽光（方向光）
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    scene.add(sunLight);

    // 柔らかい補助光
    const fillLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 0.5);
    scene.add(fillLight);
}

// 地形の作成
function createTerrain() {
    // 起伏のある地形を作成
    const terrainSize = 300;
    const resolution = 300;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, resolution, resolution);
    
    // 頂点を操作して起伏を作る
    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        
        // Simplex Noiseのような効果を単純化して実装
        const distance = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        let height = Math.sin(vertex.x * 0.05) * Math.cos(vertex.y * 0.05) * 2;
        height += Math.sin(vertex.x * 0.01) * Math.cos(vertex.y * 0.01) * 5;
        
        // 中央部を少し高くする
        const centerBoost = Math.max(0, 1 - distance / 50);
        height += centerBoost * 2;
        
        vertex.z = height;
        position.setXYZ(i, vertex.x, vertex.z, vertex.y); // Planeは通常XY平面上にあるので、YとZを入れ替える
    }
    
    // 法線を再計算
    geometry.computeVertexNormals();
    
    // 地形のマテリアル
    const groundTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    
    const terrainMaterial = new THREE.MeshStandardMaterial({
        map: groundTexture,
        roughness: 0.8,
        metalness: 0.1,
    });
    
    const terrain = new THREE.Mesh(geometry, terrainMaterial);
    terrain.rotation.x = -Math.PI / 2; // 水平にする
    terrain.receiveShadow = true;
    scene.add(terrain);
}

// スカイボックスの作成
function createSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        'https://threejs.org/examples/textures/cube/pisa/px.png',
        'https://threejs.org/examples/textures/cube/pisa/nx.png',
        'https://threejs.org/examples/textures/cube/pisa/py.png',
        'https://threejs.org/examples/textures/cube/pisa/ny.png',
        'https://threejs.org/examples/textures/cube/pisa/pz.png',
        'https://threejs.org/examples/textures/cube/pisa/nz.png'
    ]);
    scene.background = texture;
}

// 木の作成
function createTrees() {
    // シンプルな木のモデルを作成
    for (let i = 0; i < 50; i++) {
        createTree(
            Math.random() * 100 - 50,
            0,
            Math.random() * 100 - 50,
            Math.random() * 0.5 + 0.5
        );
    }
}

function createTree(x, y, z, scale) {
    // 幹
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, y + 1, z);
    trunk.scale.set(scale, scale, scale);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);

    // 葉
    const leavesGeometry = new THREE.ConeGeometry(1.5, 3, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(x, y + 3 * scale, z);
    leaves.scale.set(scale, scale, scale);
    leaves.castShadow = true;
    scene.add(leaves);
}

// 草の作成
function createGrass() {
    // インスタンス化されたグラスパッチの作成
    const grassCount = 10000;
    const grassGeometry = new THREE.PlaneGeometry(1, 1);
    const grassTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-small.jpg');
    const grassMaterial = new THREE.MeshStandardMaterial({
        map: grassTexture,
        alphaTest: 0.8,
        side: THREE.DoubleSide,
        color: 0x88ff88,
    });

    // インスタンス用のメッシュを作成
    const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, grassCount);
    
    // 一時的な行列とベクトル
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    // 各草のインスタンスを配置
    for (let i = 0; i < grassCount; i++) {
        position.x = Math.random() * 100 - 50;
        position.y = 0.5;
        position.z = Math.random() * 100 - 50;
        
        // ランダムな回転
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
        
        // ランダムなスケール
        const grassHeight = Math.random() * 0.5 + 0.3;
        scale.set(0.3, grassHeight, 0.3);
        
        // 行列を作成してインスタンスに設定
        matrix.compose(position, quaternion, scale);
        grass.setMatrixAt(i, matrix);
    }
    
    grass.castShadow = true;
    grass.receiveShadow = true;
    scene.add(grass);
}

// 動物の作成
function createAnimals() {
    // いくつかのシンプルな動物を作成
    createDeer(10, 0, 15);
    createDeer(-15, 0, 20);
    createDeer(5, 0, -10);
    
    createRabbit(5, 0, 5);
    createRabbit(-8, 0, -8);
    createRabbit(12, 0, -15);
    createRabbit(-20, 0, 5);
}

function createDeer(x, y, z) {
    // 鹿の体
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
    bodyGeometry.rotateZ(Math.PI / 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.8 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(x, y + 1.2, z);
    body.castShadow = true;
    scene.add(body);

    // 頭
    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.8 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(x + 0.8, y + 1.5, z);
    head.castShadow = true;
    scene.add(head);

    // 脚
    createLeg(x - 0.4, y, z - 0.2);
    createLeg(x - 0.4, y, z + 0.2);
    createLeg(x + 0.4, y, z - 0.2);
    createLeg(x + 0.4, y, z + 0.2);

    // 角
    createAntler(x + 0.8, y + 1.8, z - 0.1);
    createAntler(x + 0.8, y + 1.8, z + 0.1);
}

function createLeg(x, y, z) {
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y + 0.5, z);
    leg.castShadow = true;
    scene.add(leg);
}

function createAntler(x, y, z) {
    const antlerGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    antlerGeometry.rotateX(Math.PI / 4);
    const antlerMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.7 });
    const antler = new THREE.Mesh(antlerGeometry, antlerMaterial);
    antler.position.set(x, y, z);
    antler.castShadow = true;
    scene.add(antler);
}

function createRabbit(x, y, z) {
    // ウサギの体
    const bodyGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.9 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(x, y + 0.3, z);
    body.castShadow = true;
    scene.add(body);

    // 頭
    const headGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.9 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(x, y + 0.6, z + 0.3);
    head.castShadow = true;
    scene.add(head);

    // 耳
    createEar(x - 0.1, y + 0.8, z + 0.3);
    createEar(x + 0.1, y + 0.8, z + 0.3);
}

function createEar(x, y, z) {
    const earGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const earMaterial = new THREE.MeshStandardMaterial({ color: 0xFFDEAD, roughness: 0.8 });
    const ear = new THREE.Mesh(earGeometry, earMaterial);
    ear.position.set(x, y, z);
    ear.castShadow = true;
    scene.add(ear);
}

// 乗り物の作成
function createVehicle() {
    const vehicle = new THREE.Group();
    
    // 車体
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3366CC, metalness: 0.6, roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    vehicle.add(body);
    
    // キャビン
    const cabinGeometry = new THREE.BoxGeometry(1, 0.5, 0.8);
    const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x3366CC, metalness: 0.6, roughness: 0.4 });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0.2, 1, 0);
    cabin.castShadow = true;
    vehicle.add(cabin);
    
    // タイヤ
    createWheel(-0.6, 0.3, -0.5, vehicle);
    createWheel(-0.6, 0.3, 0.5, vehicle);
    createWheel(0.6, 0.3, -0.5, vehicle);
    createWheel(0.6, 0.3, 0.5, vehicle);
    
    // ヘッドライト
    const headlightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 0.5 });
    
    const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight1.position.set(-1, 0.5, -0.3);
    vehicle.add(headlight1);
    
    const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight2.position.set(-1, 0.5, 0.3);
    vehicle.add(headlight2);
    
    // 車を配置
    vehicle.position.set(-5, 0, 10);
    scene.add(vehicle);
}

function createWheel(x, y, z, parent) {
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    wheelGeometry.rotateZ(Math.PI / 2);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    parent.add(wheel);
}

// リサイズハンドラー
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 描画ループ
renderer.setAnimationLoop(render);

function render(timestamp, frame) {
    // VRコントローラーでの移動
    if (renderer.xr.isPresenting) {
        updateControllerInput();
    }
    
    renderer.render(scene, camera);
}

function updateControllerInput() {
    // 左コントローラーのジョイスティック入力を取得
    if (controller1 && controller1.userData.gamepad) {
        const gamepad = controller1.userData.gamepad;
        
        // ジョイスティックの値を取得
        const axes = gamepad.axes;
        
        if (axes.length >= 2) {
            const xAxis = axes[0]; // 左右移動
            const yAxis = axes[1]; // 前後移動
            
            // 移動ベクトルを計算
            // カメラの向きに基づいて移動方向を設定
            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection);
            
            // 前後移動（カメラの向き）
            tempVector.copy(cameraDirection).multiplyScalar(-yAxis * moveSpeed);
            playerVelocity.add(tempVector);
            
            // 左右移動（カメラの向きに直交）
            tempVector.copy(cameraDirection).cross(camera.up).normalize().multiplyScalar(xAxis * moveSpeed);
            playerVelocity.add(tempVector);
            
            // 実際の移動を適用
            const deltaTime = renderer.xr.getSession().renderState.baseLayer.framebufferWidth ? 1/90 : 1/60; // VRは通常90Hz
            camera.position.add(playerVelocity.clone().multiplyScalar(deltaTime));
            
            // 減衰（滑らかな動き）
            playerVelocity.multiplyScalar(0.7);
        }
    }
    
    // 右コントローラーのジョイスティック入力で回転
    if (controller2 && controller2.userData.gamepad) {
        const gamepad = controller2.userData.gamepad;
        
        // ジョイスティックの値を取得
        const axes = gamepad.axes;
        
        if (axes.length >= 2) {
            const xAxis = axes[0]; // 左右回転
            
            // カメラを回転させる
            if (Math.abs(xAxis) > 0.1) {
                // カメラだけを回転させるのではなく、カメラの親オブジェクトを回転させる
                camera.rotateY(-xAxis * rotationSpeed);
            }
        }
    }
} 
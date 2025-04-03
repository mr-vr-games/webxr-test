// シーン、カメラ、レンダラーの初期化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('container').appendChild(renderer.domElement);

// VR設定
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local-floor');

// VRボタンの設定
const vrButton = document.getElementById('vrButton');
vrButton.addEventListener('click', () => {
    renderer.xr.getSession() ? renderer.xr.end() : startVR();
});

// VRセッションを開始する関数
async function startVR() {
    try {
        const session = await navigator.xr.requestSession('immersive-vr', {
            requiredFeatures: ['local-floor']
        });
        
        session.addEventListener('end', () => {
            console.log('VRセッションが終了しました');
        });
        
        renderer.xr.setSession(session);
    } catch (error) {
        console.error('VRセッションの開始に失敗しました:', error);
        alert('VRデバイスが接続されていないか、ブラウザがWebXRに対応していません。');
    }
}

// コントローラーの設定
const controllerModelFactory = new THREE.XRControllerModelFactory();
const controllers = [];
const controllerGrips = [];

// コントローラー1
const controller1 = renderer.xr.getController(0);
scene.add(controller1);
controllers.push(controller1);

const controllerGrip1 = renderer.xr.getControllerGrip(0);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
scene.add(controllerGrip1);
controllerGrips.push(controllerGrip1);

// コントローラー2
const controller2 = renderer.xr.getController(1);
scene.add(controller2);
controllers.push(controller2);

const controllerGrip2 = renderer.xr.getControllerGrip(1);
controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
scene.add(controllerGrip2);
controllerGrips.push(controllerGrip2);

// 移動速度
const moveSpeed = 0.05;
let moveForward = 0;
let moveRight = 0;

// コントローラーイベントの設定
controller1.addEventListener('connected', (event) => {
    setupController(controller1, event.data);
});

controller2.addEventListener('connected', (event) => {
    setupController(controller2, event.data);
});

function setupController(controller, data) {
    controller.userData.gamepad = data.gamepad;
}

// 環境光の設定
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 平行光源（太陽光）の設定
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
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

// 空の作成
const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x87ceeb,
    side: THREE.BackSide
});
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// 太陽の作成
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(100, 100, -100);
scene.add(sun);

// 地面の作成
const groundSize = 500;
const groundSegments = 100;
const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, groundSegments, groundSegments);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7cfc00,
    roughness: 0.8,
    metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 草の生成
function createGrass() {
    const instanceCount = 50000;
    const grassGeometry = new THREE.PlaneGeometry(0.1, 0.3);
    grassGeometry.translate(0, 0.15, 0);
    const grassMaterial = new THREE.MeshStandardMaterial({
        color: 0x4caf50,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    });

    const grass = new THREE.InstancedMesh(grassGeometry, grassMaterial, instanceCount);
    grass.castShadow = true;
    grass.receiveShadow = true;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    // 地面の範囲内にランダムに草を配置
    const spread = groundSize / 2 - 5;
    
    for (let i = 0; i < instanceCount; i++) {
        position.x = Math.random() * 2 * spread - spread;
        position.z = Math.random() * 2 * spread - spread;
        position.y = 0;
        
        // ランダムな回転
        quaternion.setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.random() * Math.PI
        );
        
        // サイズのバリエーション
        const size = 0.7 + Math.random() * 0.5;
        scale.set(size, size, size);
        
        matrix.compose(position, quaternion, scale);
        grass.setMatrixAt(i, matrix);
    }

    scene.add(grass);
}

// 木の生成
function createTrees() {
    const treeCount = 100;
    
    for (let i = 0; i < treeCount; i++) {
        // 木の幹
        const trunkHeight = 1 + Math.random() * 3;
        const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        
        // 木の葉
        const leavesSize = 0.8 + Math.random() * 1.2;
        const leavesGeometry = new THREE.SphereGeometry(leavesSize, 8, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        
        // 位置の設定
        const spread = groundSize / 2 - 10;
        trunk.position.x = Math.random() * 2 * spread - spread;
        trunk.position.z = Math.random() * 2 * spread - spread;
        trunk.position.y = trunkHeight / 2;
        
        leaves.position.y = trunkHeight + leavesSize * 0.5;
        
        // 影の設定
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        
        // 木をシーンに追加
        const tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leaves);
        scene.add(tree);
    }
}

// 動物の作成（簡易的な）
function createAnimals() {
    const animalCount = 20;
    
    for (let i = 0; i < animalCount; i++) {
        // 動物のタイプ（0: 鹿、1: うさぎ）
        const type = Math.floor(Math.random() * 2);
        
        const animal = new THREE.Group();
        
        if (type === 0) { // 鹿
            // 胴体
            const bodyGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.5;
            animal.add(body);
            
            // 頭
            const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.set(0.4, 0.7, 0);
            animal.add(head);
            
            // 足
            for (let j = 0; j < 4; j++) {
                const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
                const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.y = 0.25;
                
                if (j === 0) leg.position.set(0.2, 0.25, 0.15);
                else if (j === 1) leg.position.set(0.2, 0.25, -0.15);
                else if (j === 2) leg.position.set(-0.2, 0.25, 0.15);
                else leg.position.set(-0.2, 0.25, -0.15);
                
                animal.add(leg);
            }
        } else { // うさぎ
            // 胴体
            const bodyGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.y = 0.2;
            animal.add(body);
            
            // 頭
            const headGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.set(0.15, 0.35, 0);
            animal.add(head);
            
            // 耳
            for (let j = 0; j < 2; j++) {
                const earGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8);
                const earMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
                const ear = new THREE.Mesh(earGeometry, earMaterial);
                ear.position.set(0.15, 0.5, j === 0 ? 0.05 : -0.05);
                animal.add(ear);
            }
        }
        
        // 影の設定
        animal.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        
        // 位置の設定
        const spread = groundSize / 2 - 30;
        animal.position.x = Math.random() * 2 * spread - spread;
        animal.position.z = Math.random() * 2 * spread - spread;
        animal.rotation.y = Math.random() * Math.PI * 2;
        
        scene.add(animal);
    }
}

// 乗り物の作成
function createVehicle() {
    // 簡単な車
    const car = new THREE.Group();
    
    // 車体
    const bodyGeometry = new THREE.BoxGeometry(3, 1, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    car.add(body);
    
    // 屋根
    const roofGeometry = new THREE.BoxGeometry(1.5, 0.7, 1.4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(-0.2, 1.35, 0);
    car.add(roof);
    
    // タイヤ
    const wheelPositions = [
        [0.8, 0.3, 0.8],  // 右前
        [0.8, 0.3, -0.8], // 左前
        [-0.8, 0.3, 0.8], // 右後
        [-0.8, 0.3, -0.8] // 左後
    ];
    
    for (const position of wheelPositions) {
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
        wheelGeometry.rotateX(Math.PI / 2);
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(...position);
        car.add(wheel);
    }
    
    // 影の設定
    car.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
    
    // 位置の設定
    car.position.set(10, 0, 10);
    scene.add(car);
}

// リサイズハンドラー
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 非VRモード用のコントロール
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// 環境の作成
createGrass();
createTrees();
createAnimals();
createVehicle();

// アニメーションループ
function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    // コントローラーの状態を確認して移動を制御
    controllers.forEach(controller => {
        if (controller.userData.gamepad) {
            const axes = controller.userData.gamepad.axes;
            
            if (axes.length >= 4) {
                // 右コントローラーのジョイスティック
                if (controller === controller1) {
                    moveForward = -axes[3] * moveSpeed;
                    moveRight = axes[2] * moveSpeed;
                }
            }
        }
    });
    
    // カメラの向きに基づいて移動方向を計算
    if (moveForward !== 0 || moveRight !== 0) {
        const camera = renderer.xr.isPresenting ? renderer.xr.getCamera() : camera;
        
        const direction = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        
        // カメラの向きを取得
        camera.getWorldQuaternion(quaternion);
        
        // 前後方向の移動
        direction.set(0, 0, moveForward);
        direction.applyQuaternion(quaternion);
        camera.position.add(direction);
        
        // 左右方向の移動
        direction.set(moveRight, 0, 0);
        direction.applyQuaternion(quaternion);
        camera.position.add(direction);
        
        // 高さ（Y座標）を固定
        camera.position.y = 1.6;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate(); 
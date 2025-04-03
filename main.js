// シーン、カメラ、レンダラーの初期化
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // 空色の背景

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('container').appendChild(renderer.domElement);

// デバッグ情報
const debugElement = document.getElementById('debug');
function updateDebugInfo(message) {
    debugElement.innerHTML = message;
}

// 初期デバッグ情報
updateDebugInfo('WebXR準備中...<br>ブラウザ: ' + navigator.userAgent);

// WebXRが使用可能かチェック
if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        updateDebugInfo('WebXR VR対応: ' + (supported ? 'はい' : 'いいえ') + '<br>ブラウザ: ' + navigator.userAgent);
    });
} else {
    updateDebugInfo('WebXRはこのブラウザでサポートされていません。<br>ブラウザ: ' + navigator.userAgent);
}

// VR設定
renderer.xr.enabled = true;
try {
    renderer.xr.setReferenceSpaceType('local-floor');
    console.log('local-floor 参照空間が設定されました');
} catch (error) {
    console.error('参照空間の設定に失敗しました:', error);
    updateDebugInfo('参照空間の設定に失敗しました: ' + error.message);
}

// Three.jsのVRボタンを使用（既存のボタンは非表示にする）
if (typeof THREE.VRButton !== 'undefined') {
    document.getElementById('vrButton').style.display = 'none';
    document.body.appendChild(THREE.VRButton.createButton(renderer));
    console.log('Three.jsのVRButtonを使用します');
} else {
    console.log('Three.jsのVRButtonが見つかりません、カスタムボタンを使用します');
    // カスタムVRボタンの設定
    const vrButton = document.getElementById('vrButton');
    vrButton.addEventListener('click', () => {
        if (renderer.xr.isPresenting) {
            renderer.xr.getSession().end();
        } else {
            startVR();
        }
    });
}

// 初期位置の設定
let initialPositionSet = false;
const playerStartPosition = new THREE.Vector3(0, 0, 0);

// カメラ位置の調整
function adjustCameraPosition() {
    // ユーザーを正面に向ける
    camera.lookAt(new THREE.Vector3(0, camera.position.y, -10));
    
    // 良いスタート位置に設定
    camera.position.set(0, 1.6, 5);
    
    // 地面の上に配置
    controls.target.set(0, 1, -5);
    controls.update();
}

// 初期位置の調整
adjustCameraPosition();

// VRセッションを開始する関数
async function startVR() {
    if (!navigator.xr) {
        updateDebugInfo('WebXRはこのブラウザでサポートされていません。');
        return;
    }

    try {
        // 機能が利用可能か確認
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (!isSupported) {
            updateDebugInfo('VRモードはこのデバイスでサポートされていません。');
            return;
        }

        updateDebugInfo('VRセッション開始中...');
        
        const session = await navigator.xr.requestSession('immersive-vr', {
            requiredFeatures: ['local-floor'],
            optionalFeatures: ['hand-tracking']
        });
        
        session.addEventListener('end', () => {
            console.log('VRセッションが終了しました');
            updateDebugInfo('VRセッションが終了しました');
        });
        
        // レンダラーにセッションを設定
        await renderer.xr.setSession(session);
        console.log('VRセッションが開始されました');
        updateDebugInfo('VRセッションが開始されました');
        
        // 初期位置をリセット
        initialPositionSet = false;
    } catch (error) {
        console.error('VRセッションの開始に失敗しました:', error);
        updateDebugInfo('VRセッションの開始に失敗しました: ' + error.message);
        alert('VRデバイスの接続に問題があるか、ブラウザがWebXRに完全に対応していません。');
    }
}

// コントローラーの設定
let controllerModelFactory;
try {
    controllerModelFactory = new THREE.XRControllerModelFactory();
} catch (error) {
    console.error('XRControllerModelFactoryの初期化に失敗しました:', error);
}

const controllers = [];
const controllerGrips = [];

// コントローラー1
const controller1 = renderer.xr.getController(0);
controller1.addEventListener('connected', (event) => {
    setupController(controller1, event.data);
});
controller1.addEventListener('disconnected', () => {
    console.log('コントローラー1が切断されました');
});
scene.add(controller1);
controllers.push(controller1);

// コントローラー2
const controller2 = renderer.xr.getController(1);
controller2.addEventListener('connected', (event) => {
    setupController(controller2, event.data);
});
controller2.addEventListener('disconnected', () => {
    console.log('コントローラー2が切断されました');
});
scene.add(controller2);
controllers.push(controller2);

// コントローラーグリップ（モデル表示）の設定
if (controllerModelFactory) {
    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);
    controllerGrips.push(controllerGrip1);

    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
    controllerGrips.push(controllerGrip2);
}

// 移動速度
const moveSpeed = 0.05;
let moveForward = 0;
let moveRight = 0;

function setupController(controller, data) {
    console.log('コントローラーが接続されました', data);
    updateDebugInfo('コントローラーが接続されました<br>タイプ: ' + data.handedness);
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
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffcc,
    emissive: 0xffffcc,
    emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(100, 100, -100);

// 太陽からの光
const sunLight = new THREE.PointLight(0xffffcc, 1, 1000);
sunLight.position.copy(sun.position);
scene.add(sunLight);

// 太陽の周りに光る効果
const sunGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
        map: createSunTexture(),
        color: 0xffffee,
        transparent: true,
        blending: THREE.AdditiveBlending
    })
);
sunGlow.scale.set(30, 30, 1);
sun.add(sunGlow);
scene.add(sun);

// 太陽のテクスチャ生成
function createSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    // グラデーション作成
    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    
    gradient.addColorStop(0, 'rgba(255,255,220,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,180,0.8)');
    gradient.addColorStop(0.7, 'rgba(255,255,180,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,180,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

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

function render(time, frame) {
    // フレーム情報を表示
    if (frame && renderer.xr.isPresenting) {
        const session = renderer.xr.getSession();
        if (session) {
            const referenceSpace = renderer.xr.getReferenceSpace();
            if (referenceSpace) {
                const pose = frame.getViewerPose(referenceSpace);
                if (pose) {
                    // デバッグ情報を更新
                    const position = pose.transform.position;
                    updateDebugInfo(`
                        VRセッション進行中<br>
                        位置: X=${position.x.toFixed(2)}, Y=${position.y.toFixed(2)}, Z=${position.z.toFixed(2)}<br>
                        コントローラー: ${controllers.length}台<br>
                        時間: ${(time/1000).toFixed(1)}秒
                    `);
                    
                    // 初期位置の設定（最初のフレームのみ）
                    if (!initialPositionSet) {
                        console.log('VR初期位置を設定');
                        playerStartPosition.copy(position);
                        initialPositionSet = true;
                    }
                }
            }
            
            // ゲームパッドの取得
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            
            controllers.forEach((controller, i) => {
                if (controller.userData.gamepad !== undefined) {
                    // コントローラーのゲームパッドを取得
                    const gamepad = gamepads[i] || controller.userData.gamepad;
                    
                    if (gamepad && gamepad.axes && gamepad.axes.length >= 4) {
                        // コントローラーのジョイスティック入力を取得
                        if (i === 0) { // 右コントローラー
                            // ゲームパッドの値を -1.0 から 1.0 に正規化し、moveSpeedをかける
                            moveForward = -gamepad.axes[3] * moveSpeed; // 前後（上下）
                            moveRight = gamepad.axes[2] * moveSpeed;    // 左右
                        }
                    }
                }
            });
        }
    } else {
        // 非VRモードのデバッグ情報
        if (time % 500 < 100) { // 500msごとに更新して負荷を減らす
            updateDebugInfo(`
                非VRモード<br>
                カメラ位置: X=${camera.position.x.toFixed(2)}, Y=${camera.position.y.toFixed(2)}, Z=${camera.position.z.toFixed(2)}<br>
                時間: ${(time/1000).toFixed(1)}秒<br>
                VR開始ボタンをクリックしてVRモードに入ります
            `);
        }
    }
    
    // カメラの向きに基づいて移動方向を計算
    if (moveForward !== 0 || moveRight !== 0) {
        // XRカメラか通常カメラのどちらかを使用
        const cameraToUse = renderer.xr.isPresenting ? renderer.xr.getCamera() : camera;
        
        const direction = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        
        // カメラの向きを取得
        cameraToUse.getWorldQuaternion(quaternion);
        
        // 前後方向の移動
        direction.set(0, 0, moveForward);
        direction.applyQuaternion(quaternion);
        cameraToUse.position.add(direction);
        
        // 左右方向の移動
        direction.set(moveRight, 0, 0);
        direction.applyQuaternion(quaternion);
        cameraToUse.position.add(direction);
        
        // 高さ（Y座標）を固定
        cameraToUse.position.y = 1.6;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate(); 
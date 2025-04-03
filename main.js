let camera, scene, renderer, controller1, controller2;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let velocity = new THREE.Vector3();

// 草原のテクスチャ
const grassTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(100, 100);

// 木のテクスチャ
const treeTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/trees/tree.png');

// 動物のテクスチャ
const deerTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/animals/deer.png');

init();
animate();
render();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // 空色の背景

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local-floor');
    document.body.appendChild(renderer.domElement);

    // 地面の作成
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        map: grassTexture,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 木の作成
    for (let i = 0; i < 20; i++) {
        const tree = createTree();
        tree.position.x = (Math.random() - 0.5) * 80;
        tree.position.z = (Math.random() - 0.5) * 80;
        scene.add(tree);
    }

    // 動物の作成
    for (let i = 0; i < 5; i++) {
        const deer = createDeer();
        deer.position.x = (Math.random() - 0.5) * 60;
        deer.position.z = (Math.random() - 0.5) * 60;
        scene.add(deer);
    }

    // ライトの設定
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // コントローラーの設定
    controller1 = renderer.xr.getController(0);
    controller2 = renderer.xr.getController(1);
    scene.add(controller1);
    scene.add(controller2);

    // コントローラーのイベントリスナー
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);

    window.addEventListener('resize', onWindowResize, false);
}

function createTree() {
    const tree = new THREE.Group();
    
    // 幹
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 5, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f10 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    // 葉
    const leavesGeometry = new THREE.ConeGeometry(3, 6, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 4;
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    tree.add(leaves);

    return tree;
}

function createDeer() {
    const deer = new THREE.Group();
    
    // 体
    const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    deer.add(body);

    // 首
    const neckGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const neckMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0.5, 0.5, 1);
    neck.rotation.x = Math.PI / 4;
    neck.castShadow = true;
    neck.receiveShadow = true;
    deer.add(neck);

    // 頭
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(1, 1, 1.5);
    head.castShadow = true;
    head.receiveShadow = true;
    deer.add(head);

    return deer;
}

function onSelectStart() {
    this.userData.isSelecting = true;
}

function onSelectEnd() {
    this.userData.isSelecting = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    // コントローラーの入力に基づいて移動
    const moveSpeed = 0.1;
    
    if (controller1.userData.isSelecting) {
        const stick = controller1.gamepad;
        if (stick) {
            if (stick.axes[0] > 0.5) moveRight = true;
            else if (stick.axes[0] < -0.5) moveLeft = true;
            else {
                moveRight = false;
                moveLeft = false;
            }
            
            if (stick.axes[1] > 0.5) moveForward = true;
            else if (stick.axes[1] < -0.5) moveBackward = true;
            else {
                moveForward = false;
                moveBackward = false;
            }
        }
    }

    // 移動の適用
    velocity.x -= velocity.x * 10.0 * 0.016;
    velocity.z -= velocity.z * 10.0 * 0.016;

    if (moveForward) velocity.z -= moveSpeed;
    if (moveBackward) velocity.z += moveSpeed;
    if (moveLeft) velocity.x -= moveSpeed;
    if (moveRight) velocity.x += moveSpeed;

    camera.translateX(velocity.x);
    camera.translateZ(velocity.z);

    renderer.render(scene, camera);
} 
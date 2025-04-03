import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

class VRScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        this.renderer.xr.setReferenceSpaceType('local-floor');
        document.body.appendChild(this.renderer.domElement);

        // VRボタンの追加
        document.body.appendChild(VRButton.createButton(this.renderer));

        // コントローラーの設定
        this.controllerModelFactory = new XRControllerModelFactory();
        this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
        this.controllerGrip1.add(this.controllerModelFactory.createControllerModel(this.controllerGrip1));
        this.scene.add(this.controllerGrip1);

        this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
        this.controllerGrip2.add(this.controllerModelFactory.createControllerModel(this.controllerGrip2));
        this.scene.add(this.controllerGrip2);

        // 環境の設定
        this.setupEnvironment();
        
        // イベントリスナーの設定
        this.setupEventListeners();
        
        // アニメーションループの開始
        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    setupEnvironment() {
        // 空の設定
        const skyColor = new THREE.Color(0x87CEEB);
        this.scene.background = skyColor;

        // 地面の作成
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3a7e3a,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // 草の追加
        this.addGrass();

        // 木の追加
        this.addTrees();

        // 動物の追加
        this.addAnimals();

        // 乗り物の追加
        this.addVehicles();

        // ライトの設定
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    addGrass() {
        const grassCount = 1000;
        const grassGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });

        for (let i = 0; i < grassCount; i++) {
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.position.x = (Math.random() - 0.5) * 100;
            grass.position.z = (Math.random() - 0.5) * 100;
            grass.rotation.x = Math.random() * Math.PI;
            grass.rotation.z = Math.random() * Math.PI;
            this.scene.add(grass);
        }
    }

    addTrees() {
        const treeCount = 20;
        for (let i = 0; i < treeCount; i++) {
            const tree = this.createTree();
            tree.position.x = (Math.random() - 0.5) * 80;
            tree.position.z = (Math.random() - 0.5) * 80;
            this.scene.add(tree);
        }
    }

    createTree() {
        const tree = new THREE.Group();

        // 幹
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f10 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2.5;
        tree.add(trunk);

        // 葉
        const leavesGeometry = new THREE.ConeGeometry(3, 4, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 7;
        tree.add(leaves);

        return tree;
    }

    addAnimals() {
        // 鹿の追加
        const deerGeometry = new THREE.BoxGeometry(1, 2, 1);
        const deerMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const deer = new THREE.Mesh(deerGeometry, deerMaterial);
        deer.position.set(10, 1, 10);
        this.scene.add(deer);

        // 鳥の追加
        const birdGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const birdMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const bird = new THREE.Mesh(birdGeometry, birdMaterial);
        bird.position.set(5, 5, 5);
        this.scene.add(bird);
    }

    addVehicles() {
        // 車の追加
        const carGeometry = new THREE.BoxGeometry(2, 1, 4);
        const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const car = new THREE.Mesh(carGeometry, carMaterial);
        car.position.set(-10, 0.5, -10);
        this.scene.add(car);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.controllerGrip1.addEventListener('selectstart', this.onSelectStart.bind(this));
        this.controllerGrip1.addEventListener('selectend', this.onSelectEnd.bind(this));
        this.controllerGrip2.addEventListener('selectstart', this.onSelectStart.bind(this));
        this.controllerGrip2.addEventListener('selectend', this.onSelectEnd.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onSelectStart(event) {
        const controller = event.target;
        const movementSpeed = 0.1;
        
        // コントローラーのジョイスティックの値を取得
        const gamepad = controller.inputSource.gamepad;
        if (gamepad) {
            const axes = gamepad.axes;
            if (axes) {
                this.camera.position.x += axes[0] * movementSpeed;
                this.camera.position.z += axes[1] * movementSpeed;
            }
        }
    }

    onSelectEnd() {
        // 選択終了時の処理
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

// シーンの初期化
const vrScene = new VRScene(); 
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/webxr/VRButton.js';
import { Sky } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/objects/Sky.js';
import { Water } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/objects/Water.js';

// ログ表示用の関数
function log(message) {
    try {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) {
            console.error('ログコンテナが見つかりません');
            return;
        }
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
        console.log(message); // コンソールにも出力
    } catch (error) {
        console.error('ログ出力中にエラーが発生しました:', error);
    }
}

// ステータスメッセージ表示用の関数
function showStatus(message, duration = 3000) {
    try {
        const statusMessage = document.getElementById('status-message');
        if (!statusMessage) {
            console.error('ステータスメッセージ要素が見つかりません');
            return;
        }
        statusMessage.textContent = message;
        statusMessage.style.display = 'block';
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, duration);
    } catch (error) {
        console.error('ステータスメッセージ表示中にエラーが発生しました:', error);
    }
}

// DOMContentLoadedイベントで初期化を開始
document.addEventListener('DOMContentLoaded', () => {
    log('DOMの読み込みが完了しました');
    initialize();
});

// 初期化関数
function initialize() {
    try {
        log('アプリケーションを初期化しています...');

        // シーン、カメラ、レンダラーの設定
        const scene = new THREE.Scene();
        log('シーンを作成しました');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.6, 5);
        log('カメラを設定しました');

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.5;
        document.body.appendChild(renderer.domElement);
        log('レンダラーを設定しました');

        // VRの設定
        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType('local-floor');
        log('WebXRを有効化しました');

        // VRボタンの作成と追加（正しい位置に配置）
        try {
            const vrButton = VRButton.createButton(renderer);
            // スタイルを追加してボタンを目立たせる
            vrButton.style.position = 'absolute';
            vrButton.style.bottom = '80px'; // enter-vr-buttonの上に配置
            vrButton.style.left = '50%';
            vrButton.style.transform = 'translateX(-50%)';
            vrButton.style.padding = '12px 24px';
            vrButton.style.backgroundColor = '#2196F3';
            vrButton.style.color = 'white';
            vrButton.style.border = 'none';
            vrButton.style.borderRadius = '4px';
            vrButton.style.fontSize = '16px';
            vrButton.style.fontWeight = 'bold';
            vrButton.style.cursor = 'pointer';
            vrButton.style.zIndex = '200';
            document.body.appendChild(vrButton);
            log('標準VRボタンを作成しました');
        } catch (e) {
            log('標準VRボタンの作成に失敗しました: ' + e.message);
        }

        // カスタムVRモード開始ボタン
        const enterVRButton = document.getElementById('enter-vr-button');
        if (!enterVRButton) {
            log('エラー: カスタムVR開始ボタンが見つかりません');
        } else {
            log('カスタムVR開始ボタンが見つかりました');
            enterVRButton.addEventListener('click', async () => {
                log('カスタムVRボタンがクリックされました');
                try {
                    log('カスタムVRセッションの開始を試みています...');
                    
                    if (!navigator.xr) {
                        const message = 'WebXRはこのブラウザでサポートされていません';
                        log(message);
                        showStatus(message, 5000);
                        return;
                    }

                    // WebXRがサポートされているか確認
                    log('WebXRサポートを確認中...');
                    let supported = false;
                    try {
                        supported = await navigator.xr.isSessionSupported('immersive-vr');
                        log('VRセッションサポート: ' + supported);
                    } catch (err) {
                        log(`XRセッションサポートチェックエラー: ${err.message}`);
                        showStatus(`エラーが発生しました: ${err.message}`, 5000);
                        return;
                    }
                    
                    // デバイス情報のログ出力
                    log('ユーザーエージェント: ' + navigator.userAgent);
                    
                    // Quest用のチェック
                    const isQuest = /Quest/.test(navigator.userAgent);
                    log('Quest検出: ' + isQuest);
                    
                    // Vision Pro Safariのチェック
                    const isVisionOS = /visionOS/.test(navigator.userAgent) || 
                                       (/AppleWebKit/.test(navigator.userAgent) && 
                                        /Safari/.test(navigator.userAgent) && 
                                        !(/Chrome/.test(navigator.userAgent)));
                    log('Vision Pro（可能性）検出: ' + isVisionOS);
                    
                    if (!supported) {
                        // Vision Proは標準のWebXRではなく独自実装の可能性がある
                        if (isVisionOS) {
                            log('Vision Pro（Safari）用の特別処理を試みます');
                            
                            // Vision Proの場合は通常表示を継続
                            renderer.setAnimationLoop(() => {
                                controls.update();
                                renderer.render(scene, camera);
                            });
                            
                            return;
                        }
                        
                        const message = 'このデバイスはVRをサポートしていません';
                        log(message);
                        showStatus(message, 5000);
                        return;
                    }

                    log('WebXRサポートを確認しました');
                    log('VRセッションをリクエストしています...');

                    // VRセッションのオプション設定
                    let sessionOptions = {
                        requiredFeatures: ['local-floor']
                    };
                    
                    // Questの場合は追加のオプションを設定
                    if (isQuest) {
                        log('Questデバイス用の設定を適用します');
                        sessionOptions.optionalFeatures = ['bounded-floor', 'hand-tracking'];
                    }
                    
                    log('セッションオプション: ' + JSON.stringify(sessionOptions));
                    
                    // VRセッションをリクエスト
                    try {
                        const session = await navigator.xr.requestSession('immersive-vr', sessionOptions);
                        log('VRセッションが正常に開始されました');
                        
                        // レンダラーにセッションを設定
                        try {
                            log('レンダラーにセッションを設定しています...');
                            await renderer.xr.setSession(session);
                            log('レンダラーにセッションが設定されました');
                            
                            // コントローラーの設定
                            setupVRControllers(session, scene, renderer);
                            
                            // VRセッション終了時の処理
                            session.addEventListener('end', () => {
                                log('VRセッションが終了しました');
                                renderer.xr.setSession(null);
                                // コントローラーのイベントリスナーを削除
                                controllers.forEach(controller => {
                                    controller.removeEventListener('selectstart', onControllerSelectStart);
                                    controller.removeEventListener('selectend', onControllerSelectEnd);
                                });
                            });
                        } catch (setSessionError) {
                            log(`レンダラーへのセッション設定エラー: ${setSessionError.message}`);
                            showStatus(`エラーが発生しました: ${setSessionError.message}`, 5000);
                            session.end();
                            throw setSessionError;
                        }
                    } catch (requestSessionError) {
                        log(`VRセッションリクエストエラー: ${requestSessionError.message}`);
                        showStatus(`エラーが発生しました: ${requestSessionError.message}`, 5000);
                        throw requestSessionError;
                    }
                } catch (error) {
                    const errorMessage = `VRセッションの開始に失敗しました: ${error.message}`;
                    log(errorMessage);
                    showStatus(errorMessage, 5000);
                }
            });
            log('カスタムVR開始ボタンのイベントリスナーを設定しました');
        }

        // VRコントローラーの設定関数
        function setupVRControllers(session, scene, renderer) {
            log('VRコントローラーのセットアップを開始...');
            
            try {
                // コントローラーの配列
                const controllers = [];
                
                // XRコントローラーモデルファクトリーのインスタンス
                const controllerModelFactory = new XRControllerModelFactory();
                
                // 左右のコントローラーを取得
                for (let i = 0; i < 2; i++) {
                    try {
                        // コントローラーの作成
                        const controller = renderer.xr.getController(i);
                        if (controller) {
                            log(`コントローラー${i+1}を取得しました`);
                            controller.addEventListener('connected', (event) => {
                                log(`コントローラー${i+1}が接続されました: ${event.data.gamepad ? 'ゲームパッドあり' : 'ゲームパッドなし'}`);
                            });
                            controller.addEventListener('disconnected', () => {
                                log(`コントローラー${i+1}が切断されました`);
                            });
                            controller.addEventListener('selectstart', onControllerSelectStart);
                            controller.addEventListener('selectend', onControllerSelectEnd);
                            scene.add(controller);
                            
                            // グリップの作成
                            const grip = renderer.xr.getControllerGrip(i);
                            if (grip) {
                                grip.add(controllerModelFactory.createControllerModel(grip));
                                scene.add(grip);
                                log(`コントローラー${i+1}のグリップを作成しました`);
                            }
                            
                            controllers.push({ controller, grip });
                            
                            // コントローラーに視覚的な線を追加
                            const geometry = new THREE.BufferGeometry().setFromPoints([
                                new THREE.Vector3(0, 0, 0),
                                new THREE.Vector3(0, 0, -1)
                            ]);
                            
                            const line = new THREE.Line(geometry);
                            line.scale.z = 5;
                            controller.add(line.clone());
                        } else {
                            log(`コントローラー${i+1}の取得に失敗しました`);
                        }
                    } catch (controllerError) {
                        log(`コントローラー${i+1}のセットアップエラー: ${controllerError.message}`);
                    }
                }
                
                log(`${controllers.length}個のコントローラーをセットアップしました`);
                
                // アニメーションループでの移動処理
                const tempVector = new THREE.Vector3();
                const direction = new THREE.Vector3();
                
                // XRアニメーションループを設定
                renderer.setAnimationLoop((time, frame) => {
                    // コントローラーによる移動処理
                    controllers.forEach(({ controller }) => {
                        if (controller.userData.isSelecting) {
                            controller.getWorldDirection(direction);
                            direction.negate();  // コントローラーが向いている方向に移動
                            direction.y = 0;     // 水平移動のみ
                            direction.normalize();
                            tempVector.copy(direction).multiplyScalar(0.1);  // 移動速度
                            
                            camera.position.add(tempVector);
                        }
                    });
                    
                    controls.update();
                    renderer.render(scene, camera);
                });
                
                log('XRアニメーションループを設定しました');
            } catch (error) {
                log(`VRコントローラーのセットアップエラー: ${error.message}`);
            }
        }

        // コントローラーのセレクト開始イベント
        function onControllerSelectStart(event) {
            log('コントローラーのセレクト開始');
            this.userData.isSelecting = true;
        }

        // コントローラーのセレクト終了イベント
        function onControllerSelectEnd(event) {
            log('コントローラーのセレクト終了');
            this.userData.isSelecting = false;
        }

        // コントロールの設定（非VRモード用）
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);
        controls.update();

        // XRControllerModelFactoryを実装
        class XRControllerModelFactory {
            constructor() {}
            
            createControllerModel(grip) {
                const controllerGeometry = new THREE.CylinderGeometry(0.02, 0.04, 0.08, 16);
                const controllerMaterial = new THREE.MeshStandardMaterial({
                    color: 0x444444,
                    roughness: 0.6,
                    metalness: 0.5
                });
                const controller = new THREE.Mesh(controllerGeometry, controllerMaterial);
                controller.rotation.x = -Math.PI / 2;
                
                const handleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.1, 16);
                const handle = new THREE.Mesh(handleGeometry, controllerMaterial);
                handle.position.y = -0.05;
                handle.rotation.x = -Math.PI / 2;
                
                const group = new THREE.Group();
                group.add(controller);
                group.add(handle);
                
                return group;
            }
        }

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

        // リサイズイベントのデバウンス
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 250);
        });

        // アニメーションループ設定
        if (!navigator.xr) {
            log('通常のアニメーションループを使用します');
            renderer.setAnimationLoop(() => {
                controls.update();
                renderer.render(scene, camera);
            });
        } else {
            log('VR対応のアニメーションループを使用します（VRセッション開始時に設定されます）');
            // アニメーションループはVRセッション開始時にsetupVRControllersで設定
        }
    } catch (error) {
        log(`初期化中にエラーが発生しました: ${error.message}`);
        console.error(error);
    }
} 
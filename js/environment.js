// 木々の作成
function createTrees() {
  try {
    const treeCount = 100;
    const terrainSize = 500;
    
    for (let i = 0; i < treeCount; i++) {
      // ランダムな位置
      const x = (Math.random() - 0.5) * terrainSize;
      const z = (Math.random() - 0.5) * terrainSize;
      
      // 中央付近は避ける
      if (Math.sqrt(x * x + z * z) < 50) continue;
      
      // 地形の高さに合わせる
      const y = getTerrainHeight(x, z);
      
      // ランダムなサイズ
      const treeHeight = 5 + Math.random() * 10;
      const treeWidth = treeHeight * 0.3;
      
      // 木全体のグループ
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, y, z);
      
      // 幹
      const trunkGeometry = new THREE.CylinderGeometry(
        treeWidth * 0.2, treeWidth * 0.3, treeHeight * 0.5, 8
      );
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.1
      });
      
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = treeHeight * 0.25;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);
      
      // 葉（複数の円錐で表現）
      const leavesCount = 2 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < leavesCount; j++) {
        const leavesHeight = treeHeight * (0.4 - j * 0.05);
        const leavesGeometry = new THREE.ConeGeometry(
          treeWidth * (1 - j * 0.2), leavesHeight, 8
        );
        const leavesColor = new THREE.Color(
          0.1,
          0.5 + Math.random() * 0.3,
          0.1
        );
        const leavesMaterial = new THREE.MeshStandardMaterial({
          color: leavesColor,
          roughness: 0.8,
          metalness: 0.1
        });
        
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        
        // 葉の位置を調整
        leaves.position.y = treeHeight * 0.5 + j * leavesHeight * 0.7;
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        
        treeGroup.add(leaves);
      }
      
      // ランダムな回転
      treeGroup.rotation.y = Math.random() * Math.PI * 2;
      
      // 木の情報を保存
      treeGroup.userData = {
        swaySpeed: 0.2 + Math.random() * 0.3,
        swayAmount: 0.005 + Math.random() * 0.01
      };
      
      mainSceneGroup.add(treeGroup);
      trees.push(treeGroup);
    }
    
    logDebug(`${trees.length}本の木を作成`);
  } catch (error) {
    logDebug(`木の作成エラー: ${error.message}`);
  }
}

// 動物の作成
function createAnimals() {
  try {
    // 動物の種類
    const animalTypes = [
      { name: "鹿", height: 1.5, length: 2, color: 0xA0522D },
      { name: "うさぎ", height: 0.5, length: 0.7, color: 0xD3D3D3 },
      { name: "キツネ", height: 0.8, length: 1.2, color: 0xFFA500 }
    ];
    
    // 各種類の動物をいくつか作成
    for (let type of animalTypes) {
      const count = 3 + Math.floor(Math.random() * 5);
      
      for (let i = 0; i < count; i++) {
        // ランダムな位置
        const terrainSize = 300;
        const x = (Math.random() - 0.5) * terrainSize;
        const z = (Math.random() - 0.5) * terrainSize;
        
        // 中央付近は避ける
        if (Math.sqrt(x * x + z * z) < 30) continue;
        
        // 地形の高さに合わせる
        const y = getTerrainHeight(x, z);
        
        // 動物全体のグループ
        const animalGroup = new THREE.Group();
        animalGroup.position.set(x, y, z);
        
        // 動物の体
        const bodyGeometry = new THREE.CapsuleGeometry(
          type.height * 0.4, type.length * 0.6, 4, 8
        );
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: type.color,
          roughness: 0.9,
          metalness: 0.1
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        body.position.y = type.height * 0.6;
        body.castShadow = true;
        body.receiveShadow = true;
        animalGroup.add(body);
        
        // 頭
        const headGeometry = new THREE.SphereGeometry(type.height * 0.25, 8, 8);
        const headMaterial = new THREE.MeshStandardMaterial({
          color: type.color,
          roughness: 0.9,
          metalness: 0.1
        });
        
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(type.length * 0.4, type.height * 0.7, 0);
        head.castShadow = true;
        animalGroup.add(head);
        
        // 足
        const legCount = 4;
        for (let j = 0; j < legCount; j++) {
          const legGeometry = new THREE.CylinderGeometry(
            type.height * 0.05, type.height * 0.05, type.height * 0.6, 8
          );
          const legMaterial = new THREE.MeshStandardMaterial({
            color: type.color,
            roughness: 0.9,
            metalness: 0.1
          });
          
          const leg = new THREE.Mesh(legGeometry, legMaterial);
          
          // 足の位置を調整
          const legX = ((j % 2) * 2 - 1) * type.length * 0.2;
          const legZ = (Math.floor(j / 2) * 2 - 1) * type.height * 0.2;
          leg.position.set(legX, type.height * 0.3, legZ);
          leg.castShadow = true;
          
          animalGroup.add(leg);
        }
        
        // ランダムな回転
        animalGroup.rotation.y = Math.random() * Math.PI * 2;
        
        // 動物の情報を保存
        animalGroup.userData = {
          type: type.name,
          moveSpeed: 0.01 + Math.random() * 0.02,
          rotateTo: Math.random() * Math.PI * 2,
          rotateSpeed: 0.02,
          moveTime: 0,
          idleTime: 0,
          state: "idle",
          nextStateChange: 10 + Math.random() * 20
        };
        
        mainSceneGroup.add(animalGroup);
        animals.push(animalGroup);
      }
    }
    
    logDebug(`${animals.length}匹の動物を作成`);
  } catch (error) {
    logDebug(`動物の作成エラー: ${error.message}`);
  }
}

// 乗り物の作成
function createVehicles() {
  try {
    // 熱気球を作成
    const balloonCount = 2;
    
    for (let i = 0; i < balloonCount; i++) {
      // ランダムな位置
      const terrainSize = 400;
      const x = (Math.random() - 0.5) * terrainSize;
      const z = (Math.random() - 0.5) * terrainSize;
      
      // 十分な高さに配置
      const y = 50 + Math.random() * 50;
      
      // 熱気球全体のグループ
      const balloonGroup = new THREE.Group();
      balloonGroup.position.set(x, y, z);
      
      // バルーン部分
      const balloonGeometry = new THREE.SphereGeometry(8, 16, 16);
      const balloonMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          Math.random(),
          Math.random(),
          Math.random()
        ),
        roughness: 0.7,
        metalness: 0.1
      });
      
      const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
      balloon.castShadow = true;
      balloonGroup.add(balloon);
      
      // ゴンドラ（搭乗部分）
      const gondolaGeometry = new THREE.BoxGeometry(3, 2, 3);
      const gondolaMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.1
      });
      
      const gondola = new THREE.Mesh(gondolaGeometry, gondolaMaterial);
      gondola.position.y = -10;
      gondola.castShadow = true;
      balloonGroup.add(gondola);
      
      // ロープ（バルーンとゴンドラを接続）
      for (let j = 0; j < 4; j++) {
        const ropeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
        const ropeMaterial = new THREE.MeshStandardMaterial({
          color: 0x8B4513,
          roughness: 0.9,
          metalness: 0.1
        });
        
        const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);
        
        // ロープの位置調整
        const angle = (j / 4) * Math.PI * 2;
        const offsetX = Math.cos(angle) * 4;
        const offsetZ = Math.sin(angle) * 4;
        
        rope.position.set(offsetX, -5, offsetZ);
        rope.castShadow = true;
        
        balloonGroup.add(rope);
      }
      
      // 熱気球の情報
      balloonGroup.userData = {
        type: "balloon",
        moveSpeed: 0.1 + Math.random() * 0.1,
        moveAngle: Math.random() * Math.PI * 2,
        ascendSpeed: 0.02 * (Math.random() > 0.5 ? 1 : -1),
        maxHeight: 70 + Math.random() * 30,
        minHeight: 40 + Math.random() * 20
      };
      
      mainSceneGroup.add(balloonGroup);
      vehicles.push(balloonGroup);
    }
    
    // 自転車/カートのような地上の乗り物
    const groundVehicleCount = 3;
    
    for (let i = 0; i < groundVehicleCount; i++) {
      // ランダムな位置
      const terrainSize = 300;
      const x = (Math.random() - 0.5) * terrainSize;
      const z = (Math.random() - 0.5) * terrainSize;
      
      // 地形の高さに合わせる
      const y = getTerrainHeight(x, z);
      
      // 乗り物全体のグループ
      const vehicleGroup = new THREE.Group();
      vehicleGroup.position.set(x, y + 0.5, z);
      
      // 乗り物の本体
      const bodyGeometry = new THREE.BoxGeometry(2, 1, 3);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          Math.random(),
          Math.random(),
          Math.random()
        ),
        roughness: 0.7,
        metalness: 0.3
      });
      
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      body.castShadow = true;
      body.receiveShadow = true;
      vehicleGroup.add(body);
      
      // タイヤ
      for (let j = 0; j < 4; j++) {
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
          color: 0x333333,
          roughness: 0.9,
          metalness: 0.2
        });
        
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        
        // タイヤの位置調整
        const wheelX = ((j % 2) * 2 - 1) * 0.8;
        const wheelZ = (Math.floor(j / 2) * 2 - 1) * 1;
        
        wheel.position.set(wheelX, 0, wheelZ);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        
        vehicleGroup.add(wheel);
      }
      
      // ランダムな回転
      vehicleGroup.rotation.y = Math.random() * Math.PI * 2;
      
      // 乗り物の情報
      vehicleGroup.userData = {
        type: "groundVehicle",
        moveSpeed: 0.1 + Math.random() * 0.2,
        turnSpeed: 0.01 + Math.random() * 0.02,
        turnInterval: 100 + Math.random() * 200,
        turnTimer: 0,
        wheels: []
      };
      
      // タイヤの参照を保存
      for (let j = 0; j < vehicleGroup.children.length; j++) {
        if (vehicleGroup.children[j].geometry.type === "CylinderGeometry") {
          vehicleGroup.userData.wheels.push(vehicleGroup.children[j]);
        }
      }
      
      mainSceneGroup.add(vehicleGroup);
      vehicles.push(vehicleGroup);
    }
    
    logDebug(`${vehicles.length}台の乗り物を作成`);
  } catch (error) {
    logDebug(`乗り物の作成エラー: ${error.message}`);
  }
}

// 木々のアニメーション
function animateTrees() {
  try {
    const time = Date.now() * 0.001;
    
    // すべての木を揺らす
    for (const tree of trees) {
      if (tree.userData) {
        // 風の影響で木を揺らす
        const swayAmount = tree.userData.swayAmount || 0.01;
        const swaySpeed = tree.userData.swaySpeed || 0.3;
        
        tree.rotation.x = Math.sin(time * swaySpeed) * swayAmount;
        tree.rotation.z = Math.cos(time * swaySpeed * 0.7) * swayAmount;
      }
    }
  } catch (error) {
    logDebug(`木のアニメーションエラー: ${error.message}`);
  }
}

// 動物のアニメーション
function animateAnimals() {
  try {
    // すべての動物を動かす
    for (const animal of animals) {
      if (animal.userData) {
        const userData = animal.userData;
        
        // 状態遷移のタイマー更新
        if (userData.state === "idle") {
          userData.idleTime += 0.016; // 約16ms = 60fpsの1フレーム
          
          // 一定時間経過後、移動状態に変更
          if (userData.idleTime > userData.nextStateChange) {
            userData.state = "moving";
            userData.idleTime = 0;
            userData.moveTime = 0;
            userData.nextStateChange = 5 + Math.random() * 10;
            
            // 新しい方向を設定
            userData.rotateTo = Math.random() * Math.PI * 2;
          }
        } else if (userData.state === "moving") {
          userData.moveTime += 0.016;
          
          // 一定時間経過後、待機状態に変更
          if (userData.moveTime > userData.nextStateChange) {
            userData.state = "idle";
            userData.moveTime = 0;
            userData.idleTime = 0;
            userData.nextStateChange = 10 + Math.random() * 20;
          } else {
            // 目標の向きまで回転
            const currentRotation = animal.rotation.y;
            const targetRotation = userData.rotateTo;
            
            // 回転の最短経路を計算
            let rotationDiff = targetRotation - currentRotation;
            while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
            while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;
            
            if (Math.abs(rotationDiff) > 0.01) {
              // 徐々に回転
              animal.rotation.y += Math.sign(rotationDiff) * userData.rotateSpeed;
            } else {
              // 目標方向に向いたら前進
              const moveSpeed = userData.moveSpeed;
              
              animal.position.x += Math.sin(animal.rotation.y) * moveSpeed;
              animal.position.z += Math.cos(animal.rotation.y) * moveSpeed;
              
              // 地形の高さに合わせる
              animal.position.y = getTerrainHeight(animal.position.x, animal.position.z);
            }
          }
        }
        
        // たまに鳴き声を出す
        if (Math.random() < 0.0005) {
          playAnimalSound();
        }
      }
    }
  } catch (error) {
    logDebug(`動物のアニメーションエラー: ${error.message}`);
  }
}

// 乗り物のアニメーション
function animateVehicles() {
  try {
    // すべての乗り物を動かす
    for (const vehicle of vehicles) {
      if (vehicle.userData) {
        const userData = vehicle.userData;
        
        if (userData.type === "balloon") {
          // 熱気球は風に流されるように動く
          vehicle.position.x += Math.sin(userData.moveAngle) * userData.moveSpeed;
          vehicle.position.z += Math.cos(userData.moveAngle) * userData.moveSpeed;
          
          // 上下にゆっくり動く
          vehicle.position.y += userData.ascendSpeed;
          
          // 高度の限界に達したら方向転換
          if (vehicle.position.y > userData.maxHeight || 
              vehicle.position.y < userData.minHeight) {
            userData.ascendSpeed *= -1;
          }
          
          // ゆっくりと回転
          vehicle.rotation.y += 0.002;
          
        } else if (userData.type === "groundVehicle") {
          // 地上の乗り物は地形に沿って移動
          
          // タイマー更新
          userData.turnTimer += 1;
          
          // 一定時間経過で方向転換
          if (userData.turnTimer > userData.turnInterval) {
            vehicle.rotation.y += (Math.random() - 0.5) * 1;
            userData.turnTimer = 0;
            userData.turnInterval = 100 + Math.random() * 200;
          }
          
          // 前進
          const moveSpeed = userData.moveSpeed;
          vehicle.position.x += Math.sin(vehicle.rotation.y) * moveSpeed;
          vehicle.position.z += Math.cos(vehicle.rotation.y) * moveSpeed;
          
          // 地形の高さに合わせる
          vehicle.position.y = getTerrainHeight(vehicle.position.x, vehicle.position.z) + 0.5;
          
          // タイヤを回転
          if (userData.wheels && userData.wheels.length > 0) {
            for (const wheel of userData.wheels) {
              wheel.rotation.x += moveSpeed * 0.5;
            }
          }
          
          // たまに車の音を鳴らす
          if (Math.random() < 0.001) {
            playVehicleSound();
          }
        }
      }
    }
  } catch (error) {
    logDebug(`乗り物のアニメーションエラー: ${error.message}`);
  }
} 
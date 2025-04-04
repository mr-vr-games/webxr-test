// メインシーン（豪華な草原）の作成
function createMainScene() {
  logDebug("メインシーン（草原）作成開始");
  
  try {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    mainSceneGroup.add(ambientLight);
    
    // 太陽光
    const sunLight = new THREE.DirectionalLight(0xffffaa, 1.0);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    
    // 広い影エリア
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    
    mainSceneGroup.add(sunLight);
    
    // スカイドーム
    createSkyDome();
    
    // 地形の作成
    createTerrain();
    
    // 草の作成
    createGrass();
    
    // 木々を作成
    createTrees();
    
    // 動物を作成
    createAnimals();
    
    // 乗り物を作成
    createVehicles();
    
    // 環境音を開始
    playAmbientSound();
    
    logDebug("メインシーン作成完了");
  } catch (error) {
    logDebug(`メインシーン作成エラー: ${error.message}`);
  }
}

// スカイドーム作成
function createSkyDome() {
  try {
    // 空（スカイドーム）
    const skyGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    mainSceneGroup.add(sky);
    
    // 雲
    for (let i = 0; i < 30; i++) {
      const cloudX = Math.random() * 800 - 400;
      const cloudY = 100 + Math.random() * 200;
      const cloudZ = Math.random() * 800 - 400;
      
      const cloudGroup = new THREE.Group();
      cloudGroup.position.set(cloudX, cloudY, cloudZ);
      
      // 複数の球体で雲を表現
      const cloudPartsCount = 3 + Math.floor(Math.random() * 5);
      for (let j = 0; j < cloudPartsCount; j++) {
        const partSize = 10 + Math.random() * 20;
        const cloudPartGeometry = new THREE.SphereGeometry(partSize, 8, 8);
        const cloudPartMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8
        });
        
        const cloudPart = new THREE.Mesh(cloudPartGeometry, cloudPartMaterial);
        cloudPart.position.set(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 30
        );
        
        cloudGroup.add(cloudPart);
      }
      
      cloudGroup.userData = {
        moveSpeed: 0.02 + Math.random() * 0.05
      };
      
      mainSceneGroup.add(cloudGroup);
    }
    
    logDebug("スカイドーム作成完了");
  } catch (error) {
    logDebug(`スカイドーム作成エラー: ${error.message}`);
  }
}

// 起伏のある地形の作成
function createTerrain() {
  try {
    // 起伏のある大きな地形
    const terrainSize = 1000;
    const terrainSegments = 100;
    
    const terrainGeometry = new THREE.PlaneGeometry(
      terrainSize, terrainSize, terrainSegments, terrainSegments
    );
    
    // 地形の高さマップを生成
    const positions = terrainGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      
      // パーリンノイズで自然な地形を生成
      const frequency = 0.005;
      const amplitude = 15;
      
      // 複数の周波数のノイズを組み合わせる
      let y = 0;
      y += Math.sin(x * frequency) * Math.cos(z * frequency) * amplitude;
      y += Math.sin(x * frequency * 2) * Math.cos(z * frequency * 2) * amplitude * 0.5;
      y += Math.sin(x * frequency * 4) * Math.cos(z * frequency * 4) * amplitude * 0.25;
      
      // 中央に平坦なエリアを作る
      const distanceFromCenter = Math.sqrt(x * x + z * z);
      const flatteningFactor = 1 - Math.max(0, 1 - distanceFromCenter / 100);
      
      // 最終的な高さを設定
      positions[i + 1] = y * flatteningFactor;
    }
    
    // 法線を再計算
    terrainGeometry.computeVertexNormals();
    
    // 地形のマテリアル
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x7cbb32,
      roughness: 0.8,
      metalness: 0.1
    });
    
    // 地形メッシュ
    ground = new THREE.Mesh(terrainGeometry, terrainMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    mainSceneGroup.add(ground);
    
    logDebug("地形作成完了");
  } catch (error) {
    logDebug(`地形作成エラー: ${error.message}`);
  }
}

// 草の作成（たくさんの草ブレード）
function createGrass() {
  try {
    // インスタンス化されたジオメトリを使用して多数の草を効率的に描画
    const grassCount = 10000;
    const grassGeometry = new THREE.PlaneGeometry(0.5, 1);
    const grassMaterial = new THREE.MeshStandardMaterial({
      color: 0x7cbb32,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
      alphaTest: 0.5
    });
    
    // 草のインスタンス化
    const instancedGrass = new THREE.InstancedMesh(
      grassGeometry, grassMaterial, grassCount
    );
    
    // 草の配置
    const dummy = new THREE.Object3D();
    const terrainSize = 500;
    
    for (let i = 0; i < grassCount; i++) {
      // ランダムな位置（中央付近に集中）
      const x = (Math.random() - 0.5) * terrainSize;
      const z = (Math.random() - 0.5) * terrainSize;
      
      // 地形の高さに合わせる
      const y = getTerrainHeight(x, z);
      
      // 草の高さとサイズをランダム化
      const scale = 0.5 + Math.random() * 1.0;
      
      dummy.position.set(x, y + scale * 0.5, z);
      dummy.rotation.set(
        0,
        Math.random() * Math.PI * 2,
        Math.random() * 0.2
      );
      dummy.scale.set(
        scale,
        scale + Math.random() * 0.5,
        scale
      );
      
      dummy.updateMatrix();
      instancedGrass.setMatrixAt(i, dummy.matrix);
    }
    
    instancedGrass.castShadow = true;
    instancedGrass.receiveShadow = true;
    mainSceneGroup.add(instancedGrass);
    
    grass = instancedGrass;
    
    logDebug("草生成完了");
  } catch (error) {
    logDebug(`草生成エラー: ${error.message}`);
  }
}

// 地形の高さを取得する関数
function getTerrainHeight(x, z) {
  // パーリンノイズで一貫した高さを返す
  const frequency = 0.005;
  const amplitude = 15;
  
  let y = 0;
  y += Math.sin(x * frequency) * Math.cos(z * frequency) * amplitude;
  y += Math.sin(x * frequency * 2) * Math.cos(z * frequency * 2) * amplitude * 0.5;
  y += Math.sin(x * frequency * 4) * Math.cos(z * frequency * 4) * amplitude * 0.25;
  
  // 中央に平坦なエリアを作る
  const distanceFromCenter = Math.sqrt(x * x + z * z);
  const flatteningFactor = 1 - Math.max(0, 1 - distanceFromCenter / 100);
  
  return y * flatteningFactor;
}

// 草原シーンのアニメーション
function animateMainScene(deltaTime) {
  try {
    // プレイヤー移動の処理
    updatePlayerPosition(deltaTime);
    
    // 雲のアニメーション
    animateClouds();
    
    // 草のそよぎアニメーション
    animateGrass();
    
    // 木のアニメーション
    animateTrees();
    
    // 動物のアニメーション
    animateAnimals();
    
    // 乗り物のアニメーション
    animateVehicles();
  } catch (error) {
    logDebug(`メインシーンアニメーションエラー: ${error.message}`);
  }
}

// プレイヤーの位置更新
function updatePlayerPosition(deltaTime) {
  try {
    // 速度を更新
    velocity.x += acceleration.x;
    velocity.y += acceleration.y;
    velocity.z += acceleration.z;
    
    // 最大速度に制限
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
    if (speed > maxSpeed) {
      velocity.x = (velocity.x / speed) * maxSpeed;
      velocity.y = (velocity.y / speed) * maxSpeed;
      velocity.z = (velocity.z / speed) * maxSpeed;
    }
    
    // 減速（抵抗）
    velocity.x *= 0.95;
    velocity.y *= 0.95;
    velocity.z *= 0.95;
    
    // 速度が非常に小さい場合は0にする
    if (Math.abs(velocity.x) < 0.001) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.001) velocity.y = 0;
    if (Math.abs(velocity.z) < 0.001) velocity.z = 0;
    
    // プレイヤーの向いている方向に移動
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyQuaternion(camera.quaternion);
    cameraDirection.y = 0; // 水平方向だけ考慮
    cameraDirection.normalize();
    
    // カメラの向きと速度を組み合わせて移動方向を決定
    const moveDirection = new THREE.Vector3();
    moveDirection.x = cameraDirection.x * velocity.z - cameraDirection.z * velocity.x;
    moveDirection.z = cameraDirection.z * velocity.z + cameraDirection.x * velocity.x;
    moveDirection.y = velocity.y;
    
    // 自動的に地面に沿う高さを維持
    const terrainHeight = getTerrainHeight(
      -mainSceneGroup.position.x,
      -mainSceneGroup.position.z
    );
    const targetHeight = terrainHeight + playerHeight;
    const currentHeight = -mainSceneGroup.position.y;
    
    // 徐々に目標の高さに近づける
    const heightDiff = targetHeight - currentHeight;
    moveDirection.y += heightDiff * 0.1;
    
    // メインシーングループを移動（プレイヤーの逆方向に）
    mainSceneGroup.position.x -= moveDirection.x * deltaTime * 0.01;
    mainSceneGroup.position.y -= moveDirection.y * deltaTime * 0.01;
    mainSceneGroup.position.z -= moveDirection.z * deltaTime * 0.01;
  } catch (error) {
    logDebug(`プレイヤー位置更新エラー: ${error.message}`);
  }
}

// 雲のアニメーション
function animateClouds() {
  try {
    mainSceneGroup.children.forEach(obj => {
      // 雲のアニメーション
      if (obj.type === 'Group' && obj.position.y > 50) {
        if (obj.userData && obj.userData.moveSpeed) {
          obj.position.x += obj.userData.moveSpeed;
          
          // 端に到達したら反対側に移動
          if (obj.position.x > 500) {
            obj.position.x = -500;
          }
        }
      }
    });
  } catch (error) {
    logDebug(`雲アニメーションエラー: ${error.message}`);
  }
}

// 草のそよぎアニメーション
function animateGrass() {
  try {
    // 風の影響をシミュレート
    const time = Date.now() * 0.001;
    const windStrength = 0.3;
    const windFrequency = 0.5;
    
    // すべての草インスタンスに少しずつランダムな回転を加える
    if (grass && grass.isInstancedMesh) {
      const dummy = new THREE.Object3D();
      const instanceCount = grass.count;
      
      // すべてを更新するのは重いので一部だけを更新
      const updateCount = 100;
      const startIdx = Math.floor(Math.random() * (instanceCount - updateCount));
      
      for (let i = 0; i < updateCount; i++) {
        const idx = (startIdx + i) % instanceCount;
        
        grass.getMatrixAt(idx, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        
        // 風のゆらぎを計算
        const windEffect = Math.sin(time * windFrequency + dummy.position.x * 0.01 + dummy.position.z * 0.01) * windStrength;
        
        // 回転を少し変更
        dummy.rotation.z = windEffect * 0.2;
        
        dummy.updateMatrix();
        grass.setMatrixAt(idx, dummy.matrix);
      }
      
      grass.instanceMatrix.needsUpdate = true;
    }
  } catch (error) {
    logDebug(`草アニメーションエラー: ${error.message}`);
  }
} 
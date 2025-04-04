// VRタイトルシーン作成
function createVRTitleScene() {
  logDebug("VRタイトルシーン作成");
  
  try {
    // タイトルテキスト（板にテクスチャを貼る）
    const titleCanvas = document.createElement('canvas');
    titleCanvas.width = 1024;
    titleCanvas.height = 256;
    const ctx = titleCanvas.getContext('2d');
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
    ctx.font = 'Bold 100px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('豪華な草原VR体験', titleCanvas.width / 2, titleCanvas.height / 2);
    
    const titleTexture = new THREE.CanvasTexture(titleCanvas);
    const titleMaterial = new THREE.MeshBasicMaterial({ 
      map: titleTexture,
      transparent: true,
      opacity: 0.9
    });
    
    const titleMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 1),
      titleMaterial
    );
    
    titleMesh.position.set(0, 1.7, -3);
    vrTitleGroup.add(titleMesh);
    
    // スタートボタン - インタラクティブなボタンとしてわかりやすく
    const startCanvas = document.createElement('canvas');
    startCanvas.width = 512;
    startCanvas.height = 128;
    const startCtx = startCanvas.getContext('2d');
    
    // ボタンの背景
    startCtx.fillStyle = '#8bc34a';
    if (startCtx.roundRect) {
      startCtx.roundRect(0, 0, startCanvas.width, startCanvas.height, 30);
    } else {
      // roundRectがサポートされていない場合の代替
      startCtx.fillRect(0, 0, startCanvas.width, startCanvas.height);
    }
    startCtx.fill();
    
    // ボタンのテキスト
    startCtx.font = 'Bold 70px Arial';
    startCtx.fillStyle = 'white';
    startCtx.textAlign = 'center';
    startCtx.textBaseline = 'middle';
    startCtx.fillText('スタート', startCanvas.width / 2, startCanvas.height / 2);
    
    // ボタン枠を追加して視認性向上
    startCtx.strokeStyle = 'white';
    startCtx.lineWidth = 10;
    if (startCtx.roundRect) {
      startCtx.roundRect(5, 5, startCanvas.width - 10, startCanvas.height - 10, 25);
    } else {
      startCtx.strokeRect(5, 5, startCanvas.width - 10, startCanvas.height - 10);
    }
    startCtx.stroke();
    
    const startTexture = new THREE.CanvasTexture(startCanvas);
    const startMaterial = new THREE.MeshBasicMaterial({
      map: startTexture,
      transparent: true
    });
    
    const startButton = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 0.5),
      startMaterial
    );
    
    // ボタンを近く、見やすい位置に配置
    startButton.position.set(0, 1.5, -2);
    startButton.userData = { 
      type: 'button',
      action: 'start',
      interactive: true,
      isButton: true
    };
    
    vrTitleGroup.add(startButton);
    logDebug("スタートボタン追加");
    
    // 背景の草原雰囲気
    createTitleBackground();
    
    // アンビエントライト追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    vrTitleGroup.add(ambientLight);
    
    // 太陽光
    const sunLight = new THREE.DirectionalLight(0xffffaa, 1.0);
    sunLight.position.set(5, 10, 7);
    sunLight.castShadow = true;
    
    // 影の設定
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    
    vrTitleGroup.add(sunLight);
    
    // 操作方法の案内板
    createControlGuide();
    
    logDebug("VRタイトルシーン作成完了");
  } catch (error) {
    logDebug(`VRタイトルシーン作成エラー: ${error.message}`);
    // エラーが起きても続行
    startMainScene();
  }
}

// タイトル画面の背景作成
function createTitleBackground() {
  try {
    // 地面
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7cbb32,
      roughness: 0.8,
      metalness: 0.1
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    vrTitleGroup.add(ground);
    
    // いくつかの小さな草を追加
    for (let i = 0; i < 200; i++) {
      const grassX = Math.random() * 30 - 15;
      const grassZ = Math.random() * 30 - 15;
      
      // 中央付近は空けておく
      if (Math.abs(grassX) < 3 && Math.abs(grassZ) < 3) continue;
      
      const size = 0.1 + Math.random() * 0.2;
      const grassGeometry = new THREE.PlaneGeometry(size, size * 2);
      const grassMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          0.3 + Math.random() * 0.2,
          0.7 + Math.random() * 0.3,
          0.2 + Math.random() * 0.1
        ),
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.5
      });
      
      const grass = new THREE.Mesh(grassGeometry, grassMaterial);
      grass.position.set(grassX, size, grassZ);
      grass.rotation.y = Math.random() * Math.PI;
      vrTitleGroup.add(grass);
    }
    
    // 遠景の木々のシルエット
    for (let i = 0; i < 30; i++) {
      const treeX = Math.random() * 80 - 40;
      const treeZ = Math.random() * 40 - 35;
      
      // 円錐形で木を表現
      const treeHeight = 2 + Math.random() * 3;
      const treeGeometry = new THREE.ConeGeometry(treeHeight / 2, treeHeight, 8);
      const treeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.1, 0.4 + Math.random() * 0.2, 0.1),
        roughness: 0.9,
        metalness: 0.1
      });
      
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      tree.position.set(treeX, treeHeight / 2, treeZ);
      tree.castShadow = true;
      vrTitleGroup.add(tree);
      
      // 幹
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, treeHeight * 0.5, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.1
      });
      
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(treeX, treeHeight * 0.25 - 0.5, treeZ);
      trunk.castShadow = true;
      vrTitleGroup.add(trunk);
    }
    
    // 空（スカイドーム）
    const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    vrTitleGroup.add(sky);
    
    // 雲
    for (let i = 0; i < 10; i++) {
      const cloudX = Math.random() * 80 - 40;
      const cloudY = 10 + Math.random() * 20;
      const cloudZ = Math.random() * 80 - 40;
      
      const cloudGroup = new THREE.Group();
      cloudGroup.position.set(cloudX, cloudY, cloudZ);
      
      // 複数の球体で雲を表現
      const cloudPartsCount = 3 + Math.floor(Math.random() * 5);
      for (let j = 0; j < cloudPartsCount; j++) {
        const partSize = 1 + Math.random() * 2;
        const cloudPartGeometry = new THREE.SphereGeometry(partSize, 8, 8);
        const cloudPartMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8
        });
        
        const cloudPart = new THREE.Mesh(cloudPartGeometry, cloudPartMaterial);
        cloudPart.position.set(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 5
        );
        
        cloudGroup.add(cloudPart);
      }
      
      vrTitleGroup.add(cloudGroup);
    }
  } catch (error) {
    logDebug(`タイトル背景作成エラー: ${error.message}`);
  }
}

// 操作方法の案内板
function createControlGuide() {
  try {
    const guideCanvas = document.createElement('canvas');
    guideCanvas.width = 1024;
    guideCanvas.height = 512;
    const ctx = guideCanvas.getContext('2d');
    
    // 背景
    ctx.fillStyle = 'rgba(76, 175, 80, 0.8)';
    ctx.fillRect(0, 0, guideCanvas.width, guideCanvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, guideCanvas.width - 20, guideCanvas.height - 20);
    
    // タイトル
    ctx.font = 'Bold 50px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('操作方法', guideCanvas.width / 2, 60);
    
    // 操作説明
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    
    const lines = [
      "・右コントローラー: 前進/後退",
      "・左コントローラー: 視点移動",
      "・右トリガー: 前進加速",
      "・左トリガー: 後退加速",
      "・右グリップ: 上昇",
      "・左グリップ: 下降"
    ];
    
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 50, 140 + i * 50);
    }
    
    const guideTexture = new THREE.CanvasTexture(guideCanvas);
    const guideMaterial = new THREE.MeshBasicMaterial({
      map: guideTexture,
      transparent: true,
      opacity: 0.9
    });
    
    const guideMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 1),
      guideMaterial
    );
    
    guideMesh.position.set(0, 0.7, -2);
    vrTitleGroup.add(guideMesh);
  } catch (error) {
    logDebug(`操作ガイド作成エラー: ${error.message}`);
  }
}

// タイトル画面アニメーション
function animateTitleScene(deltaTime) {
  try {
    // 草や雲をそよがせるアニメーション
    vrTitleGroup.children.forEach(obj => {
      // 草のアニメーション
      if (obj.geometry && obj.geometry.type === 'PlaneGeometry' && obj.position.y > 0.1) {
        obj.rotation.y += Math.sin(clock.getElapsedTime() * 2) * 0.001;
        obj.position.y += Math.sin(clock.getElapsedTime() * 3) * 0.0002;
      }
      
      // 雲のアニメーション
      if (obj.type === 'Group' && obj.position.y > 5) {
        obj.position.x += Math.sin(clock.getElapsedTime() * 0.1) * 0.002;
        obj.position.z += Math.cos(clock.getElapsedTime() * 0.1) * 0.002;
      }
    });
  } catch (error) {
    logDebug(`タイトルアニメーションエラー: ${error.message}`);
  }
}

// スタートボタンクリックの処理
function handleStartButtonClick() {
  logDebug("スタートボタンクリック処理開始");
  
  try {
    // タイトル要素をフェードアウト
    const titleElements = vrTitleGroup.children.slice();
    for (const element of titleElements) {
      if (element instanceof THREE.Mesh && element.material.opacity !== undefined) {
        // 不透明度アニメーション
        const fadeOut = setInterval(() => {
          if (element.material.opacity > 0.05) {
            element.material.opacity -= 0.05;
          } else {
            element.visible = false;
            clearInterval(fadeOut);
          }
        }, 50);
      }
    }
    
    // メインシーン作成
    createMainScene();
    
    // タイトル画面非表示にして草原シーン表示
    setTimeout(() => {
      vrTitleGroup.visible = false;
      mainSceneGroup.visible = true;
      state = 'main';
      logDebug("メインシーンに切り替え");
    }, 1000);
    
  } catch (error) {
    logDebug(`スタートボタン処理エラー: ${error.message}`);
    // エラーでも続行
    startMainScene();
  }
}

// メインシーン開始
function startMainScene() {
  vrTitleGroup.visible = false;
  mainSceneGroup.visible = true;
  state = 'main';
  logDebug("メインシーン開始");
} 
// 基本シーン初期化
function initBasicScene() {
  logDebug("基本シーン初期化開始");
  
  try {
    // オーディオ初期化
    initAudio();
    
    // シーン作成
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // 明るい青空色
    
    // フォグ設定（遠くのオブジェクトが徐々に霞む）
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);
    
    // カメラ設定
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, playerHeight, 0);
    
    // レンダラー設定
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    
    // 重要設定1: local-floorリファレンススペースを設定
    renderer.xr.setReferenceSpaceType('local-floor');
    
    // 物理ベースレンダリング設定
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.getElementById('container').appendChild(renderer.domElement);
    
    // イベントリスナー
    window.addEventListener('resize', onWindowResize, false);
    
    // VRセッションイベント
    renderer.xr.addEventListener('sessionstart', () => {
      logDebug('VRセッション開始');
      isInVR = true;
      onVRStarted();
    });
    
    renderer.xr.addEventListener('sessionend', () => {
      logDebug('VRセッション終了');
      isInVR = false;
      // VRセッション終了時にリロード
      window.location.reload();
    });
    
    // グループ初期化
    vrTitleGroup = new THREE.Group();
    mainSceneGroup = new THREE.Group();
    scene.add(vrTitleGroup);
    scene.add(mainSceneGroup);
    mainSceneGroup.visible = false;
    
    // アニメーションループ開始
    renderer.setAnimationLoop(animate);
    
    logDebug("基本シーン初期化完了");
    return true;
  } catch (error) {
    logDebug(`基本シーン初期化エラー: ${error.message}`);
    alert("初期化エラー: " + error.message);
    return false;
  }
}

// VRセッション開始関数
function startVR() {
  logDebug("VRセッション開始を試みます");
  
  try {
    if (!navigator.xr) {
      throw new Error("WebXRがサポートされていません");
    }
    
    // 重要設定2: VRセッション開始時にlocal-floorを指定
    navigator.xr.requestSession('immersive-vr', {
      requiredFeatures: ['local-floor']
    }).then(onSessionStarted).catch(onRequestSessionError);
  } catch (error) {
    logDebug(`VRセッション開始エラー: ${error.message}`);
    alert("VRモードエラー: " + error.message);
  }
}

// VRセッション開始成功時の処理
function onSessionStarted(session) {
  logDebug("VRセッション開始成功");
  
  try {
    renderer.xr.setSession(session);
  } catch (error) {
    logDebug(`セッション設定エラー: ${error.message}`);
    alert("VRセッション設定エラー: " + error.message);
  }
}

// VRセッション開始失敗時の処理
function onRequestSessionError(error) {
  logDebug(`VRセッション開始失敗: ${error.message}`);
  alert('VRモード開始失敗: WebXR対応ブラウザとVRデバイスを確認してください');
}

// VR開始後の処理
function onVRStarted() {
  logDebug("VR開始後の処理を実行");
  
  try {
    // 非VRスタート画面を非表示
    nonVrStart.style.display = 'none';
    
    // BGM開始
    toggleBGM();
    
    // コントローラーを設定
    setupVRControllers();
    
    // タイトル画面を表示
    createVRTitleScene();
    state = 'title';
  } catch (error) {
    logDebug(`VR開始後処理エラー: ${error.message}`);
  }
}

// リサイズハンドラ
function onWindowResize() {
  try {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  } catch (error) {
    logDebug(`リサイズエラー: ${error.message}`);
  }
}

// アニメーションループ
function animate() {
  const deltaTime = clock.getDelta() * 1000; // ミリ秒単位
  
  try {
    // 状態に応じた処理
    switch (state) {
      case 'title':
        // タイトル画面のアニメーション
        animateTitleScene(deltaTime);
        break;
        
      case 'main':
        // メインシーンアニメーション
        animateMainScene(deltaTime);
        break;
    }
    
    // コントローラーの更新
    updateControllers();
    
    // レンダリング
    renderer.render(scene, camera);
  } catch (error) {
    logDebug(`アニメーションループエラー: ${error.message}`);
  }
} 
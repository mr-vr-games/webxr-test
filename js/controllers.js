// VRコントローラーのセットアップ
function setupVRControllers() {
  logDebug("VRコントローラーをセットアップ");
  
  try {
    // コントローラー1（右手用）
    const controller1 = renderer.xr.getController(0);
    controller1.name = "右コントローラー";
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    controller1.addEventListener('squeezestart', onSqueezeStart);
    controller1.addEventListener('squeezeend', onSqueezeEnd);
    scene.add(controller1);
    
    // コントローラー2（左手用）
    const controller2 = renderer.xr.getController(1);
    controller2.name = "左コントローラー";
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    controller2.addEventListener('squeezestart', onSqueezeStart);
    controller2.addEventListener('squeezeend', onSqueezeEnd);
    scene.add(controller2);
    
    logDebug(`コントローラー追加: ${controller1.name}, ${controller2.name}`);
    
    // コントローラー用視覚マーカー（シンプルな立方体）
    const markerGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    
    const marker1 = new THREE.Mesh(markerGeometry, markerMaterial);
    controller1.add(marker1);
    
    const marker2 = new THREE.Mesh(markerGeometry, markerMaterial);
    controller2.add(marker2);
    
    // コントローラー用レイ表示
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -5], 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    
    const line1 = new THREE.Line(lineGeometry, lineMaterial);
    controller1.add(line1);
    controller1.userData.line = line1;
    controller1.userData.isController = true;
    
    const line2 = new THREE.Line(lineGeometry, lineMaterial);
    controller2.add(line2);
    controller2.userData.line = line2;
    controller2.userData.isController = true;
    
    logDebug("コントローラー視覚マーカーとレイ追加");
    
    // コントローラーのセットアップ
    const session = renderer.xr.getSession();
    if (session) {
      for (let i = 0; i < session.inputSources.length; i++) {
        const inputSource = session.inputSources[i];
        logDebug(`入力ソース[${i}]: handedness=${inputSource.handedness}`);
      }
    } else {
      logDebug("セッションがありません");
    }
    
    logDebug("VRコントローラーセットアップ完了");
  } catch (error) {
    logDebug(`コントローラーセットアップエラー: ${error.message}`);
  }
}

// コントローラーのセレクト開始
function onSelectStart(event) {
  logDebug(`セレクト開始: ${event.target.name || "不明"}`);
  
  try {
    const controller = event.target;
    
    if (state === 'title') {
      const intersections = getControllerIntersections(controller);
      
      if (intersections.length > 0) {
        const intersection = intersections[0];
        
        if (intersection.object.userData && intersection.object.userData.type === 'button') {
          logDebug(`ボタン押下: ${intersection.object.userData.action}`);
          // ボタンを押した視覚効果
          intersection.object.scale.set(0.9, 0.9, 0.9);
          intersection.object.userData.isPressed = true;
        }
      }
    } else if (state === 'main') {
      // メインシーンでのトリガーアクション
      if (controller.name === "右コントローラー") {
        // 右コントローラーの場合、前進加速
        acceleration.z = -0.01;
      } else if (controller.name === "左コントローラー") {
        // 左コントローラーの場合、後退加速
        acceleration.z = 0.01;
      }
    }
  } catch (error) {
    logDebug(`セレクト開始エラー: ${error.message}`);
  }
}

// コントローラーのセレクト終了
function onSelectEnd(event) {
  logDebug(`セレクト終了: ${event.target.name || "不明"}`);
  
  try {
    const controller = event.target;
    
    if (state === 'title') {
      const intersections = getControllerIntersections(controller);
      
      if (intersections.length > 0) {
        const intersection = intersections[0];
        
        if (intersection.object.userData && 
            intersection.object.userData.type === 'button' &&
            intersection.object.userData.isPressed) {
          
          logDebug(`ボタン実行: ${intersection.object.userData.action}`);
          
          // ボタンをリリース
          intersection.object.scale.set(1.0, 1.0, 1.0);
          intersection.object.userData.isPressed = false;
          
          // ボタンアクション実行
          if (intersection.object.userData.action === 'start') {
            handleStartButtonClick();
          }
        }
      }
    } else if (state === 'main') {
      // メインシーンでのトリガーリリース
      acceleration.z = 0;
    }
  } catch (error) {
    logDebug(`セレクト終了エラー: ${error.message}`);
  }
}

// スクイーズ開始（グリップボタン）
function onSqueezeStart(event) {
  logDebug(`スクイーズ開始: ${event.target.name || "不明"}`);
  
  try {
    const controller = event.target;
    
    if (state === 'main') {
      // 加速
      if (controller.name === "右コントローラー") {
        // 速度上昇
        acceleration.y = 0.01;
      } else if (controller.name === "左コントローラー") {
        // 速度低下
        acceleration.y = -0.01;
      }
    }
  } catch (error) {
    logDebug(`スクイーズ開始エラー: ${error.message}`);
  }
}

// スクイーズ終了
function onSqueezeEnd(event) {
  logDebug(`スクイーズ終了: ${event.target.name || "不明"}`);
  
  try {
    const controller = event.target;
    
    if (state === 'main') {
      // 通常速度に戻す
      acceleration.y = 0;
    }
  } catch (error) {
    logDebug(`スクイーズ終了エラー: ${error.message}`);
  }
}

// コントローラーの交差判定
function getControllerIntersections(controller) {
  try {
    // コントローラーの位置と向きからレイキャスター作成
    const raycaster = new THREE.Raycaster();
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(controller.matrixWorld);
    
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    // 現在の状態に応じて交差判定対象を変更
    let intersectObjects = [];
    
    if (state === 'title') {
      // タイトル画面のすべてのオブジェクト
      intersectObjects = vrTitleGroup.children.filter(obj => 
        obj.userData && obj.userData.type === 'button');
    } else if (state === 'main') {
      // メインシーンのインタラクティブなオブジェクト
      intersectObjects = mainSceneGroup.children.filter(obj => 
        obj.userData && obj.userData.interactive);
    }
    
    return raycaster.intersectObjects(intersectObjects, true);
  } catch (error) {
    logDebug(`交差判定エラー: ${error.message}`);
    return [];
  }
}

// コントローラーの更新
function updateControllers() {
  try {
    if (renderer.xr.isPresenting) {
      // コントローラーのレイキャストを更新
      const controller1 = renderer.xr.getController(0);
      const controller2 = renderer.xr.getController(1);
      
      if (controller1 && controller1.userData && controller1.userData.isController) {
        updateControllerRaycaster(controller1);
      }
      
      if (controller2 && controller2.userData && controller2.userData.isController) {
        updateControllerRaycaster(controller2);
      }
    }
  } catch (error) {
    logDebug(`コントローラー更新エラー: ${error.message}`);
  }
}

// コントローラーのレイキャスト更新
function updateControllerRaycaster(controller) {
  try {
    // 交差判定
    const intersections = getControllerIntersections(controller);
    
    // レイの色を更新
    if (controller.userData.line) {
      // 何かに当たっている場合は色を変える
      if (intersections.length > 0) {
        controller.userData.line.material.color.set(0xffff00);
      } else {
        controller.userData.line.material.color.set(0xffffff);
      }
    }
  } catch (error) {
    logDebug(`レイキャスト更新エラー: ${error.message}`);
  }
} 
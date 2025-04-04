// デバッグ情報表示関数
const debugInfo = document.getElementById('debug-info');
function logDebug(message) {
  console.log(message);
  if (debugInfo) {
    const time = new Date().toLocaleTimeString();
    debugInfo.innerHTML = `[${time}] ${message}<br>` + debugInfo.innerHTML;
    if (debugInfo.innerHTML.length > 5000) {
      debugInfo.innerHTML = debugInfo.innerHTML.substring(0, 5000);
    }
  }
}

// 音声関連
const audioInfo = document.getElementById('audio-info');
let bgmPlaying = false;
let bgm, ambientSound, animalSounds, vehicleSound;

// 音声ファイルのBase64エンコード (実際のプロジェクトでは実際の音声ファイルに置き換える)
const bgmBase64 = 'data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA8TEFNRTMuMTAwBK8AAAAAAAAAABSAJAJAQgAAgAAAA+blPE4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const ambientBase64 = 'data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA8TEFNRTMuMTAwBK8AAAAAAAAAABSAJAJAQgAAgAAAA+blPE4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const animalBase64 = 'data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA8TEFNRTMuMTAwBK8AAAAAAAAAABSAJAJAQgAAgAAAA+blPE4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const vehicleBase64 = 'data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA8TEFNRTMuMTAwBK8AAAAAAAAAABSAJAJAQgAAgAAAA+blPE4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';

// 音声の初期化
function initAudio() {
  try {
    bgm = new Audio(bgmBase64);
    bgm.loop = true;
    bgm.volume = 0.5;
    
    ambientSound = new Audio(ambientBase64);
    ambientSound.loop = true;
    ambientSound.volume = 0.3;
    
    animalSounds = new Audio(animalBase64);
    animalSounds.volume = 0.7;
    
    vehicleSound = new Audio(vehicleBase64);
    vehicleSound.volume = 0.6;
    
    logDebug("オーディオ初期化完了");
  } catch (error) {
    logDebug(`オーディオ初期化エラー: ${error.message}`);
  }
}

// BGM再生/停止
function toggleBGM() {
  try {
    if (bgmPlaying) {
      bgm.pause();
      bgmPlaying = false;
      audioInfo.textContent = "BGM: 停止";
    } else {
      bgm.play();
      bgmPlaying = true;
      audioInfo.textContent = "BGM: 再生中";
    }
  } catch (error) {
    logDebug(`BGM切替エラー: ${error.message}`);
  }
}

// 環境音再生
function playAmbientSound() {
  try {
    ambientSound.play();
  } catch (error) {
    logDebug(`環境音再生エラー: ${error.message}`);
  }
}

// 動物音再生
function playAnimalSound() {
  try {
    animalSounds.play();
  } catch (error) {
    logDebug(`動物音再生エラー: ${error.message}`);
  }
}

// 乗り物音再生
function playVehicleSound() {
  try {
    vehicleSound.play();
  } catch (error) {
    logDebug(`乗り物音再生エラー: ${error.message}`);
  }
}

// 初期化
let scene, camera, renderer;
let grass, ground, trees = [], animals = [], vehicles = [];
let particleSystem, particleCount = 5000;
let clock = new THREE.Clock();
let state = 'init'; // init, title, main
let vrTitleGroup, mainSceneGroup;
let isInVR = false;

// 移動関連
let velocity = { x: 0, y: 0, z: 0 };
let acceleration = { x: 0, y: 0, z: 0 };
const maxSpeed = 0.5;
let autoMove = false;
let playerPosition = new THREE.Vector3(0, 0, 0);
let playerHeight = 1.6; // プレイヤーの目の高さ

// シーン要素参照
const loading = document.getElementById('loading');
const nonVrStart = document.getElementById('non-vr-start');
const mainVrButton = document.getElementById('main-vr-button');

// エラーハンドリング
window.onerror = function(message, source, lineno, colno, error) {
  logDebug(`エラー: ${message} at ${source}:${lineno}`);
  alert("エラーが発生しました: " + message);
  loading.style.display = 'none';
  return true;
}; 
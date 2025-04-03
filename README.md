# 豪華なWebXR VR空間

Three.jsを使用して作成された豪華なVR空間です。広大な草原、木々、湖、動物、乗り物などが配置されています。

## 特徴

- 細かな草が生えた広大な草原
- 高い木々
- 美しい空と湖
- 動物（鹿）
- 乗り物（車）
- WebXR APIを使用したVR体験

## 必要条件

- WebXRをサポートするブラウザ (Oculus Questなどで使用するChrome、Firefox、またはEdge)
- VRヘッドセット (Oculus Quest、HTC Vive、Valve Indexなど)

## 使い方

1. HTTPサーバーを起動します:
```
npx http-server
```

2. ブラウザでアプリケーションにアクセスします（例: `http://localhost:8080`）

3. 「VRモードを開始」ボタンをクリックしてVR体験を開始します。

## 技術スタック

- Three.js - 3Dグラフィックスライブラリ
- WebXR API - VR体験のための標準API

## 注意事項

- VRモードは必ず`local-floor`参照空間タイプを使用します
- VRセッション開始時に`requiredFeatures: ['local-floor']`を指定しています 
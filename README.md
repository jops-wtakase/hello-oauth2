Hello OAuth 2.0
===

- 下記でDockerコンテナを起動してログ出力が安定するまで待つ

```
docker compose build
docker compose up
```

## フロントエンドとなるWebアプリケーションへのアクセス方法

- ブラウザで `http://localhost:5173` にアクセス
- `ログイン` ボタンを押す
  - username: `user01`
  - password: `user01`

## 認可サーバ(Keycloak)管理画面へのアクセス方法

- ブラウザで `http://localhost:8080` にアクセス
  - username: `admin`
  - password: `admin`

Hello OAuth 2.0
===

- 下記でDockerコンテナを起動してログ出力が安定するまで待つ

```
docker compose build
docker compose up
```

## フロントエンドとなるWebアプリケーションへのアクセス方法

- ブラウザで `http://localhost:3000` にアクセス
- 認証情報
  - username: `user01`
  - password: `user01`

## 認可サーバ(Keycloak)管理画面へのアクセス方法

- ブラウザで `http://localhost:8080` にアクセス
  - username: `admin`
  - password: `admin`

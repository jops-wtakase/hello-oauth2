CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    auth_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE todos (
    todo_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO users (auth_user_id)
VALUES
    ('a11f63fc-3626-4c4b-9c2e-8b812c04db57'),
    ('2b8912e1-ad0b-42be-94bd-022bc3d3c39d'),
    ('94d7368d-86df-4d02-818e-203163c1b313'),
    ('b92075fb-ef9e-4008-b3a4-ba011416a4a7'),
    ('d7a9b340-280f-4fd3-883c-1b8967380df4');

INSERT INTO todos (user_id, description)
VALUES
    (2, 'プロジェクト進捗会議の資料を準備する'),
    (2, 'クライアントからのフィードバックを確認し、対応策を考える'),
    (2, '新しい機能の仕様書を作成する'),
    (3, 'データベースのバックアップを取る'),
    (3, '週次のレポートを作成して上司に提出する'),
    (4, 'チームメンバーとの1対1ミーティングを設定する'),
    (4, 'テストケースの作成と実行'),
    (5, '新規プロジェクトの予算案を作成する');

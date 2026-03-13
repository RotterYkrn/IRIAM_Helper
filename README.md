# IRIAM_Helper

ライブ配信アプリ「IRIAM」のライバー向けに、企画を実施した際の集計を支援するWebアプリケーション。

## プロダクト概要

IRIAMにおける配信活動では、リスナー参加型の企画（ギフト数に応じた特典付与など）が頻繁に行われます。
しかし、その多くは手動での集計が必要であり、ライバーの大きな負担となっています。
この課題を解決するため、主要な企画形式に対応した集計サポートツール「IRIAM Helper」を開発しました。

## 対応企画一覧

### カウント型耐久企画

配信に入室した人数など、特定の対象の数をカウントし、目標数を達成する企画です。
企画によっては、救済・妨害と呼ばれる、リスナーがカウント数を変動させるアクションが設定されることがあります。

- 配信をXに共有したら +1 カウント
- 特定のギフトを贈ったら -3 カウント など

この救済・妨害が複数種類設定されているような状況でも、各アクションのボタンをクリックするだけで、
そのアクションに応じたカウントの増減を自動で行います。

### （実装予定）

- 複数の対象を一度にカウントする耐久企画（汎用的なもの）
- ラブカテ耐久
  - LOVE カテゴリーに分類されているギフトをすべて投げてもらうまで耐久する企画
  - 企画を新規作成するときに、あらかじめ対象のギフト一覧について用意したテンプレートを使用してもらう
- 都道府県耐久
  - 配信を視聴してくれたリスナーが住んでいる都道府県を教えてもらい、すべての都道府県を集める耐久企画
- パネル開け
  - 新しいキービジュアルなどのイラストを公開するときによく用いられる企画
  - イラストの上に分割された達成目標付きパネルを用意し、目標を達成したところから部分的に公開する企画

## 技術スタック

### Frontend Core
- Framework: React v19 / Vite v7
- Language: TypeScript v5
- Styling: Tailwind CSS v4
- Routing: React Router v7

### Architecture & Paradigm (★こだわりポイント)
- Architecture: Clean Architecture 意識のディレクトリ構成
- Functional Programming: Effect
  - 副作用管理やバリデーションを型安全に集約。
- State Management: Jotai (+ jotai-family)
  - アトムベースの状態管理により、企画ごとの複雑な計算ロジックを疎結合に実装。

### Data & Infrastructure
- Backend: Supabase (Auth / Database)
- Data Fetching: TanStack Query v5
  - サーバー状態のキャッシュ最適化と非同期処理の宣言的な記述。

### Workflow & Quality Control
- Code Quality (Linter / Formatter)
  - ESLint / Prettier
  - eslint-plugin-import, unused-imports によりインポートを自動整形し、常にクリーンなコードベースを維持。
  - prettier-plugin-tailwindcss を採用し、チーム開発を想定したクラス名の自動ソートを導入。

### CI/CD Pipeline
- GitHub Actions
  - CI: Push 時に Linter / Type Check を自動実行し、品質の低下を防止。
  - CD: main / develop ブランチの変更を自動検知し、 Cloudflare Pages, Supabase へ自動デプロイ。
    - main を本番環境、develop をステージング環境へそれぞれデプロイするよう設定。

4. こだわったポイント（エンジニア向け）
今まさに取り組んでいる「ビルド最適化」や「状態管理」を具体的に書くと評価が高まります。

Jotaiによるステート設計: >   複雑になりがちな依存関係をAtomの分割によって整理し、不要な再レンダリングを抑制。

ビルドの効率化とモジュール管理:
依存関係の整理（循環参照の解消）を行い、拡張性の高いディレクトリ構造（Atomic DesignやClean Architectureの考え方の導入など）を意識。

型安全の追求: >   TypeScriptを最大限活用し、ランタイムエラーを未然に防ぐ堅牢な実装。

5. 動作・機能の紹介（スクリーンショット/GIF）
まだ開発中でも、現在の画面キャプチャを1枚載せるだけで説得力が変わります。

[ここに現在の開発画面の画像を貼る]

6. セットアップ方法
Bash
# 開発環境の起動方法
pnpm install
pnpm dev

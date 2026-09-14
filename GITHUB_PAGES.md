# MathCanvas: GitHub Pagesでの公開と更新

対象リポジトリは `naoki-kitano/Math-site` です。
公開予定URLは `https://naoki-kitano.github.io/Math-site/` です。
この文書のURL記載だけでは公開完了を意味しません。Actionsの成功と実際のページ表示で確認します。

## 初回設定

GitHubのリポジトリで Settings → Pages → Build and deployment → Source を GitHub Actions に設定します。
公開ソースを含む main ブランチへのpushで `.github/workflows/pages.yml` が実行されます。
既にpush済みなら Actions → Publish MathCanvas → Run workflow から実行できます。
非公開リポジトリでPagesを使えるかはGitHubの契約に依存します。必要な契約変更やリポジトリの公開化は、所有者が確認して決めてください。

## 更新

教材の変更をローカルで確認し、mainへpushします。自動検査に合格したものがPagesへ反映されます。
Actionsが失敗した場合、直前の公開版はそのままです。失敗の原因を修正してから再実行してください。

## 手元で公開用ファイルを作る

Node.js 22.13以降とpnpm 10を使用します。依存関係は pnpm-lock.yaml が基準です。

```powershell
pnpm install --frozen-lockfile
pnpm test
pnpm exec tsc --noEmit
pnpm lint
$env:MATHCANVAS_PAGES='1'
$env:NEXT_PUBLIC_SITE_BASE='/Math-site'
pnpm build
node scripts/check-pages.mjs
```

公開するのは `dist/client` だけです。サーバー用ファイルやローカル認証情報は公開しません。
設定なしの通常ビルドは従来のSites向けです。

## 学習記録

学習記録はブラウザとサイトのURLごとに保存されます。
移行前のサイトの「記録」でバックアップを書き出し、新しいサイトの「記録」で取り込んでください。
異なる端末へ自動同期する機能ではありません。

## 今回の対応

- 教材の本文・問題・ID・保存方式は維持。
- GitHub Pages向けリンクには `.html` を付け、直接アクセスでも表示できるようにする。
- `/Math-site/` をHTML生成時とブラウザ動作時で統一し、数式フォント・CSS・JavaScriptも同じ場所を参照する。
- vinextのassetPrefixによる出力先を、Pagesの配置に合わせて公開前検査で整える。
- `scripts/check-pages.mjs` は全HTMLのリンクと読み込み先の実在を確認する。現時点の教材数は113。

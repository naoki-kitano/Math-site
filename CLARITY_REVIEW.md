# MathCanvas 説明・図解改善の記録

この文書は前回の作業コピーでの改善記録。全7分野の追加改善、原本との関係、最新の検証・保存・統合については [SEVEN_SUBJECT_REVIEW.md](SEVEN_SUBJECT_REVIEW.md) を参照。

2026-10-03。ローカル作業コピーで実装・検証。公開、push、マージは行っていない。

## 改善内容

- 466教材・989例題で、最初の手順を先に表示し、次の手順へ進める。全文表示では段階表示を隠し、同じ説明を二重に並べない。全文を閉じると元の段階に戻る。既存の理由、途中式、条件は保持した。
- 学習ページの主操作を「まず例題を1問」とし、最初の例題へ直接移動できるようにした。練習・補足・記録のIDと保存形式は変更していない。
- 「単位円と三角関数」「角を変えた三角関数の値」に、写真を参考にした時計回りの半回転を追加。「位置→長さ→元の点の符号」を分け、回転中の辺の長さと縦座標、回転と反射を区別した。一般の定義・公式・根拠は詳細表示に保存した。
- 「平行移動と対応する点」に、放物線と三点を右へ2、上へ1動かす図解を追加。元の横座標に戻すため式の中では2を引くことを説明し、三点の観察だけでなく一般の点でも成り立つ根拠を残した。
- 両図解に再生、停止、リセット、段階切替、動きを減らす設定を用意。単位円にはキーボードでも操作できるスライダーを追加した。再生ボタンはスマホでも図の直後に置いた。
- 最終確認で単位円の初期表示警告を検出。Workerとブラウザでの三角関数の微小な計算差を、描画座標を小数2桁で出力して解消した。数学的な座標や回転の計算は変更していない。

## 選定と確認範囲

全466教材・11,111問の構造監査と、本文量・例題数の棚卸しを行った。全問を一つずつ独立に再査読したという意味ではない。棚卸しは `outputs/clarity-audit/lessons.json`、構造監査は `outputs/site-audit`、前提対応監査は `outputs/prerequisites` にある。

平方完成の面積組替えも比較検討したが、負の変数への適用に追加条件の説明が必要になるため、今回は既存の一般性を保つ段階表示を適用した。極限・微積分・確率の条件や場合分けも機械的に削らず、共通表示の改善を適用した。

添付画像は `../reference/20261002_102147017_iOS.jpg`（470,149 bytes）として実際に取得・目視確認した。Library IDは `libfile_dca2d9946ce88191b41795e51d18b717`。前回、Windowsの拡張属性非対応を、公式ヘルパー自体を変更せずNTFSの実拡張属性を使う互換処理で解決した。

gpt-6-astra一名の読み取り専用レビューで、剛体半回転、元の符号、反射との区別、平行移動の式、理由・条件の保存に必須修正なし。初期段階では点Pの座標を伏せる提案を採用し、再確認済み。数学内容の査読と画面検証は分けて実施した。

## 検証

- 最終コードの設定済みテスト153件成功。全科目の索引カード・全教材の紹介文を実表示部品で検査する既存回帰テストも含む。
- TypeScript、ESLint成功。
- `audit-prerequisites.mjs`：107短問・530対応規則、エラー0。
- `check-math-motion.mjs`：開発・Pages静的形式、1100px/390px（タッチ有効）で再生・停止・再開・リセット、段階切替、スライダーのキーボード操作、詳細表示、例題の段階/全文表示、主操作の移動を確認。OS・手動のreduced motionも確認。
- 同検査で実行時エラー・React等のコンソールエラー・未処理TeX・数式エラー・ページ横はみ出し0。KaTeX_Mathの実フォント読込を確認。
- `check-math-rendering.mjs`：開発・静的形式で既存12表示条件（6経路×2幅）、暗色背景の数式色を確認。静的HTML全477件の本文で未処理TeX0。
- `check-deep-review.mjs`：開発・静的形式、1100px/390pxで5段階の前提遡及、誤答分岐、親の回答保持、再読込、ひとつ前/元問題への復帰、同操作の練習、reviewOf、補助閲覧を自力成功にしないこと、不正経路を検査。
- 通常ビルド、Pagesビルド成功。`check-pages.mjs`：477 HTML・10,832内部参照を確認。
- PC・スマホの図解、例題、数式のスクリーンショットを目視確認。証跡は `outputs/clarity-dev`、`outputs/clarity-static`、`outputs/math-rendering`、`outputs/prerequisites`。コマンドログは `outputs/final-validation`。

実機スマートフォン、Safari/Firefox、全989例題の全操作、低速回線での性能は今回の検証範囲外。既知の500kB超バンドル警告は残る。開発環境のCloudflareリクエスト情報取得はネットワーク制約で代替値となるが、本教材の静的表示・学習記録はこの情報を使わない。開発版の既存復習検査で一度リソース404のコンソールメッセージがあり、機能検査は全条件成功。新図解の最終検査と静的検査に同じ問題はない。

## 保存と復元

元の作業場所：`C:\Users\naoch\Documents\Codex\2026-08-14\chatgpt-codex-chatgpt-chatgpt-chat-work-2`。
公開用別チェックアウト：同フォルダーの `work/github-pages-source`（`naoki-kitano/Math-site`、HEAD `d3c41bd95fca3c4769d57f319ca6b147b043fc35`）。2026-10-03再開時に変更なし。

本体はコミットなし・全ソース未登録だったため、元を編集せず、この `MathCanvas` を独立コピーとして作業した。元ソース300ファイルと旧版ZIPをSHA-256で照合し、再開時・検証時とも元に変更なし。`outputs/final-validation/preservation.json` 参照。

- 元の保存：`../backup-before-20261002/original-source.zip` と `manifest.json`。ソース・設定・Git情報300ファイルを含む。
- 再開時の改善版の追加保存：`../backup-before-20261003-final-fix.zip`。初期表示の微調整前の変更対象10ファイルを保存・照合済み。
- 再生成可能な依存関係・ビルドキャッシュ、別作業の `work`・`outputs` は旧版ZIPに含まれず、元フォルダーで保全。作業コピーの依存関係のジャンクションはコピー内だけを参照する。

元の版を使うには未変更の元フォルダーを開く。ZIPから再構成する場合は新しい空フォルダーへ展開し、manifestのSHA-256で照合してロックファイルに従い依存関係を準備する。既存フォルダーの上書き・Git resetは不要。

## 作業版を確認する

このPC限定のプレビュー：`http://127.0.0.1:3013/Math-site/`。

- 単位円：`http://127.0.0.1:3013/Math-site/learn/trig-unit-circle.html#basics`
- 角の変換：`http://127.0.0.1:3013/Math-site/learn/trig-angle-change.html#basics`
- 放物線：`http://127.0.0.1:3013/Math-site/learn/m1-parabola-translation.html#basics`
- 段階表示：`http://127.0.0.1:3013/Math-site/learn/rational.html#first-example`

プレビュー停止後に再開する場合は、PowerShellで次を実行する。静的成果物を読むだけで公開操作はない。

```powershell
Set-Location 'C:\Users\naoch\Documents\Codex\2026-10-02\task\MathCanvas'
& 'C:\Users\naoch\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/preview-pages.mjs
```

ユーザーの既存ブラウザプロファイルは検査に使用していない。プレビューの学習記録は既存公開サイトとは異なるローカルの保存先になる。

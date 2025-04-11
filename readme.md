#構成


/components/
  /TreeEditor/
    index.tsx                 # メインコンポーネント
    types.ts                  # 型定義
    constants.ts              # 定数定義
    TreeEditorContext.tsx     # Context API (状態管理)
    /hooks/
      useGeolocation.ts       # 位置情報取得ロジック
      useTreeData.ts          # 樹木データ操作ロジック
      useCoordinates.ts       # 座標変換ロジック
    /components/
      ControlPanel.tsx        # 左側の編集パネル
      TreePreview.tsx         # 右側のプレビュー
      ReferencePointInput.tsx # 基準点入力コンポーネント
      TreeList.tsx            # 樹木リスト
      TreeForm.tsx            # 樹木編集フォーム

      
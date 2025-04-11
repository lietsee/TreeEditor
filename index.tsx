import React from 'react';
import { TreeEditorProvider, useTreeEditor  } from './TreeEditorContext';
import { ControlPanel } from './components/ControlPanel';
import { TreePreview } from './components/TreePreview';

// DataDisplay コンポーネントを TreeEditorProvider の外に定義
const DataDisplay = () => {
  const { referencePoint, trees } = useTreeEditor();
  
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">入力されたデータ:</h2>
      <pre className="whitespace-pre-wrap bg-white p-2 rounded border text-sm">
        {JSON.stringify({
          referencePoint: {
            latitude: parseFloat(referencePoint.latitude.toFixed(6)),
            longitude: parseFloat(referencePoint.longitude.toFixed(6))
          },
          trees: trees.map(tree => ({
            id: tree.id,
            name: tree.name,
            type: tree.type,
            trunkDiameter: parseFloat(tree.trunkDiameter.toFixed(2)),
            crownWidth: parseFloat(tree.crownWidth.toFixed(1)),
            height: parseFloat(tree.height.toFixed(1)),
            latitude: parseFloat(tree.latitude.toFixed(6)),
            longitude: parseFloat(tree.longitude.toFixed(6))
          }))
        }, null, 2)}
      </pre>
    </div>
  );
};

const TreeVisualEditor: React.FC = () => {
  return (
    <TreeEditorProvider>
      <div className="w-full max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6">樹木サイズ・位置 視覚的編集アプリ</h1>
        <p className="text-center text-gray-600 mb-4">
          スライダーを動かして樹木のサイズを調整し、緯度経度で位置を指定できます
        </p>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左側: 編集パネル */}
          <ControlPanel />
          
          {/* 右側: 視覚的表示 */}
          <TreePreview />
        </div>
        
        <DataDisplay />
      </div>
    </TreeEditorProvider>
  );
};

export default TreeVisualEditor;
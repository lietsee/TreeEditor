import React from 'react';
import { useTreeEditor } from '../TreeEditorContext';
import { ReferencePointInput } from './ReferencePointInput';
import { TreeForm } from './TreeForm';
import { TreeList } from './TreeList';

export const ControlPanel: React.FC = () => {
  const { 
    selectedTree, 
    selectedTreeId, 
    deleteTree, 
    addNewTree, 
    updateTree, 
    saveData 
  } = useTreeEditor();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTree(selectedTreeId, 'name', e.target.value);
  };

  return (
    <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded shadow">
      {/* 基準点設定 */}
      <ReferencePointInput />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          選択した樹木
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={selectedTree.name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => deleteTree(selectedTreeId)}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={selectedTree === undefined}
          >
            削除
          </button>
        </div>
      </div>
      
      {/* 樹木の詳細フォーム */}
      <TreeForm />
      
      <div className="mt-6">
        <button
          onClick={addNewTree}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-2"
        >
          + 新しい樹木を追加
        </button>
        
        <button
          onClick={saveData}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          データを保存
        </button>
      </div>
      
      {/* 樹木一覧 */}
      <TreeList />
    </div>
  );
};
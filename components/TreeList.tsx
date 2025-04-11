import React from 'react';
import { useTreeEditor } from '../TreeEditorContext';

export const TreeList: React.FC = () => {
  const { trees, selectedTreeId, setSelectedTreeId } = useTreeEditor();

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">すべての樹木:</h3>
      <div className="space-y-2">
        {trees.map(tree => (
          <div 
            key={tree.id}
            className={`p-2 rounded cursor-pointer flex justify-between items-center ${
              tree.id === selectedTreeId ? 'bg-blue-100 border border-blue-500' : 'bg-white border'
            }`}
            onClick={() => setSelectedTreeId(tree.id)}
          >
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: tree.color }}
              ></div>
              <span>{tree.name}</span>
            </div>
            <div className="text-xs text-gray-500">
              {tree.type} • {tree.height.toFixed(1)}m高
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
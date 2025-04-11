import { useState, useCallback } from 'react';
import { TreeData, ReferencePoint } from '../types';
import { TREE_COLORS, TREE_TYPES } from '../constants';

export const useTreeData = (initialReferencePoint: ReferencePoint) => {
  const [trees, setTrees] = useState<TreeData[]>([{
    id: 1,
    name: '樹木1',
    trunkDiameter: 0.4,
    crownWidth: 3,
    height: 5,
    color: '#228B22',
    type: '広葉樹',
    latitude: initialReferencePoint.latitude + 0.0002,
    longitude: initialReferencePoint.longitude + 0.0002
  }]);
  
  const [selectedTreeId, setSelectedTreeId] = useState(1);
  
  // 選択された樹木を取得
  const selectedTree = trees.find(t => t.id === selectedTreeId) || trees[0];
  
  // 新しい樹木を追加
  const addNewTree = useCallback((referencePoint: ReferencePoint) => {
    const newId = Math.max(...trees.map(t => t.id)) + 1;
    const newColor = TREE_COLORS[Math.floor(Math.random() * TREE_COLORS.length)];
    
    // 基準点の近くにランダムな位置を設定
    const latOffset = (Math.random() - 0.5) * 0.002;
    const lonOffset = (Math.random() - 0.5) * 0.002;
    
    setTrees(prevTrees => [
      ...prevTrees,
      {
        id: newId,
        name: `樹木${newId}`,
        trunkDiameter: 0.3,
        crownWidth: 2.5,
        height: 4,
        color: newColor,
        type: '広葉樹',
        latitude: referencePoint.latitude + latOffset,
        longitude: referencePoint.longitude + lonOffset
      }
    ]);
    setSelectedTreeId(newId);
  }, [trees]);
  
  // 樹木を削除
  const deleteTree = useCallback((id: number) => {
    if (trees.length <= 1) return;
    
    const newTrees = trees.filter(t => t.id !== id);
    setTrees(newTrees);
    setSelectedTreeId(newTrees[0].id);
  }, [trees]);
  
  // 樹木のプロパティを更新
  const updateTree = useCallback((id: number, field: keyof TreeData, value: any) => {
    setTrees(prevTrees => prevTrees.map(tree => 
      tree.id === id ? { ...tree, [field]: value } : tree
    ));
  }, []);
  
  // データの保存
  const saveData = useCallback(() => {
    console.log('保存されたデータ:', trees);
    alert('データが保存されました！');
  }, [trees]);

  return {
    trees,
    selectedTreeId,
    selectedTree,
    setSelectedTreeId,
    addNewTree,
    deleteTree,
    updateTree,
    saveData
  };
};
import React from 'react';
import { useTreeEditor } from '../TreeEditorContext';

export const TreePreview: React.FC = () => {
  const { 
    trees, 
    selectedTreeId, 
    setSelectedTreeId, 
    referencePoint,
    viewRadius,
    setViewRadius,
    previewSize,
    geoToPixel
  } = useTreeEditor();

  const handleViewRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseFloat(e.target.value);
    setViewRadius(newRadius);
  };

  return (
    <div className="w-full md:w-2/3 bg-gray-100 border rounded p-4 shadow">
      <div className="relative w-full h-96 bg-white border border-gray-300 overflow-auto" id="previewContainer">
        <div className="relative h-full w-full">
          {/* グリッド背景 */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-gray-100"></div>
            ))}
          </div>
          
          {/* X軸 */}
          <div className="absolute left-0 top-1/2 w-full h-px bg-gray-400 z-5"></div>
          
          {/* Y軸 */}
          <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400 z-5"></div>
          
          {/* 目盛り - X軸 (水平) */}
          <div className="absolute left-0 top-1/2 w-full h-6 pointer-events-none">
            {Array.from({ length: 11 }).map((_, i) => {
              const value = (i - 5) * (viewRadius / 5); // スケールに応じた値
              return (
                <div 
                  key={i} 
                  className="absolute text-xs text-gray-500 transform -translate-x-1/2 translate-y-2" 
                  style={{ left: `${i * 10}%` }}
                >
                  {value.toFixed(0)}m
                </div>
              );
            })}
          </div>
          
          {/* 目盛り - Y軸 (垂直) */}
          <div className="absolute left-1/2 top-0 h-full w-6 pointer-events-none">
            {Array.from({ length: 11 }).map((_, i) => {
              const value = (5 - i) * (viewRadius / 5); // スケールに応じた値 (上が正、下が負)
              return (
                <div 
                  key={i} 
                  className="absolute text-xs text-gray-500 transform -translate-y-1/2 -translate-x-4" 
                  style={{ top: `${i * 10}%` }}
                >
                  {value.toFixed(0)}m
                </div>
              );
            })}
          </div>
          
          {/* 基準点マーカー */}
          <div 
            className="absolute w-2 h-2 rounded-full bg-blue-500 opacity-70 z-20"
            style={{ 
              left: `${previewSize.width / 2}px`,
              top: `${previewSize.height / 2}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 whitespace-nowrap mt-1">
              <div className="px-2 py-1 bg-blue-100 rounded text-xs border border-blue-300">
                基準点 ({referencePoint.latitude.toFixed(6)}, {referencePoint.longitude.toFixed(6)})
              </div>
            </div>
          </div>
          
          {/* 樹木アイテム - 選択されていないものを先に表示 */}
          {trees
            .filter(tree => tree.id !== selectedTreeId)
            .map((tree) => {
              // 緯度経度からピクセル位置を計算
              const position = geoToPixel(tree.latitude, tree.longitude);
              
              // 樹冠サイズを計算 (スケール係数を計算)
              const scaleFactor = (previewSize.width / 2) / viewRadius;
              const crownSizePx = tree.crownWidth * scaleFactor;
              const trunkSizePx = tree.trunkDiameter * scaleFactor;
              
              return (
                <div
                  key={tree.id}
                  className="absolute"
                  style={{
                    width: `${crownSizePx}px`,
                    height: `${crownSizePx}px`,
                    borderRadius: '50%',
                    backgroundColor: tree.color,
                    opacity: 0.7,
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    zIndex: 1,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedTreeId(tree.id)}
                >
                  {/* 幹 */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${trunkSizePx}px`,
                      height: `${trunkSizePx}px`,
                      backgroundColor: '#8B4513',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 0
                    }}
                  ></div>
                  
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 whitespace-nowrap">
                    <div className="px-2 py-1 bg-white/80 rounded text-xs shadow">
                      {tree.name} • {tree.latitude.toFixed(5)}, {tree.longitude.toFixed(5)}
                    </div>
                  </div>
                </div>
              );
            })}
            
          {/* 選択された樹木を最前面に表示 */}
          {trees
            .filter(tree => tree.id === selectedTreeId)
            .map((tree) => {
              // 緯度経度からピクセル位置を計算
              const position = geoToPixel(tree.latitude, tree.longitude);
              
              // 樹冠サイズを計算 (スケール係数を計算)
              const scaleFactor = (previewSize.width / 2) / viewRadius;
              const crownSizePx = tree.crownWidth * scaleFactor;
              const trunkSizePx = tree.trunkDiameter * scaleFactor;
              
              return (
                <div
                  key={tree.id}
                  className="absolute ring-2 ring-blue-500"
                  style={{
                    width: `${crownSizePx}px`,
                    height: `${crownSizePx}px`,
                    borderRadius: '50%',
                    backgroundColor: tree.color,
                    opacity: 1.0, // 選択された樹木は完全に不透明に
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    zIndex: 10, // 最前面に表示するための高いzIndex
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // 影を追加して浮き上がって見せる
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedTreeId(tree.id)}
                >
                  {/* 幹 */}
                  <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                      width: `${trunkSizePx}px`,
                      height: `${trunkSizePx}px`,
                      backgroundColor: '#8B4513',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 0
                    }}
                  ></div>
                  
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 whitespace-nowrap">
                    <div className="px-2 py-1 bg-white/90 rounded text-xs font-bold shadow-md border border-blue-300">
                      {tree.name} • {tree.type} • {tree.height.toFixed(1)}m高
                    </div>
                  </div>
                  
                  {/* 樹木の寸法と位置を表示 */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 whitespace-nowrap">
                    <div className="px-2 py-1 bg-white/90 rounded text-xs shadow-md border border-gray-300">
                      幹: {tree.trunkDiameter.toFixed(2)}m • 樹冠: {tree.crownWidth.toFixed(1)}m • 位置: {tree.latitude.toFixed(6)}, {tree.longitude.toFixed(6)}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 gap-2 items-center">
          <div>表示範囲: {viewRadius}m</div>
          <div className="italic">クリックして樹木を選択、左側のパネルでサイズと位置を調整</div>
        </div>
        
        {/* 拡大縮小スライダー */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">1m</span>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={viewRadius}
            onChange={handleViewRadiusChange}
            className="w-full"
          />
          <span className="text-xs text-gray-500">100m</span>
        </div>
      </div>
    </div>
  );
};
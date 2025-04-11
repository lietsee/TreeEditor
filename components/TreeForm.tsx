import React from 'react';
import { useTreeEditor } from '../TreeEditorContext';
import { TREE_TYPES } from '../constants';

export const TreeForm: React.FC = () => {
  const { 
    selectedTree, 
    updateTree, 
    isGeoLoading, 
    geoProgress, 
    getCurrentLocation 
  } = useTreeEditor();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTree(selectedTree.id, 'name', e.target.value);
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTree(selectedTree.id, 'type', e.target.value);
  };
  
  const handleTrunkDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiameter = parseFloat(e.target.value) || 0;
    updateTree(selectedTree.id, 'trunkDiameter', Math.max(0.1, newDiameter));
  };
  
  const handleTrunkDiameterSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiameter = parseFloat(e.target.value);
    updateTree(selectedTree.id, 'trunkDiameter', newDiameter);
  };
  
  const handleCrownWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseFloat(e.target.value) || 0;
    updateTree(selectedTree.id, 'crownWidth', Math.max(0.5, newWidth));
  };
  
  const handleCrownWidthSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseFloat(e.target.value);
    updateTree(selectedTree.id, 'crownWidth', newWidth);
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseFloat(e.target.value) || 0;
    updateTree(selectedTree.id, 'height', Math.max(0.5, newHeight));
  };
  
  const handleHeightSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseFloat(e.target.value);
    updateTree(selectedTree.id, 'height', newHeight);
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLat = parseFloat(e.target.value);
    if (!isNaN(newLat)) {
      updateTree(selectedTree.id, 'latitude', newLat);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLon = parseFloat(e.target.value);
    if (!isNaN(newLon)) {
      updateTree(selectedTree.id, 'longitude', newLon);
    }
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          樹木の種類
        </label>
        <select
          value={selectedTree.type}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TREE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      {/* 位置情報（緯度経度）*/}
      <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
        <h3 className="font-medium text-green-800 mb-2">樹木の位置</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-gray-700 mb-1">緯度</label>
            <input
              type="number"
              value={selectedTree.latitude}
              onChange={handleLatitudeChange}
              step="0.0001"
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">経度</label>
            <input
              type="number"
              value={selectedTree.longitude}
              onChange={handleLongitudeChange}
              step="0.0001"
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <button
          onClick={() => getCurrentLocation(true)}
          disabled={isGeoLoading}
          className="w-full mt-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
        >
          {isGeoLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>取得中... ({geoProgress.current}/{geoProgress.total})</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>現在地をこの樹木の位置に設定 (高精度)</span>
            </>
          )}
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          幹の直径 (メートル): {selectedTree.trunkDiameter.toFixed(2)}m
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.05"
            value={selectedTree.trunkDiameter}
            onChange={handleTrunkDiameterSlider}
            className="w-full"
          />
          <input
            type="number"
            value={selectedTree.trunkDiameter}
            onChange={handleTrunkDiameterChange}
            step="0.05"
            min="0.1"
            max="2"
            className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>m</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          樹冠の幅 (メートル): {selectedTree.crownWidth.toFixed(1)}m
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.5"
            max="15"
            step="0.1"
            value={selectedTree.crownWidth}
            onChange={handleCrownWidthSlider}
            className="w-full"
          />
          <input
            type="number"
            value={selectedTree.crownWidth}
            onChange={handleCrownWidthChange}
            step="0.1"
            min="0.5"
            max="15"
            className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>m</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          高さ (メートル): {selectedTree.height.toFixed(1)}m
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.5"
            max="30"
            step="0.5"
            value={selectedTree.height}
            onChange={handleHeightSlider}
            className="w-full"
          />
          <input
            type="number"
            value={selectedTree.height}
            onChange={handleHeightChange}
            step="0.5"
            min="0.5"
            max="30"
            className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>m</span>
        </div>
      </div>
    </>
  );
};
import React from 'react';
import { useTreeEditor } from '../TreeEditorContext';

export const ReferencePointInput: React.FC = () => {
  const { 
    referencePoint, 
    setReferencePoint, 
    isGeoLoading, 
    geoError, 
    geoProgress,
    getCurrentLocation 
  } = useTreeEditor();

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferencePoint({
      ...referencePoint,
      latitude: parseFloat(e.target.value) || 0
    });
  };

  const handleLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferencePoint({
      ...referencePoint,
      longitude: parseFloat(e.target.value) || 0
    });
  };

  return (
    <div className="mb-6 p-3 bg-blue-50 rounded border border-blue-200">
      <h3 className="font-medium text-blue-800 mb-2">基準点（緯度経度）設定</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm text-gray-700 mb-1">緯度</label>
          <input
            type="number"
            value={referencePoint.latitude}
            onChange={handleLatChange}
            step="0.0001"
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">経度</label>
          <input
            type="number"
            value={referencePoint.longitude}
            onChange={handleLonChange}
            step="0.0001"
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        onClick={() => getCurrentLocation(false)}
        disabled={isGeoLoading}
        className="w-full mt-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
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
            <span>現在地を基準点に設定 (高精度)</span>
          </>
        )}
      </button>
      {geoError && (
        <p className="text-xs text-red-500 mt-1">
          エラー: {geoError}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        この位置がプレビュー画面の中心（0,0）となります
      </p>
      {isGeoLoading && (
        <div className="mt-2 text-xs text-gray-600">
          <p>より高い精度を得るために複数回の測位を行っています...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${geoProgress.percent}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};
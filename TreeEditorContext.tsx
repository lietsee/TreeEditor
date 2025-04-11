import React, { createContext, useContext, ReactNode } from 'react';
import { TreeData, ReferencePoint, GeolocationProgress, PreviewSize } from './types';
import { DEFAULT_REFERENCE_POINT } from './constants';
import { useGeolocation } from './hooks/useGeolocation';
import { useTreeData } from './hooks/useTreeData';
import { useCoordinates } from './hooks/useCoordinates';

interface TreeEditorContextType {
  // Geolocation関連
  isGeoLoading: boolean;
  geoError: string | null;
  geoProgress: GeolocationProgress;
  //getCurrentLocation: (callback: (lat: number, lon: number) => void) => void;
  getCurrentLocation: (forTree?: boolean) => void; // 修正: forTreeをオプション引数として追加
  
  // 樹木データ関連
  trees: TreeData[];
  selectedTreeId: number;
  selectedTree: TreeData;
  setSelectedTreeId: (id: number) => void;
  addNewTree: () => void;
  deleteTree: (id: number) => void;
  updateTree: (id: number, field: keyof TreeData, value: any) => void;
  saveData: () => void;
  
  // 座標関連
  referencePoint: ReferencePoint;
  setReferencePoint: (point: ReferencePoint) => void;
  viewRadius: number;
  setViewRadius: (radius: number) => void;
  previewSize: PreviewSize;
  geoToPixel: (lat: number, lon: number) => {x: number, y: number};
}

const TreeEditorContext = createContext<TreeEditorContextType | undefined>(undefined);

export const TreeEditorProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { isGeoLoading, geoError, geoProgress, getCurrentLocation } = useGeolocation();
  const { referencePoint, setReferencePoint, viewRadius, setViewRadius, previewSize, geoToPixel } = useCoordinates(DEFAULT_REFERENCE_POINT);
  const { trees, selectedTreeId, selectedTree, setSelectedTreeId, addNewTree: addTree, deleteTree, updateTree, saveData } = useTreeData(referencePoint);
  
  // addNewTreeをラップしてreferencePointを渡す
  const addNewTree = () => {
    addTree(referencePoint);
  };

  // getCurrentLocationをラップして適切なコールバックを設定
  const getLocation = (forTree = false) => {
    getCurrentLocation((latitude, longitude) => {
      if (forTree) {
        updateTree(selectedTreeId, 'latitude', latitude);
        updateTree(selectedTreeId, 'longitude', longitude);
      } else {
        setReferencePoint({ latitude, longitude });
      }
    });
  };

  const value = {
    isGeoLoading,
    geoError,
    geoProgress,
    getCurrentLocation: getLocation,
    
    trees,
    selectedTreeId,
    selectedTree,
    setSelectedTreeId,
    addNewTree,
    deleteTree,
    updateTree,
    saveData,
    
    referencePoint,
    setReferencePoint,
    viewRadius,
    setViewRadius,
    previewSize,
    geoToPixel
  };

  return (
    <TreeEditorContext.Provider value={value}>
      {children}
    </TreeEditorContext.Provider>
  );
};

export const useTreeEditor = () => {
  const context = useContext(TreeEditorContext);
  if (context === undefined) {
    throw new Error('useTreeEditor must be used within a TreeEditorProvider');
  }
  return context;
};
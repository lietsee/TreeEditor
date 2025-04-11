// 基本的な型定義

export interface TreeData {
    id: number;
    name: string;
    trunkDiameter: number;
    crownWidth: number;
    height: number;
    color: string;
    type: string;
    latitude: number;
    longitude: number;
  }
  
  export interface ReferencePoint {
    latitude: number;
    longitude: number;
  }
  
  export interface GeolocationProgress {
    current: number;
    total: number;
    percent: number;
  }
  
  export interface EnhancedGeolocationOptions {
    numReadings?: number;
    timeout?: number;
    interval?: number;
    minAccuracy?: number;
    progressCallback?: (progress: {
      completed: number;
      total: number;
      percent: number;
      latestReading?: any;
    }) => void;
  }
  
  export interface PreviewSize {
    width: number;
    height: number;
  }
// 定数の集約

export const DEFAULT_REFERENCE_POINT = {
    latitude: 35.6812, // 東京の緯度
    longitude: 139.7671 // 東京の経度
  };
  
  export const TREE_TYPES = [
    '広葉樹', '針葉樹', '花木', '果樹', '常緑樹', '落葉樹'
  ];
  
  export const TREE_COLORS = [
    '#228B22', '#006400', '#556B2F', '#8FBC8F', '#2E8B57', '#3CB371'
  ];
  
  export const DEFAULT_ZOOM = 40; // 1メートル = 40ピクセル
  export const DEFAULT_VIEW_RADIUS = 10; // 10m
  
  export const DEFAULT_GEO_OPTIONS = {
    numReadings: 5,
    timeout: 10000,
    interval: 2000,
    minAccuracy: 50
  };
import { useState, useCallback, useEffect } from 'react';
import { ReferencePoint, PreviewSize } from '../types';
import { DEFAULT_VIEW_RADIUS } from '../constants';

export const useCoordinates = (initialReferencePoint: ReferencePoint) => {
  const [referencePoint, setReferencePoint] = useState<ReferencePoint>(initialReferencePoint);
  const [viewRadius, setViewRadius] = useState(DEFAULT_VIEW_RADIUS);
  const [previewSize, setPreviewSize] = useState<PreviewSize>({ width: 500, height: 400 });
  
  // プレビュー領域のサイズを取得
  const updatePreviewSize = useCallback(() => {
    const container = document.querySelector('.relative.w-full.h-96');
    if (container) {
      setPreviewSize({
        width: container.clientWidth,
        height: container.clientHeight
      });
    }
  }, []);
  
  // コンポーネントマウント時とウィンドウリサイズ時にプレビューサイズを更新
  useEffect(() => {
    updatePreviewSize();
    window.addEventListener('resize', updatePreviewSize);
    return () => window.removeEventListener('resize', updatePreviewSize);
  }, [updatePreviewSize]);
  
  // 緯度経度を画面上の位置（X,Y）に変換
  const geoToPixel = useCallback((lat: number, lon: number) => {
    // 元のコードから移植
    const latDistance = 111000;
    const lonDistance = 111000 * Math.cos(referencePoint.latitude * Math.PI / 180);

    const latDiff = lat - referencePoint.latitude;
    const lonDiff = lon - referencePoint.longitude;

    const yDiff = -latDiff * latDistance;
    const xDiff = lonDiff * lonDistance;

    const centerX = previewSize.width / 2;
    const centerY = previewSize.height / 2;

    const scaleFactor = (previewSize.width / 2) / viewRadius;

    return {
      x: centerX + (xDiff * scaleFactor),
      y: centerY + (yDiff * scaleFactor)
    };
  }, [referencePoint, previewSize, viewRadius]);

  return {
    referencePoint,
    setReferencePoint,
    viewRadius,
    setViewRadius,
    previewSize,
    geoToPixel
  };
};
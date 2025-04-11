import { useState, useCallback } from 'react';
import { EnhancedGeolocationOptions, GeolocationProgress } from '../types';
import { DEFAULT_GEO_OPTIONS } from '../constants';

export const useGeolocation = () => {
  // 型定義
  type Reading = {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
  };

  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoProgress, setGeoProgress] = useState<GeolocationProgress>({ 
    current: 0, total: 0, percent: 0 
  });

  const getEnhancedGeolocation = useCallback((
    successCallback: (position: any) => void,
    errorCallback: (error: any) => void,
    options: EnhancedGeolocationOptions = {}
  ) => {
    // デフォルト設定
    const settings = {
      numReadings: options.numReadings || 5,  // 測位回数
      timeout: options.timeout || 10000,      // タイムアウト(ミリ秒)
      interval: options.interval || 2000,     // 測位間隔(ミリ秒)
      minAccuracy: options.minAccuracy || 0,  // 最低精度(メートル)、0は制限なし
      progressCallback: options.progressCallback || null // 進捗コールバック
    };

    // 読み取りデータを保存する配列
    let readings: any[] = [];
    let completed = 0;
    
    // 初期値を設定
    let bestReading: Reading | null = null;
    
    // 値を更新
    function updateBestReading(newReading: Reading) {
      if (!bestReading || newReading.accuracy < bestReading.accuracy) {
        bestReading = newReading;
      }
    }


    // 進捗状況を報告
    function reportProgress(current: number, total: number, latestReading: any) {
      if (typeof settings.progressCallback === 'function') {
        settings.progressCallback({
          completed: current,
          total: total,
          percent: (current / total) * 100,
          latestReading: latestReading
        });
      }
    }
    
    // 各測位を実行する関数
    function takeReading() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 読み取り結果を保存
          const reading = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            timestamp: position.timestamp
          };
          
          // 精度条件をチェック
          if (settings.minAccuracy === 0 || reading.accuracy <= settings.minAccuracy) {
            readings.push(reading);
            
            // 最良の精度の読み取りを記録
            if (!bestReading || reading.accuracy < bestReading.accuracy) {
              updateBestReading( {latitude: reading.lat, longitude: reading.lng, accuracy: reading.accuracy, altitude: reading.altitude} );
            }
          }
          
          completed++;
          reportProgress(completed, settings.numReadings, reading);
          
          // まだ必要な回数に達していなければ次の測位をスケジュール
          if (completed < settings.numReadings) {
            setTimeout(takeReading, settings.interval);
          } else {
            finalizeReadings();
          }
        },
        (error) => {
          completed++;
          reportProgress(completed, settings.numReadings, null);
          
          // エラーがあっても一定回数まで試行
          if (completed < settings.numReadings) {
            setTimeout(takeReading, settings.interval);
          } else {
            // 有効な読み取りがあれば平均を計算、なければエラー
            if (readings.length > 0) {
              finalizeReadings();
            } else {
              errorCallback(error);
            }
          }
        },
        {
          enableHighAccuracy: true,  // 高精度モードを有効化
          timeout: settings.timeout,
          maximumAge: 0              // キャッシュを使用しない
        }
      );
    }
    
    // 測位結果を集計して返す関数
    function finalizeReadings() {
      if (readings.length === 0) {
        errorCallback({ code: 0, message: "No valid readings obtained" });
        return;
      }
      
      // 平均値を計算
      const avgLat = readings.reduce((sum, r) => sum + r.lat, 0) / readings.length;
      const avgLng = readings.reduce((sum, r) => sum + r.lng, 0) / readings.length;
      
      // 重み付き平均を計算（精度が高いものほど重視）
      let weightedLat = 0, weightedLng = 0, totalWeight = 0;
      readings.forEach(r => {
        // 精度の逆数を重みとする（精度値が小さいほど正確）
        const weight = 1 / Math.max(r.accuracy, 0.1); // ゼロ除算防止
        weightedLat += r.lat * weight;
        weightedLng += r.lng * weight;
        totalWeight += weight;
      });
      
      const result = {
        coords: {
          latitude: totalWeight > 0 ? weightedLat / totalWeight : avgLat,
          longitude: totalWeight > 0 ? weightedLng / totalWeight : avgLng,
          accuracy: bestReading ? bestReading.accuracy : Math.min(...readings.map(r => r.accuracy)),
          altitude: bestReading ? bestReading.altitude : null
        },
        timestamp: Date.now(),
        readings: readings // 元データも含める（オプション）
      };
      
      successCallback(result);
    }
    
    // 最初の測位を開始
    takeReading();
  }, []);

  const getCurrentLocation = useCallback((
    callback: (latitude: number, longitude: number) => void
  ) => {
    if (!navigator.geolocation) {
      setGeoError("お使いのブラウザは位置情報をサポートしていません");
      return;
    }
    
    setIsGeoLoading(true);
    setGeoError(null);
    setGeoProgress({ current: 0, total: 5, percent: 0 });
    
    getEnhancedGeolocation(
      (position) => {
        const { latitude, longitude } = position.coords;
        callback(latitude, longitude);
        setIsGeoLoading(false);
        console.log(`位置情報を取得しました: 精度 ${position.coords.accuracy}m (${position.readings.length}回の測位から算出)`);
      },
      (error) => {
        let errorMsg = "位置情報の取得に失敗しました";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "位置情報へのアクセスが拒否されました";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "位置情報が利用できませんでした";
            break;
          case error.TIMEOUT:
            errorMsg = "位置情報の取得がタイムアウトしました";
            break;
        }
        setGeoError(errorMsg);
        setIsGeoLoading(false);
      },
      {
        ...DEFAULT_GEO_OPTIONS,
        progressCallback: (progress) => {
          setGeoProgress({
            current: progress.completed,
            total: progress.total,
            percent: progress.percent
          });
        }
      }
    );
  }, [getEnhancedGeolocation]);

  return {
    isGeoLoading,
    geoError,
    geoProgress,
    getCurrentLocation
  };
};
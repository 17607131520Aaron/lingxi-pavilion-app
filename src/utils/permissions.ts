import { Alert, Platform } from 'react-native';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import type { Permission } from 'react-native-permissions';

type PermissionResult = 'granted' | 'denied' | 'blocked' | 'unavailable';

async function checkAndRequestPermission(permission: Permission): Promise<PermissionResult> {
  try {
    const result = await check(permission);

    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
      return 'granted';
    }

    if (result === RESULTS.UNAVAILABLE) {
      return 'unavailable';
    }

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      if (requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED) {
        return 'granted';
      }
      if (requestResult === RESULTS.BLOCKED) {
        return 'blocked';
      }
      return 'denied';
    }

    if (result === RESULTS.BLOCKED) {
      return 'blocked';
    }

    return 'denied';
  } catch {
    return 'denied';
  }
}

function showPermissionAlert(title: string, message: string): void {
  Alert.alert(title, message, [
    { text: '取消', style: 'cancel' },
    { text: '去设置', onPress: () => openSettings() },
  ]);
}

export async function requestPhotoPermission(): Promise<boolean> {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

  const result = await checkAndRequestPermission(permission);

  if (result === 'granted') {
    return true;
  }

  if (result === 'blocked') {
    showPermissionAlert('需要相册权限', '请在设置中允许访问相册以选择图片');
  }

  return false;
}

export async function requestCameraPermission(): Promise<boolean> {
  const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const result = await checkAndRequestPermission(permission);

  if (result === 'granted') {
    return true;
  }

  if (result === 'blocked') {
    showPermissionAlert('需要相机权限', '请在设置中允许访问相机以拍摄照片');
  }

  return false;
}

export async function requestMicrophonePermission(): Promise<boolean> {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;

  const result = await checkAndRequestPermission(permission);

  if (result === 'granted') {
    return true;
  }

  if (result === 'blocked') {
    showPermissionAlert('需要麦克风权限', '请在设置中允许访问麦克风以使用语音功能');
  }

  return false;
}

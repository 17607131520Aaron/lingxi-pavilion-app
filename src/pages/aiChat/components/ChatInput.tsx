import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '~/common/colors';
import { requestCameraPermission, requestPhotoPermission } from '~/utils/permissions';

export interface SelectedImage {
  uri: string;
  base64: string;
}

interface ChatInputProps {
  onSend: (message: string, images?: SelectedImage[]) => void;
  onStop?: () => void;
  onAddFile?: () => void;
  onWebSearchToggle?: (enabled: boolean) => void;
  onMic?: () => void;
  isLoading?: boolean;
  webSearchEnabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  onAddFile,
  onWebSearchToggle,
  onMic,
  isLoading = false,
  webSearchEnabled = false,
  placeholder = '输入你的问题...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isWebSearchActive, setIsWebSearchActive] = useState(webSearchEnabled);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const insets = useSafeAreaInsets();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const paddingBottom = keyboardHeight > 0 ? Math.max(keyboardHeight - insets.bottom, 0) : 0;
  const isComposing = inputValue.trim().length > 0;

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = (): void => {
    if ((!inputValue.trim() && selectedImages.length === 0) || isLoading) {
      return;
    }

    onSend(inputValue.trim(), selectedImages.length > 0 ? selectedImages : undefined);
    setInputValue('');
    setSelectedImages([]);
    Keyboard.dismiss();
  };

  const handleStop = (): void => {
    onStop?.();
  };

  const handleAddPress = (): void => {
    Keyboard.dismiss();
    setShowAddMenu(true);
  };

  const handleSelectPhoto = useCallback(async (): Promise<void> => {
    setShowAddMenu(false);

    const hasPermission = await requestPhotoPermission();
    if (!hasPermission) return;

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 1024,
        maxWidth: 1024,
        quality: 0.8,
        selectionLimit: 9,
      });

      if (!isMountedRef.current) return;

      if (result.didCancel || result.errorCode) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const newImages: SelectedImage[] = result.assets
          .filter((asset) => asset.base64 && asset.uri)
          .map((asset) => ({
            uri: asset.uri as string,
            base64: asset.base64 as string,
          }));
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      console.log('Image picker error:', error);
    }
  }, []);

  const handleTakePhoto = useCallback(async (): Promise<void> => {
    setShowAddMenu(false);

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 1024,
        maxWidth: 1024,
        quality: 0.8,
      });

      if (!isMountedRef.current) return;

      if (result.didCancel || result.errorCode) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64 && asset.uri) {
          setSelectedImages((prev) => [
            ...prev,
            { uri: asset.uri as string, base64: asset.base64 as string },
          ]);
        }
      }
    } catch (error) {
      console.log('Camera error:', error);
    }
  }, []);

  const handleRemoveImage = (index: number): void => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMenuAction = (action?: () => void): void => {
    setShowAddMenu(false);
    action?.();
  };

  const handleWebSearchToggle = (): void => {
    const newState = !isWebSearchActive;
    setIsWebSearchActive(newState);
    setShowAddMenu(false);
    onWebSearchToggle?.(newState);
  };

  const getSendButtonBgColor = (): string => {
    if (isLoading) return colors.danger;
    if (isComposing || selectedImages.length > 0) return colors.brandPrimary;
    return colors.surfaceBackground;
  };

  const getSendButtonIconColor = (): string => {
    if (isLoading || isComposing || selectedImages.length > 0) return colors.white;
    return colors.textGray;
  };

  return (
    <View style={[styles.container, { paddingBottom: paddingBottom + 4 }]}>
      {selectedImages.length > 0 && (
        <ScrollView
          horizontal
          contentContainerStyle={styles.imagePreviewContent}
          showsHorizontalScrollIndicator={false}
          style={styles.imagePreviewContainer}
        >
          {selectedImages.map((image, index) => (
            <View key={`${image.uri}-${index}`} style={styles.imagePreviewItem}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.imageRemoveButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Icon color={colors.white} name='close-circle' size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.addButton, isWebSearchActive && styles.addButtonActive]}
          onPress={handleAddPress}
        >
          <Icon
            color={isWebSearchActive ? colors.brandPrimary : colors.textGray}
            name='plus'
            size={24}
          />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            multiline
            editable={!isLoading}
            maxLength={2000}
            placeholder={isWebSearchActive ? '联网搜索中...' : placeholder}
            placeholderTextColor={isWebSearchActive ? colors.brandPrimary : colors.textGray}
            returnKeyType='send'
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.micButton} onPress={onMic}>
            <Icon color={colors.textGray} name='microphone-outline' size={22} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: getSendButtonBgColor() }]}
          onPress={isLoading ? handleStop : handleSend}
        >
          <Icon color={getSendButtonIconColor()} name={isLoading ? 'stop' : 'arrow-up'} size={20} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType='slide'
        visible={showAddMenu}
        onRequestClose={() => setShowAddMenu(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowAddMenu(false)}>
          <View style={[styles.menuContainer, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.menuRow}>
              <TouchableOpacity style={styles.menuItem} onPress={handleSelectPhoto}>
                <View style={styles.menuIconContainer}>
                  <Icon color={colors.textMain} name='image-outline' size={28} />
                </View>
                <Text style={styles.menuLabel}>相册</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleTakePhoto}>
                <View style={styles.menuIconContainer}>
                  <Icon color={colors.textMain} name='camera-outline' size={28} />
                </View>
                <Text style={styles.menuLabel}>拍摄</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction(onAddFile)}>
                <View style={styles.menuIconContainer}>
                  <Icon color={colors.textMain} name='file-outline' size={28} />
                </View>
                <Text style={styles.menuLabel}>文件</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleWebSearchToggle}>
                <View
                  style={[
                    styles.menuIconContainer,
                    isWebSearchActive && styles.menuIconContainerActive,
                  ]}
                >
                  <Icon
                    color={isWebSearchActive ? colors.brandPrimary : colors.textMain}
                    name='web'
                    size={28}
                  />
                </View>
                <Text style={[styles.menuLabel, isWebSearchActive && styles.menuLabelActive]}>
                  联网搜索
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  imagePreviewContainer: {
    maxHeight: 100,
    marginBottom: 8,
  },
  imagePreviewContent: {
    gap: 8,
  },
  imagePreviewItem: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.surfaceBackground,
  },
  imageRemoveButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.textGray,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonActive: {
    backgroundColor: colors.tagBlueBg,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceBackground,
    borderRadius: 24,
    paddingLeft: 16,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMain,
    paddingVertical: 10,
  },
  micButton: {
    padding: 8,
    marginRight: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayBg,
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.surfaceBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 12,
    color: colors.textMain,
    marginTop: 8,
  },
  menuLabelActive: {
    color: colors.brandPrimary,
  },
  menuIconContainerActive: {
    backgroundColor: colors.tagBlueBg,
  },
});

export default ChatInput;

declare module 'react-native-image-picker' {
  export type Asset = {
    uri?: string;
    base64?: string;
    type?: string;
    fileName?: string;
  };

  export type ImageLibraryOptions = {
    mediaType?: 'photo' | 'video' | 'mixed';
    selectionLimit?: number;
    includeBase64?: boolean;
    quality?: number;
  };

  export type ImagePickerResponse = {
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
    assets?: Asset[];
  };

  export function launchImageLibrary(
    options: ImageLibraryOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;
}

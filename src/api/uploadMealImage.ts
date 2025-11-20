import type { UploadImagePayload } from 'types/upload';

export const uploadMealImage = async (
  uploadUrl: string,
  payload: UploadImagePayload
) => {
  if (!payload.uri) {
    throw new Error('이미지 URI가 없습니다.');
  }
  const mime = payload.mimeType ?? 'image/jpeg';
  console.log('>>> uploadMealImage URI 업로드 준비', {
    uploadUrl,
    mime,
    uri: payload.uri,
  });

  let blob: Blob;
  try {
    const fileResponse = await fetch(payload.uri);
    blob = await fileResponse.blob();
  } catch (fileError) {
    if (fileError instanceof Error) {
      console.error('>>> uploadMealImage URI fetch 실패', {
        name: fileError.name,
        message: fileError.message,
        stack: fileError.stack,
      });
    } else {
      console.error(
        '>>> uploadMealImage URI fetch 실패 (non-error)',
        fileError
      );
    }
    throw fileError;
  }

  console.log('>>> uploadMealImage 요청 준비', {
    uploadUrl,
    mime,
    blobSize: blob.size,
  });

  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mime,
      },
      body: blob,
    });
  } catch (networkError) {
    if (networkError instanceof Error) {
      console.error('>>> uploadMealImage fetch 실패', {
        name: networkError.name,
        message: networkError.message,
        stack: networkError.stack,
      });
    } else {
      console.error('>>> uploadMealImage fetch 실패 (non-error)', networkError);
    }
    throw networkError;
  }

  console.log('>>> uploadMealImage response status:', response.status);

  if (!response.ok) {
    let errorBody = '';
    try {
      errorBody = await response.text();
      console.log('>>> uploadMealImage error body:', errorBody);
    } catch {
      // ignore body parsing error
    }
    throw new Error(
      `>>> 이미지 업로드에 실패했습니다. status=${response.status}, body=${errorBody}`
    );
  }

  return {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
  };
};

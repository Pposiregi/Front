import type { UploadImagePayload } from 'types/upload';

export const uploadMealImage = async (
  uploadUrl: string,
  payload: UploadImagePayload
) => {
  if (!payload.base64) {
    throw new Error('이미지 데이터가 없습니다.');
  }

  const mime = payload.mimeType ?? 'image/jpeg';
  const dataUrl = `data:${mime};base64,${payload.base64}`;
  const blob = await fetch(dataUrl).then((res) => res.blob());

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mime,
    },
    body: blob,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }
};

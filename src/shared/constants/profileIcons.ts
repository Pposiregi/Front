const S3_BASE =
  'https://slimpet-bucket.s3.ap-northeast-2.amazonaws.com/profile-presets';

export const DEFAULT_PROFILE_URL = `${S3_BASE}/image_01.png`;

export const PROFILE_PRESET_URLS: string[] = [
  `${S3_BASE}/image_01.png`,
  `${S3_BASE}/image_02.png`,
  `${S3_BASE}/image_03.png`,
  `${S3_BASE}/image_04.png`,
  `${S3_BASE}/image_05.png`,
  `${S3_BASE}/image_06.png`,
  `${S3_BASE}/image_07.png`,
  `${S3_BASE}/image_08.png`,
  `${S3_BASE}/image_09.png`,
];

export const SECRET_TARGET_URL = `${S3_BASE}/image_07.png`;

export const SECRET_PRESET_URLS: string[] = [
  `${S3_BASE}/image_anime01.jpg`,
  `${S3_BASE}/image_anime02.jpg`,
  `${S3_BASE}/image_anime03.jpg`,
  `${S3_BASE}/image_anime04.jpg`,
  `${S3_BASE}/image_GigaChad.jpg`,
  `${S3_BASE}/image_Poketmon_Snorlax.jpg`,
];

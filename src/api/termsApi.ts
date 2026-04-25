import apiClient from './httpClient';

export type TermsResponse = {
  termsId: number;
  termsCode: string;
  title: string;
  content: string;
  isRequired: boolean;
  version: string;
  effectiveDate: string;
};

/**
 * 현재 유효한 약관 목록을 가져온다.
 * - version을 지정하면 해당 버전의 약관을 반환한다.
 */
export const getTerms = async (version?: string): Promise<TermsResponse[]> => {
  const response = await apiClient.get<TermsResponse[]>('/terms', {
    params: version ? { version } : undefined,
  });
  return response.data;
};

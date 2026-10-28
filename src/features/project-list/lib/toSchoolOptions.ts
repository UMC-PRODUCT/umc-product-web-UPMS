import type { SelectOption } from '@umc-product/react';

import { toId } from '@/shared/api/toId';
import { formatSchoolName } from '@/shared/lib/formatSchoolName';
import type { components } from '@/types/api';

type GisuOrganizationResponse = components['schemas']['GisuOrganizationV2Response'];

// 문서(SchoolItem)는 schoolId · schoolName이고 ID는 문자열로 옴. ID · 이름이 없는 학교는 뺌
// 기수의 학교 목록은 지부 구분이 없어, 지부를 골라도 학교 목록은 그대로 전체
export const toSchoolOptions = ({ gisus }: GisuOrganizationResponse): SelectOption[] =>
  (gisus?.[0]?.schools ?? [])
    .flatMap(({ schoolId, schoolName }) => {
      const id = toId(schoolId);
      return id !== null && schoolName
        ? [{ value: String(id), label: formatSchoolName(schoolName) }]
        : [];
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'ko'));

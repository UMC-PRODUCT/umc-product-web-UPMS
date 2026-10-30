import type {
  HeaderProfileMenuGeneration,
  HeaderProfileMenuProfile,
  HeaderProfileMenuRole,
} from '@umc-product/react';

import { type MyInfoResponse, type Role } from '@/entities/session';
import { toId } from '@/shared/api/toId';

// TODO: 역할 태그 문구 · 색은 기획 · 디자인 확인 필요
const ROLE_TAG: Record<Role, HeaderProfileMenuRole> = {
  SUPER_ADMIN: { label: '최고 관리자', color: 'challenger-super-admin' },
  HQ_LEAD: { label: '총괄', color: 'central' },
  HQ_ADMIN: { label: '중앙 운영진', color: 'central' },
  CHAPTER_ADMIN: { label: '지부장', color: 'chapter' },
  SCHOOL_ADMIN: { label: '교내 회장단', color: 'campus' },
  SCHOOL_STAFF: { label: '교내 운영진', color: 'campus' },
  CHALLENGER_PM: { label: 'PM 챌린저', color: 'challenger-super-admin' },
  CHALLENGER: { label: '챌린저', color: 'challenger-super-admin' },
};

export type ProfileMenu = {
  profile: HeaderProfileMenuProfile;
  generations: HeaderProfileMenuGeneration[];
  generation: string | undefined;
};

// 내 정보 → 헤더 프로필 메뉴. 기수는 활동한 기수 목록이고, 기수 전환은 아직 없어 현재 기수만 고를 수 있음
export const toProfileMenu = (myInfo: MyInfoResponse, role: Role): ProfileMenu => {
  const currentGisuId = toId(myInfo.currentGisuMemberInfo?.gisuId);
  const generations = (myInfo.challengerHistory ?? [])
    .flatMap(({ gisuId, generation, chapterName }) => {
      const id = toId(gisuId);
      return id === null
        ? []
        : [
            {
              value: String(id),
              label: `${generation ?? '-'}기`,
              caption: chapterName,
              disabled: id !== currentGisuId,
              generation: generation ?? 0,
            },
          ];
    })
    .sort((left, right) => right.generation - left.generation)
    .map(({ generation: _generation, ...item }) => item);

  return {
    profile: {
      nickname: myInfo.nickname ?? '-',
      name: myInfo.name ?? '-',
      school: myInfo.schoolName ?? '',
      role: ROLE_TAG[role],
      imageSrc: myInfo.profileImageLink || undefined,
    },
    generations,
    generation: currentGisuId === null ? undefined : String(currentGisuId),
  };
};

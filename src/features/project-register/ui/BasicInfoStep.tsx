import {
  ImageThumbnailEditor,
  type ImageThumbnailEditorRejection,
  SectionHeader,
  TextArea,
  TextFieldBox,
} from '@umc-product/react';

import {
  LOGO_MAX_SIZE,
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_NAME_MAX_LENGTH,
} from '../model/limits';
import { getPmLabel } from '../model/pmLabel';
import type { PmCandidate, ProjectDraft } from '../model/types';
import PmSelectField from './PmSelectField';
import ProjectEditorCard from './ProjectEditorCard';

type BasicInfoStepProps = {
  draft: ProjectDraft;
  onChange: (patch: Partial<ProjectDraft>) => void;
  // PM 본인이 등록하면 본인 정보가 카드에 미리 채워지고 PM 선택은 없음. 운영진은 PM을 골라야 함
  pmCandidates: PmCandidate[] | null;
  myPmLabel: string;
  onThumbnailReject: (rejection: ImageThumbnailEditorRejection) => void;
  onLogoReject: (rejection: ImageThumbnailEditorRejection) => void;
};

// 1단계 기본 정보: 01 프로젝트 카드 썸네일 · 02 프로젝트 정보 · 03 기획안 링크
const BasicInfoStep = ({
  draft,
  onChange,
  pmCandidates,
  myPmLabel,
  onThumbnailReject,
  onLogoReject,
}: BasicInfoStepProps) => {
  const mainPm = pmCandidates?.find(({ id }) => id === draft.pmIds[0]);
  const pmLabel = pmCandidates
    ? mainPm
      ? `${getPmLabel(mainPm)}${draft.pmIds.length > 1 ? ' 외 1명' : ''}`
      : '닉네임/이름 · 학교'
    : myPmLabel;

  return (
    <div className="flex flex-col gap-[72px]">
      <section className="flex flex-col gap-6">
        <SectionHeader
          number="01"
          title="프로젝트 카드 썸네일 등록"
          description="챌린저들에게 보이는 프로젝트 카드 썸네일을 등록해요 (썸네일 사이즈 648*324 (2:1 비율))"
        />
        <div className="flex items-start gap-5 pl-[38px]">
          <ProjectEditorCard
            thumbnail={draft.thumbnail}
            onThumbnailChange={(thumbnail) => onChange({ thumbnail })}
            onThumbnailReject={onThumbnailReject}
            logo={draft.logo}
            name={draft.name}
            description={draft.description}
            pmLabel={pmLabel}
          />
          {pmCandidates && (
            <PmSelectField
              candidates={pmCandidates}
              pmIds={draft.pmIds}
              onPmIdsChange={(pmIds) => onChange({ pmIds })}
            />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeader
          number="02"
          title="프로젝트 정보 등록"
          description="프로젝트 로고 사진과 설명을 등록해요."
        />
        <div className="flex items-start gap-5 pl-[38px]">
          <ImageThumbnailEditor
            aria-label="프로젝트 로고"
            value={draft.logo}
            onValueChange={(logo) => onChange({ logo })}
            onReject={onLogoReject}
            maxSize={LOGO_MAX_SIZE}
            // 피그마: 204px 정사각형
            className="size-[204px] shrink-0"
          />
          <div className="flex w-[800px] max-w-full flex-col gap-3">
            <TextFieldBox
              aria-label="프로젝트 이름"
              size="lg"
              placeholder="프로젝트 이름"
              maxLength={PROJECT_NAME_MAX_LENGTH}
              value={draft.name}
              onChange={(event) => onChange({ name: event.target.value })}
              unit={`${draft.name.length}/${PROJECT_NAME_MAX_LENGTH}`}
            />
            <TextArea
              aria-label="프로젝트 설명"
              placeholder="작성하세요"
              maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
              value={draft.description}
              onChange={(event) => onChange({ description: event.target.value })}
              className="h-36"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader number="03" title="프로젝트 기획안 등록" />
        <div className="pl-[38px]">
          <TextFieldBox
            aria-label="프로젝트 기획안 링크"
            size="lg"
            type="url"
            placeholder="Notion, Figma 등 기획안 링크를 첨부해주세요"
            value={draft.planUrl}
            onChange={(event) => onChange({ planUrl: event.target.value })}
          />
        </div>
      </section>
    </div>
  );
};

export default BasicInfoStep;

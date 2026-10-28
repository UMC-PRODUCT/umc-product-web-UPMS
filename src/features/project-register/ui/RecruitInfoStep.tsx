import { NumericStepper, SectionHeader, SegmentedControl } from '@umc-product/react';

import { getTotalRecruitCount } from '../model/draft';
import { MAX_RECRUIT_COUNT } from '../model/limits';
import type { PePlatform, RecruitInfo } from '../model/types';

const PE_PLATFORM_ITEMS: { value: PePlatform; label: string }[] = [
  { value: 'WEB', label: 'Web PE' },
  { value: 'MOBILE', label: 'Mobile PE' },
];

type RecruitInfoStepProps = {
  recruit: RecruitInfo;
  onChange: (recruit: RecruitInfo) => void;
  // 운영진(지부장 이상)만 입력할 수 있고, PM은 설정된 값을 조회만 함
  editable: boolean;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-[46px]">
    <span className="w-[50px] shrink-0 text-body-1-regular text-teal-grey-900">{label}</span>
    {children}
  </div>
);

// 2단계 모집 정보: 04 모집 인원 및 스택 (Design · PE 인원, PE 플랫폼)
const RecruitInfoStep = ({ recruit, onChange, editable }: RecruitInfoStepProps) => {
  const total = getTotalRecruitCount(recruit);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6">
        <SectionHeader
          number="04"
          title="모집 인원 및 스택"
          description={
            editable ? (
              '프로젝트에 필요한 인원과 기술 스택을 설정해 주세요.'
            ) : (
              <>
                모집 인원과 기술 스택은 운영진이 설정해요.
                <br />
                설정이 끝나면 여기서 확인할 수 있어요.
              </>
            )
          }
        />
        <div className="flex flex-col gap-5 pl-10">
          <Row label="Design">
            <NumericStepper
              aria-label="Design 모집 인원"
              min={0}
              max={MAX_RECRUIT_COUNT}
              value={recruit.designCount}
              disabled={!editable}
              onValueChange={(value) => onChange({ ...recruit, designCount: value ?? 0 })}
            />
          </Row>
          <Row label="PE">
            <div className="flex items-center gap-5">
              <NumericStepper
                aria-label="PE 모집 인원"
                min={0}
                max={MAX_RECRUIT_COUNT}
                value={recruit.peCount}
                disabled={!editable}
                onValueChange={(value) => onChange({ ...recruit, peCount: value ?? 0 })}
              />
              {/* DS SegmentedControl에는 disabled가 없어서 조회만 할 때는 inert로 조작을 막음 */}
              <div inert={!editable} className={editable ? undefined : 'opacity-50'}>
                <SegmentedControl
                  aria-label="PE 플랫폼"
                  items={PE_PLATFORM_ITEMS}
                  value={recruit.pePlatform ?? undefined}
                  onValueChange={(pePlatform) => onChange({ ...recruit, pePlatform })}
                />
              </div>
            </div>
          </Row>
        </div>
      </section>
      {editable && (
        <div className="flex items-center gap-3 border-t border-teal-grey-100 px-7 pt-5 text-body-1-regular text-teal-grey-900">
          <span className="w-[144px]">총 모집 인원</span>
          <span className="text-body-1-semibold text-teal-600">{total}명</span>
        </div>
      )}
    </div>
  );
};

export default RecruitInfoStep;

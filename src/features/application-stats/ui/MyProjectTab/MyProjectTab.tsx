import type { MyProject } from '../../model/types';
import tabShape from './assets/tab-shape.svg';

// PM 지원 현황 상단의 내 프로젝트 탭: 로고 + 프로젝트명 + PM 정보
// TODO: 피그마에 "컴포넌트 업데이트 예정" 메모가 있어 디자인 확정 후 다시 확인
const MyProjectTab = ({ projectName, logoUrl, pmName, schoolName }: MyProject) => (
  <div className="relative flex h-[85px] w-full items-start px-[22px] py-4">
    {/* 왼쪽 탭 + 아래 띠 모양 배경 */}
    <img src={tabShape} alt="" className="absolute inset-0 block size-full max-w-none" />
    <div className="relative flex items-center gap-5">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${projectName} 로고`}
          className="size-[50px] shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div aria-hidden className="size-[50px] shrink-0 rounded-lg bg-teal-grey-100" />
      )}
      <div className="flex w-[206px] flex-col gap-1">
        <p className="truncate text-title-2-semibold text-teal-grey-800">{projectName}</p>
        <p className="truncate text-body-3-medium text-teal-grey-600">
          {pmName} · {schoolName}
        </p>
      </div>
    </div>
  </div>
);

export default MyProjectTab;

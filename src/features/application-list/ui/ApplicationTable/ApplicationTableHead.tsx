import sortIcon from './assets/sort.svg';
import { COLUMN_CLASS, RECRUIT_COLUMNS, RECRUIT_GROUP_CLASS } from './columns';

// 지원 목록 테이블 헤더 (열 사이 간격 · 오른쪽 버튼 자리는 프로젝트 줄과 같게)
const ApplicationTableHead = () => (
  <div className="flex h-10 w-full items-center gap-3 rounded-t-xl bg-teal-100 py-1.5 pr-[22px] pl-2.5 text-body-3-medium whitespace-nowrap text-teal-grey-900">
    <div className="flex min-w-0 flex-1 items-center">
      <p className={`text-center ${COLUMN_CLASS.project}`}>프로젝트</p>
      <p className={`px-4 ${COLUMN_CLASS.part}`}>파트</p>
      <p className={`pl-4 ${COLUMN_CLASS.challenger}`}>챌린저</p>
      <p className={`px-[26px] ${COLUMN_CLASS.status}`}>상태</p>
      <div className={`text-center ${RECRUIT_GROUP_CLASS}`}>
        {RECRUIT_COLUMNS.map(({ part, label, width }) => (
          <p key={part} className={width}>
            {label}
          </p>
        ))}
      </div>
    </div>
    {/* TODO: 정렬 기능 연동 */}
    <button
      type="button"
      aria-label="정렬"
      className="flex size-[26px] shrink-0 items-center justify-center"
    >
      <img src={sortIcon} alt="" width={24} height={24} />
    </button>
  </div>
);

export default ApplicationTableHead;

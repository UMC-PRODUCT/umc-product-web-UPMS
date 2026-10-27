import documentGraphic from './assets/document.svg';

// 피그마 Empty Card: 검색 · 필터 결과(또는 등록된 프로젝트)가 없을 때
const ProjectListEmpty = () => (
  <div className="flex h-[451px] w-full rounded-xl border border-teal-grey-100 bg-teal-grey-50 px-8 py-7">
    <div className="flex flex-1 flex-col items-center justify-center gap-6 pt-24 pb-20">
      <img src={documentGraphic} alt="" width={60} height={74.026} className="block shrink-0" />
      <p className="text-[18px] leading-[1.4] font-medium text-teal-grey-300">
        등록된 프로젝트가 없어요
      </p>
    </div>
  </div>
);

export default ProjectListEmpty;

import { ImageThumbnail } from '@umc-product/react';
import type { ReactNode } from 'react';

import slantLg from './assets/project-header-slant-lg.svg';
import slantMd from './assets/project-header-slant-md.svg';

type ProjectHeaderSize = 'lg' | 'md';

// 피그마 Project header 크기별 값 (Lg: 챌린저 내 지원서, Md: 어드민 · PM이 보는 지원자 지원서)
const SIZE_STYLE: Record<
  ProjectHeaderSize,
  {
    tab: string;
    thumbnail: number;
    name: string;
    sub: string;
    slant: { src: string; width: number; height: number };
    strip: string;
  }
> = {
  lg: {
    tab: 'bg-teal-75 pt-5 pb-2.5 pl-5',
    thumbnail: 50,
    name: 'text-heading-3-semibold',
    sub: 'text-body-3-medium',
    slant: { src: slantLg, width: 93, height: 83 },
    strip: 'h-2.5 bg-teal-75',
  },
  md: {
    tab: 'w-[250px] bg-teal-50 pt-4 pb-2 pl-4',
    thumbnail: 32,
    name: 'text-body-3-semibold',
    sub: 'text-caption-3-regular',
    slant: { src: slantMd, width: 80, height: 67 },
    strip: 'h-2 bg-teal-50',
  },
};

type ProjectHeaderProps = {
  size: ProjectHeaderSize;
  projectName: string;
  logoUrl: string | null; // 없으면 기본 로고
  pmName: string; // 닉네임/이름
  schoolName: string;
  aside?: ReactNode; // 오른쪽 내용 (Md: 지원한 파트의 모집 인원, Lg: 제출 시각 · 결과)
  asideAlign?: 'center' | 'end'; // 오른쪽 내용 세로 위치 (end: 띠 바로 위, 피그마 Form/Header)
  className?: string;
};

// 피그마 Project header: 탭 모양 프로젝트 라벨 + 오른쪽으로 이어지는 띠 (아래 지원서에 붙음)
const ProjectHeader = ({
  size,
  projectName,
  logoUrl,
  pmName,
  schoolName,
  aside,
  asideAlign = 'center',
  className = '',
}: ProjectHeaderProps) => {
  const style = SIZE_STYLE[size];

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-end justify-between">
        <div className="flex items-end">
          <div className={`flex items-center gap-5 rounded-tl-xl ${style.tab}`}>
            <ImageThumbnail src={logoUrl} alt={`${projectName} 로고`} size={style.thumbnail} />
            <div className="flex w-[206px] flex-col gap-1">
              <p className={`truncate text-teal-grey-800 ${style.name}`}>{projectName}</p>
              <p className={`truncate text-teal-grey-600 ${style.sub}`}>
                {pmName} · {schoolName}
              </p>
            </div>
          </div>
          <img src={style.slant.src} alt="" width={style.slant.width} height={style.slant.height} />
        </div>
        {aside && (
          <div className={asideAlign === 'end' ? 'self-end px-4 pb-1' : 'self-center'}>{aside}</div>
        )}
      </div>
      <div className={`rounded-tr-xl ${style.strip}`} />
    </div>
  );
};

export default ProjectHeader;

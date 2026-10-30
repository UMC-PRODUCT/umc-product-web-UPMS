import { ImageThumbnailEditor, type ImageThumbnailEditorRejection } from '@umc-product/react';
import { useEffect, useState } from 'react';

import { PROJECT_DESCRIPTION_MAX_LENGTH, THUMBNAIL_MAX_SIZE } from '../model/limits';

const useObjectUrl = (file: File | null) => {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    // 외부(브라우저) 리소스를 만든 뒤 구독 콜백처럼 한 틱 뒤에 반영
    const frame = requestAnimationFrame(() => setPreview({ file, url: objectUrl }));
    return () => {
      cancelAnimationFrame(frame);
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // 파일이 지워지거나 바뀌는 순간에는 이전 미리보기를 쓰지 않음
  return file && preview?.file === file ? preview.url : null;
};

type ProjectEditorCardProps = {
  thumbnail: File | null;
  thumbnailUrl: string; // 서버에 저장된 썸네일 주소 (새 파일을 고르기 전까지 보여줌)
  onThumbnailChange: (file: File) => void;
  onThumbnailReject: (rejection: ImageThumbnailEditorRejection) => void;
  logo: File | null; // 02 프로젝트 정보 등록에서 올린 로고
  logoUrl: string;
  name: string;
  description: string;
  pmLabel: string; // 닉네임/이름 · 학교
};

// 피그마 Project Editor Card: 챌린저에게 보이는 프로젝트 카드 미리보기. 썸네일만 여기서 올리고 나머지는 02에서 입력한 값이 보임
const ProjectEditorCard = ({
  thumbnail,
  thumbnailUrl,
  onThumbnailChange,
  onThumbnailReject,
  logo,
  logoUrl: savedLogoUrl,
  name,
  description,
  pmLabel,
}: ProjectEditorCardProps) => {
  const logoUrl = useObjectUrl(logo) ?? (savedLogoUrl || null);

  return (
    <article className="flex w-[648px] max-w-full flex-col overflow-hidden rounded-[20px] border border-teal-grey-100 bg-white shadow-drop-neutral-3">
      <ImageThumbnailEditor
        aria-label="프로젝트 카드 썸네일"
        value={thumbnail}
        src={thumbnailUrl || undefined}
        onValueChange={onThumbnailChange}
        onReject={onThumbnailReject}
        accept={['image/jpeg', 'image/png']}
        maxSize={THUMBNAIL_MAX_SIZE}
        label="클릭 후 사진 업로드"
        description={
          <>
            JPG, PNG 형식의 10MB 이하 파일
            <br />
            썸네일 사이즈 648*324 (2:1)
          </>
        }
        // 피그마: 카드 폭 가득 2:1 비율, 모서리는 카드가 자름
        className="aspect-[2/1] h-auto w-full rounded-none"
      />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="size-10 shrink-0 rounded-lg bg-teal-grey-100" />
            )}
            <h2
              className={`truncate text-heading-2-semibold ${name ? 'text-teal-grey-900' : 'text-teal-grey-300'}`}
            >
              {name || '프로젝트 이름'}
            </h2>
          </div>
          <p className="shrink-0 text-body-1-regular whitespace-nowrap text-teal-grey-500">
            {pmLabel}
          </p>
        </div>
        <p
          className={`min-h-[92px] text-body-1-regular break-words whitespace-pre-wrap ${description ? 'text-teal-grey-600' : 'text-teal-grey-700'}`}
        >
          {description || '프로젝트 한 줄 소개를 적어요'}
        </p>
        <p className="text-right text-body-2-regular text-teal-grey-300">
          {description.length}/{PROJECT_DESCRIPTION_MAX_LENGTH}
        </p>
      </div>
    </article>
  );
};

export default ProjectEditorCard;

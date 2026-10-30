import { PageHeader } from '@umc-product/react';
import { useState } from 'react';

import { useSessionStore } from '@/entities/session';
import {
  ApplicationListCard,
  type AppliedProject,
  ProjectCard,
  toAppliedRoundGroups,
  useCancelApplication,
  useMyApplications,
} from '@/features/applications';
import { getOpenRoundIds, useMatchingRounds } from '@/features/matching-schedule';
import { useAppToast } from '@/widgets/toast';

import { getBreadcrumbs } from '../-shared/constants';
import AppliedProjectModal from './AppliedProjectModal';

// 챌린저 뷰: 내 지원 현황 (매칭 차수별 지원한 프로젝트)
const ChallengerApplications = () => {
  const gisuId = useSessionStore((state) => state.session.gisuId);
  const chapterId = useSessionStore((state) => state.session.serverChapterId);
  const [now] = useState(() => new Date());
  const [selectedProject, setSelectedProject] = useState<AppliedProject | null>(null);
  const toast = useAppToast();

  const applications = useMyApplications(gisuId);
  // 목록 API에 지원 기간이 없어서 소속 지부의 매칭 차수로 지금 취소할 수 있는 차수를 구함
  // TODO: 매칭 지부 이동(PROJECT-TRANSFER)으로 지원 지부가 바뀐 챌린저 확인
  const rounds = useMatchingRounds(chapterId ?? undefined);
  const groups = applications.data
    ? toAppliedRoundGroups(applications.data, getOpenRoundIds(rounds.data ?? [], now))
    : [];

  const cancelApplication = useCancelApplication();

  const handleCancelApplication = ({ projectId, applicationId }: AppliedProject) => {
    if (applicationId === null) return;
    cancelApplication.mutate(
      { projectId, applicationId },
      {
        onSuccess: () => {
          setSelectedProject(null);
          toast.show('프로젝트 지원이 취소되었어요.', { color: 'error' });
        },
        onError: (error) => toast.show(error.message, { color: 'error' }),
      },
    );
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1152px]"
        breadcrumbs={getBreadcrumbs('내 지원 현황')}
        title="내 지원 현황"
        description="내가 지원한 프로젝트의 지원 상태와 결과를 확인해요."
      />
      {/* 불러오는 동안은 빈 상태가 잠깐 보이지 않도록 아무것도 그리지 않음 */}
      {/* TODO: 불러오기 실패 화면이 피그마에 나오면 교체 */}
      {applications.isError && (
        <p role="alert" className="text-body-3-medium text-red-500">
          지원 현황을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {applications.isSuccess &&
        (groups.length === 0 ? (
          <div className="flex w-full max-w-[962px] flex-col gap-2">
            <ApplicationListCard />
          </div>
        ) : (
          groups.map(({ roundId, roundName, matchingType, projects }) => (
            <section key={roundId} className="flex w-full max-w-[962px] flex-col gap-2.5">
              <h2 className="pl-4 text-heading-4-semibold text-teal-600">{roundName}</h2>
              <div className="flex flex-col gap-2">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.applicationId ?? project.projectId}
                    project={project}
                    showResult={matchingType === 'REGULAR'}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </section>
          ))
        ))}
      <AppliedProjectModal
        // 카드마다 상세 → 지원서 단계를 처음부터 시작하도록 새로 그림
        key={selectedProject?.applicationId ?? selectedProject?.projectId}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onCancelApplication={handleCancelApplication}
        isCanceling={cancelApplication.isPending}
      />
    </main>
  );
};

export default ChallengerApplications;

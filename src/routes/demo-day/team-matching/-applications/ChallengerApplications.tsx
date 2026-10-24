import { PageHeader } from '@umc-product/react';
import { useState } from 'react';

import {
  ApplicationListCard,
  type AppliedProject,
  MOCK_APPLIED_ROUNDS,
  ProjectCard,
} from '@/features/applications';
import { useAppToast } from '@/widgets/toast';

import AppliedProjectModal from './AppliedProjectModal';
import { getBreadcrumbs } from './constants';

// 챌린저 뷰: 내 지원 현황 (매칭 차수별 지원한 프로젝트)
const ChallengerApplications = () => {
  // TODO: 지원 현황 API 연동 후 서버 데이터로 교체
  const [rounds, setRounds] = useState(MOCK_APPLIED_ROUNDS);
  const [selectedProject, setSelectedProject] = useState<AppliedProject | null>(null);
  const toast = useAppToast();

  // TODO: 지원 취소 API 연동 후 목록 새로고침으로 교체
  // 취소한 카드를 빼고, 지원한 프로젝트가 없어진 차수는 통째로 숨김
  const handleCancelApplication = ({ projectId }: AppliedProject) => {
    setRounds((prev) =>
      prev
        .map((round) => ({
          ...round,
          projects: round.projects.filter((project) => project.projectId !== projectId),
        }))
        .filter((round) => round.projects.length > 0),
    );
    toast.show('프로젝트 지원이 취소되었어요.', { color: 'error' });
  };

  return (
    <main className="flex flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1152px]"
        breadcrumbs={getBreadcrumbs('내 지원 현황')}
        title="내 지원 현황"
        description="내가 지원한 프로젝트의 지원 상태와 결과를 확인해요."
      />
      {rounds.length === 0 ? (
        <div className="flex w-full max-w-[962px] flex-col gap-2">
          <ApplicationListCard />
        </div>
      ) : (
        rounds.map(({ roundId, roundName, matchingType, projects }) => (
          <section key={roundId} className="flex w-full max-w-[962px] flex-col gap-2.5">
            <h2 className="pl-4 text-heading-4-semibold text-teal-600">{roundName}</h2>
            <div className="flex flex-col gap-2">
              {projects.map((project) => (
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  showResult={matchingType === 'REGULAR'}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </section>
        ))
      )}
      <AppliedProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onCancelApplication={handleCancelApplication}
      />
    </main>
  );
};

export default ChallengerApplications;

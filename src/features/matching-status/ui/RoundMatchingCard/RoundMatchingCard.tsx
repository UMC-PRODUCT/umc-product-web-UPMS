import { RankedBarChart } from '@umc-product/react';

import type { RoundMatching, RoundMatchingKey } from '../../model/types';

const ROUND_LABEL: Record<RoundMatchingKey, string> = {
  1: '1차',
  2: '2차',
  3: '3차',
  RANDOM: '랜덤',
};

type RoundMatchingCardProps = {
  rounds: RoundMatching[];
};

// 피그마 차수별 매칭 현황 카드: 차수별 매칭 인원을 순위에 따라 정해진 높이의 막대로 표시
// 디자인 시스템 RankedBarChart(높이 기준: 순위)라서 인원이 많은 차수가 항상 가장 높은 막대 (2차가 1차보다 많아도 동일)
const RoundMatchingCard = ({ rounds }: RoundMatchingCardProps) => {
  const isEmpty = rounds.every(({ matched }) => (matched ?? 0) === 0);

  return (
    <div className="flex h-full w-full flex-col gap-7 rounded-xl border border-teal-grey-100 bg-white px-7 pt-6 pb-7 shadow-drop-neutral-3">
      <p className="text-title-3-medium font-semibold text-teal-600">차수별 매칭 현황</p>
      {isEmpty ? (
        // 피그마 매칭 완료 팀 없음: 안내 문구 + 바닥에 차수 수만큼 회색 빈 막대
        <div className="flex flex-1 flex-col justify-end">
          <div className="flex h-[115px] flex-col items-center justify-between">
            <p className="text-body-3-medium text-teal-grey-400">아직 매칭 완료된 팀이 없어요</p>
            <div aria-hidden className="flex w-full items-end justify-between">
              {rounds.map(({ round }) => (
                <span key={round} className="h-[5px] w-[72px] rounded-t bg-teal-grey-100" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-end">
          <RankedBarChart
            heightBy="rank"
            unit="명"
            items={rounds.map(({ round, matched }) => ({
              key: String(round),
              label: ROUND_LABEL[round],
              value: matched ?? 0,
            }))}
            // 디자인 시스템 기본 좌우 여백(10px)을 빼고 카드 폭에 맞춰 막대를 펼침
            className="w-full justify-between px-0"
          />
        </div>
      )}
    </div>
  );
};

export default RoundMatchingCard;

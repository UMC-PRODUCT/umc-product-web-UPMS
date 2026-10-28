import type { PmCandidate } from './types';

export const getPmLabel = ({ nickname, name, schoolName }: PmCandidate) =>
  `${nickname}/${name} · ${schoolName}`;

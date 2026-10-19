export type Chapter = {
  id: string;
  name: string;
  schools: string[]; // UI 표기 그대로 ("~학교" 없이)
};

// TODO: 지부 목록 API가 나오면 실제 데이터로 교체
export const MOCK_CHAPTERS: Chapter[] = [
  { id: 'kangaroo', name: '캥거루', schools: ['가천대', '서울여대', '한국항공대', '한성대'] },
  {
    id: 'axolotl',
    name: '아홀로틀',
    schools: ['가톨릭대', '덕성여대', '세종대', '안양대', '홍익대 서울'],
  },
  {
    id: 'tyranno',
    name: '티라노',
    schools: ['단국대', '동국대', '동덕여대', '서경대', '홍익대 세종'],
  },
  {
    id: 'quokka',
    name: '쿼카',
    schools: ['동양미래대', '숭실대', '이화여대', '인하대', '한양대 ERICA'],
  },
  { id: 'otter', name: '수달', schools: ['성신여대', '숙명여대', '중앙대', '한국외대'] },
];

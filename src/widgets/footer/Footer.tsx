import { UmcLogo } from '@umc-product/icons';
import type { ReactNode } from 'react';

import instagramIcon from './assets/instagram.svg';
import kakaoIcon from './assets/kakao.svg';

type Member = { role?: string; nickname: string; name: string };

// 피그마 .docs/Footer: UMC PRODUCT 팀 구성 (파트별 닉네임/이름)
const TEAM: { part: string; members: Member[] }[] = [
  {
    part: 'Lead',
    members: [
      { nickname: '리버', name: '이재원' },
      { nickname: '우연', name: '추연우' },
    ],
  },
  {
    part: 'Web',
    members: [
      { role: 'PM', nickname: '벨라', name: '황지원' },
      { role: 'Design', nickname: '이방토', name: '이예원' },
      { role: 'FE', nickname: '이삭', name: '강지훈' },
      { role: 'FE', nickname: '헤일리', name: '한현서' },
      { role: 'FE', nickname: '주디', name: '양혜원' },
      { role: 'FE', nickname: '준오', name: '오창준' },
    ],
  },
  {
    part: 'Mobile',
    members: [
      { role: 'PM', nickname: '제옹', name: '정의찬' },
      { role: 'Design', nickname: '삼이', name: '이희원' },
      { role: 'Design', nickname: '시안', name: '우자영' },
      { role: 'iOS', nickname: '원', name: '김동민' },
      { role: 'iOS', nickname: '소피', name: '이예지' },
      { role: 'Android', nickname: '조나단', name: '조경석' },
      { role: 'Android', nickname: '도리', name: '김도연' },
      { role: 'Android', nickname: '어헛차', name: '박유수' },
    ],
  },
  {
    part: 'Server',
    members: [
      { nickname: '하늘', name: '박경운' },
      { nickname: '갈래', name: '김민서' },
      { nickname: '와나', name: '강하나' },
      { nickname: '우디', name: '박성현' },
      { nickname: '세니', name: '박세은' },
      { nickname: '박박지현', name: '박지현' },
      { nickname: '스읍', name: '이예은' },
      { nickname: '라미', name: '권도희' },
      { nickname: '이람', name: '박승범' },
    ],
  },
];

// 아래 줄 UMC 서비스 · SNS (로고 또는 아이콘 + 이름)
// TODO: 각 서비스 · SNS 링크 주소가 정해지면 연결
const SERVICES: { key: string; icon: ReactNode; label: string }[] = [
  { key: 'app', icon: <UmcLogo height={12} />, label: 'Web / iOS / Android' },
  { key: 'product-tech', icon: <UmcLogo height={12} />, label: 'Product Tech' },
  { key: 'study', icon: <UmcLogo height={12} />, label: 'Study' },
  { key: 'operation', icon: <UmcLogo height={12} />, label: 'Operation' },
  {
    key: 'instagram',
    icon: <img src={instagramIcon} alt="" width={16} height={16} />,
    label: 'Instagram',
  },
  { key: 'kakao', icon: <img src={kakaoIcon} alt="" width={16} height={16} />, label: 'Kakao' },
];

// 피그마 .docs/Footer (디자인 시스템에 푸터 컴포넌트가 없어 피그마대로 구성)
// 로고 · 약관 링크 / UMC PRODUCT 팀 구성 / UMC 서비스 · SNS
const Footer = () => (
  // 피그마 배경: #F6F7F7 위에 teal-grey 10% (디자인 토큰에 같은 색이 없어 피그마 값 사용)
  <footer className="bg-[#f6f7f7] bg-[linear-gradient(rgb(229_245_242/0.1),rgb(229_245_242/0.1))] py-16 pr-14 pl-[60px] text-teal-grey-400">
    <div className="flex w-full flex-col gap-[34px]">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-4">
          <UmcLogo height={20} />
          <span className="text-[20px] leading-[1.6] font-bold tracking-[-0.4px]">
            University MakeUs Challenge
          </span>
        </p>
        {/* TODO: 약관 · 개인정보처리방침 링크 주소가 정해지면 연결 */}
        <p className="flex flex-wrap items-center gap-6 text-body-3-regular">
          <span>서비스이용약관</span>
          <span>개인정보처리방침</span>
          <span>© 2026 UMC All rights reserved.</span>
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="text-body-3-semibold">UMC PRODUCT</p>
        <dl className="flex flex-col gap-[7px] text-body-3-regular">
          {TEAM.map(({ part, members }) => (
            <div key={part} className="flex items-start">
              <dt className="w-[50px] shrink-0 text-body-3-medium">{part}</dt>
              {/* 파트 이름과 명단 사이 세로 구분선 */}
              <span aria-hidden className="mx-[7.5px] mt-[3px] h-[15px] w-px shrink-0 bg-current" />
              <dd className="flex flex-wrap items-center gap-x-2.5">
                {members.map(({ role, nickname, name }) => (
                  <span key={`${nickname}-${name}`} className="whitespace-nowrap">
                    {role && <span className="font-medium">{role} </span>}
                    {nickname}/{name}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="flex flex-wrap items-center gap-6 text-body-3-medium">
        {SERVICES.map(({ key, icon, label }) => (
          <li key={key} className="flex items-center gap-[7px] whitespace-nowrap">
            {icon}
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);

export default Footer;

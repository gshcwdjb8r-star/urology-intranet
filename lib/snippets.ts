export type Snippet = {
  id: string;
  category: string;
  title: string;
  body: string;
  builtIn?: boolean;
};

export function isSnippetData(data: unknown): data is { category: string; body: string } {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return typeof d.category === "string" && typeof d.body === "string";
}

export const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: "default-dx-bph",
    builtIn: true,
    category: "진단서",
    title: "전립선비대증 · 요폐",
    body: `진단명: 전립선비대증(N40), 급성 요폐(R33)
발병 연월일: (요폐 발생일)
치료 내용 및 소견: 상기 진단으로 도뇨 후 약물치료 중이며, 배뇨장애 지속 시 수술적 치료를 고려함. 현재 일상생활은 가능하나 심한 육체노동은 제한됨.
용도: 보험 제출용`,
  },
  {
    id: "default-dx-stone",
    builtIn: true,
    category: "진단서",
    title: "요로결석",
    body: `진단명: 요관결석, 수신증
발병 연월일: (통증 발생일)
치료 내용 및 소견: 진통 및 수분 섭취 교육 후 자연 배출 경과 관찰 중임. 통증 지속, 발열, 신기능 저하 시 배액 또는 내시경 시술을 고려함.
용도: 직장 제출용`,
  },
  {
    id: "default-opinion-stone",
    builtIn: true,
    category: "소견서",
    title: "요관결석 추적 의뢰",
    body: `진단명: 우측 요관결석, 경도 수신증
현병력: 측복통으로 내원. CT상 원위 요관 결석. 발열 없음.
검사: 소변검사 혈뇨, 신기능 확인.
소견 및 의뢰: 통증 조절되며 자연 배출 경과 관찰 중. 발열·통증 악화 시 배액 고려. 추적 진료 부탁드립니다.`,
  },
  {
    id: "default-opinion-psa",
    builtIn: true,
    category: "소견서",
    title: "PSA 상승 · 전립선암 평가",
    body: `진단명: 전립선특이항원 상승, 전립선암 의증
현병력: PSA 상승으로 의뢰됨. 배뇨증상 (유/무), 직장수지검사 (경도/결절).
검사: PSA, 필요 시 전립선 MRI.
소견 및 의뢰: 조직검사 여부 평가 부탁드립니다. 항혈전제 복용 여부를 확인해 주십시오.`,
  },
  {
    id: "default-adm",
    builtIn: true,
    category: "입퇴원",
    title: "입퇴원 확인 문구",
    body: `입원일: 
퇴원일: 
병동: 비뇨의학과 병동
진단명: 
시행 수술/시술: (수술일 포함)`,
  },
  {
    id: "default-op-turbt",
    builtIn: true,
    category: "수술",
    title: "TURBT 기록 요약",
    body: `술전 진단: 방광종양
술후 진단: 동일
수술명: 경요도 방광종양절제술 (TURBT)
마취: 
수술 소견: 위치, 크기, 개수, 근육층 포함 절제 여부
특이사항: 도뇨관 유치, 방광내 항암제 주입 여부, 천공 유무`,
  },
  {
    id: "default-op-turp",
    builtIn: true,
    category: "수술",
    title: "TURP / HoLEP 기록 요약",
    body: `술전 진단: 전립선비대증
수술명: 경요도 전립선절제술 (TURP) 또는 HoLEP
수술 소견: 절제/적출량, 지혈 상태
특이사항: 3-way Foley, 지속 방광세척, 수혈 여부
합병증: 특이 합병증 없음 (해당 시 기재)`,
  },
  {
    id: "default-dc-foley",
    builtIn: true,
    category: "퇴원안내",
    title: "도뇨관 · 혈뇨",
    body: `분홍빛 혈뇨는 흔합니다. 혈괴로 소변이 나오지 않거나 열이 나면 즉시 내원하십시오.
수분을 충분히 드십시오 (심장·신장 질환이 있으면 담당의 지시를 따릅니다).
과도한 힘주기, 음주, 장거리 이동은 초기에는 피하십시오.
도뇨관/스텐트 제거 날짜를 꼭 확인하십시오.`,
  },
  {
    id: "default-dc-stent",
    builtIn: true,
    category: "퇴원안내",
    title: "요관스텐트 (DJ)",
    body: `옆구리 불편감, 혈뇨, 빈뇨는 스텐트가 있을 때 흔합니다.
발열, 오한, 심한 옆구리 통증은 감염·폐색 의심이니 응급실로 오십시오.
스텐트는 반드시 예정일에 제거 또는 교환합니다. 잊어버리면 결석·감염이 생길 수 있습니다.`,
  },
];

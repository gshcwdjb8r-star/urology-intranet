# 성빈센트병원 비뇨의학과 인트라넷

성빈센트병원 비뇨의학과 스텝과 전담간호사가 쓰는 내부 사이트입니다. 로그인, 당직표(3종), 문서 양식, 수술동의 설명 체크리스트, 약어·용어, 술기·수술, 약품, 입원 오더, 공지사항을 제공합니다.

역할(스텝, 전담간호사 등)은 **표시용**이며 메뉴 권한은 같습니다.

## 준비

1. [Supabase](https://supabase.com) 프로젝트를 만듭니다.
2. Authentication → Providers → Email에서 **Confirm email을 끕니다.** (병원 내부 계정이면 메일 확인이 거추장스럽습니다.)
3. SQL Editor에서 순서대로 실행합니다.
   - `supabase/schema.sql`
   - `supabase/seed.sql` (초기 용어·오더·동의 설명 등)
4. `.env.example`을 복사해 `.env.local`을 만들고 프로젝트 URL과 anon key를 넣습니다.

```bash
cp .env.example .env.local
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 연 뒤 **계정 만들기**로 첫 사용자를 등록합니다.

## 구성

| 경로 | 내용 |
| --- | --- |
| `/` | 오늘 당직, 공지, 최근 문서 |
| `/duty` | 스텝 / 인턴·레지던트 / 전담간호사 당직 캘린더 |
| `/documents` | 진단서 등 양식 입력·저장·인쇄 |
| `/consents` | 수술동의 시 설명 체크리스트 |
| `/terms` | 약어·terminology |
| `/procedures` | 기본 술기·수술 |
| `/medications` | 진료 약품 |
| `/orders` | 입원·퇴원·수혈 등 오더 |
| `/notices` | 공지사항 |

시드 자료는 참고용입니다. 환자 치료 결정은 집도의·원내 지침이 우선입니다.

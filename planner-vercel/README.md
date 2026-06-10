# 2027 입시 전략 플래너

## 배포 방법 (GitHub + Vercel)

### 1단계 — API 키 입력
`api/analyze.js` 파일 열어서 맨 위에 있는 API 키 교체:
```js
const OPENAI_API_KEY = 'sk-여기에_실제_키_입력'
```

### 2단계 — GitHub에 올리기
1. GitHub.com 에서 새 저장소(repository) 만들기
2. 이 폴더 전체를 올리기

```bash
git init
git add .
git commit -m "첫 배포"
git remote add origin https://github.com/아이디/저장소명.git
git push -u origin main
```

### 3단계 — Vercel 배포
1. vercel.com 접속 → GitHub 로그인
2. "New Project" → GitHub 저장소 선택
3. 그대로 Deploy 클릭
4. 자동으로 도메인 생성됨 (예: my-app.vercel.app)

### 완료!
생성된 링크를 직원들에게 공유하면 끝 😊

---

## 폴더 구조
```
├── api/
│   └── analyze.js   ← OpenAI API 키 여기에
├── public/
│   └── index.html   ← 프론트엔드
└── vercel.json      ← Vercel 설정
```

## 기능
- 학생부 사진/PDF 업로드 → GPT-4o가 내신 자동 추출
- 계열·수능최저 선택 → 지원 가능 대학 추천 (안정/적정/도전)
- 2027학년도 입시 일정 달력

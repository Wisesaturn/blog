# Jaehan.blog

## Introduce
![thumbnail](https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png)

<h3 align="center">🎉 개인용 블로그 🎉</h3>
<p align="center">기록하고 싶은 것들을 모아두었습니다</p>



## Stack
<p align="center">
<img src="https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white"/>&nbsp;&nbsp;
<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"/>&nbsp;&nbsp;
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white"/>&nbsp;&nbsp;
<img src="https://img.shields.io/badge/Firebase-FFA611?style=for-the-badge&logo=Firebase&logoColor=white"/>&nbsp;&nbsp;
<img src="https://img.shields.io/badge/Notion_API-EFEFEF?style=for-the-badge&logo=Notion&logoColor=333333"/>&nbsp;&nbsp;
</p>

### Architecture
- FSD 기반 폴더 구조를 나누었습니다
- app → pages → modules → features → entities → commons 순으로만 import 합니다
- `modules` 는 FSD 의 widgets, `commons` 는 shared 자리입니다
- 레이어 규칙은 `eslint-plugin-fsd-lint` 가 검사합니다

### Convention
- Function : camelCase
- Domain : kebab-case
- Component : PascalCase
- Variable : PascalCase
- Constant : SNAKE_CASE
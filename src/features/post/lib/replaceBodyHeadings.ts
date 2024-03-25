/**
 * @summary body에서 Heading을 한 단계 낮추는 함수
 * @param body
 * @returns
 */
export default function replaceBodyHeadings(body: string) {
  const replacements = [
    { from: 'h3', to: 'h4' },
    { from: 'h2', to: 'h3' },
    { from: 'h1', to: 'h2' },
  ];

  let modifiedBody = body;
  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(`\\b${from}\\b`, 'g');
    modifiedBody = modifiedBody.replace(regex, to);
  });

  return modifiedBody;
}

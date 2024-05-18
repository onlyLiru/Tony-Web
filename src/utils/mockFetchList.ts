/**
 * 模拟请求列表数据
 * dev模式下demo用
 */
let count = 0;
export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export async function mockFetchList() {
  if (count >= 5) {
    return [];
  }
  await sleep(2000);
  count++;
  return [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
  ];
}

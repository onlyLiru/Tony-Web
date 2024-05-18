import request from '@/utils/request';

/** 校验名称 */
export function checkCollectionName(data: { name: string }) {
  return request<any>('/api/checkCollectionName', {
    method: 'POST',
    body: data,
  });
}

/** 校验url */
export function checkCollectionUrl(data: { customize_url: string }) {
  return request<any>('/api/checkCollectionUrl', {
    method: 'POST',
    body: data,
  });
}

/** 创建集合 */
export function createCollection(data: any) {
  return request<any>('/api/createCollection', {
    method: 'POST',
    body: data,
  });
}

/** 取消创建集合 */
// export function cancelCollection(data: { customize_url: string }) {
//   return request<any>('/api/cancelCollection', {
//     method: 'POST',
//     body: data,
//   });
// }

/** 创建独立合约 */
// export function createCollectionContract(data: { customize_url: string }) {
//   return request<{ market_place: string; order_uid: string }>(
//     '/api/createCollectionContract',
//     {
//       method: 'POST',
//       body: data,
//     },
//   );
// }

/** 修改集合 */
export function updateCollection(data: any) {
  return request<any>('/api/updateCollection', {
    method: 'POST',
    body: data,
  });
}

/** 获取集合详情 */
export function getCollectionInfo(data: { customize_url: string }) {
  return request<any>('/api/getCollectionInfo', {
    method: 'POST',
    body: data,
  });
}

/** 获取集合列表 */
export function getCollectionList(data: { customize_url: string }) {
  return request<any>('/api/itemCollectionList', {
    method: 'POST',
    body: data,
  });
}

/** 获取nft详情 */
export function getNftInfo(data: { customize_url: string; item_id: number }) {
  return request<any>('/api/getItemInfo', {
    method: 'POST',
    body: data,
  });
}

/** 创建nft */
export function createNft(data: any) {
  return request<any>('/api/createItem', {
    method: 'POST',
    body: data,
  });
}

/** 编辑nft */
export function updateNft(data: any) {
  return request<any>('/api/updateItem', {
    method: 'POST',
    body: data,
  });
}

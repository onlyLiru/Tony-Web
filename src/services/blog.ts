import request from '@/utils/request';

export declare namespace ApiBlog {
  interface getAlbumInfo {
    album_info: AlbumInfo;
    hot_tag: string[];
    new_release: AlbumInfo[];
    tag_info: any[];
  }

  interface AlbumInfo {
    album_id: number;
    banner_image: string;
    content: string;
    introduction: string;
    recommend_image: string;
    release_time: number;
    status: number;
    title: string;
  }
}

/** 获取用户基本信息 */
export function getAlbumInfo(data: { album_id: number }) {
  return request<ApiBlog.getAlbumInfo>('/api/getAlbumInfo', {
    method: 'POST',
    body: data,
  });
}

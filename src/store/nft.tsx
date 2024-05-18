import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

import { LOCAL_KEY } from '@/const/localKey';

export class NftStore {
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: LOCAL_KEY.refresh,
      properties: ['toRefreshAll'],
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    });
  }
  toRefreshAll = false;
  setToRefreshAll(val: boolean) {
    this.toRefreshAll = val;
  }
}

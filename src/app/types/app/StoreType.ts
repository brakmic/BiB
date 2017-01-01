import { IntegralStateType } from './IntegralStateType';

type StoreType = {
  state: IntegralStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

export {
    StoreType
};

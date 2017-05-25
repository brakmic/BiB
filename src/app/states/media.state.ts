import { Observable } from 'rxjs/Observable';
import { IMedium } from '../interfaces';

export interface IMediaState {
  media: IMedium[];
}

export const initialMediaState: IMediaState = {
  media: undefined
};

export function getMedia(state$: Observable<IMediaState>) {
  return state$.select((state) => state.media);
}

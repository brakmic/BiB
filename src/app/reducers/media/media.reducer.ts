import { IMediaState, initialMediaState } from 'app/states';
import { MediaAction, MediaActionTypes } from 'app/actions';

export function mediaReducer(
    state: IMediaState = initialMediaState,
    action: MediaAction
): IMediaState {
  switch (action.type) {
    case MediaActionTypes.INITIALIZED:
      return (<any>Object).assign({}, state, {
        media: [...(<any[]>action.payload)]
      });
    case MediaActionTypes.RETRIEVED:
      return (<any>Object).assign({}, state, {
        media: [...(<any[]>action.payload)]
      });
    case MediaActionTypes.INSERTED:
      return (<any>Object).assign({}, state, {
        media: [...state.media, action.payload]
      });
    case MediaActionTypes.REMOVED:
    {
      const filtered = state.media.filter(medium => medium.ID != (<any>action.payload).ID);
      return (<any>Object).assign({}, state, {
        media: [...filtered]
      });
    }
    case MediaActionTypes.UPDATED:
    {
      const filtered = state.media.filter(medium => medium.ID != (<any>action.payload).ID);
      filtered.push((<any>action.payload));
        return (<any>Object).assign({}, state, {
          media: [...filtered]
        });
    }
    default:
      return state;
  }
}

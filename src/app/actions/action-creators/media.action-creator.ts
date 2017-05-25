import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { IMedium } from '../../interfaces';
import * as media from '../media.action';

@Injectable()
export class MediaActions {
  public mediaInit() {
    return new media.InitMediaAction();
  }
  public mediaInitialized(payload: IMedium[]) {
    return new media.InitializedMediaAction(payload);
  }
  public mediaRetrieved(payload: IMedium[]): Action {
      return new media.MediaRetrievedAction(payload);
  }
  public mediaInserted(payload: IMedium): Action {
      return new media.MediaInsertedAction(payload);
  }
  public mediaRemoved(payload: IMedium): Action {
      return new media.MediaRemovedAction(payload);
  }
  public mediaUpdated(payload: IMedium): Action {
      return new media.MediaUpdatedAction(payload);
  }
  public mediaChanged(): Action {
      return new media.MediaChangedAction();
  }
}

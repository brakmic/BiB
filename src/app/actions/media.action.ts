import { Action } from '@ngrx/store';
import { type } from 'app/helpers';
import { CATEGORY } from 'app/common';
import { IMedium } from 'app/interfaces';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export interface IMediaActions {
  INIT:        string;
  INITIALIZED: string;
  INIT_FAILED: string;
  RETRIEVED:   string;
  INSERTED:    string;
  REMOVED:     string;
  UPDATED:     string;
  CHANGED:     string;
}

// tslint:disable-next-line:variable-name
export const MediaActionTypes: IMediaActions = {
  INIT:        type(`${CATEGORY} Media Init`),
  INITIALIZED: type(`${CATEGORY} Media Initialized`),
  INIT_FAILED: type(`${CATEGORY} Media Init Failed`),
  RETRIEVED:   type(`${CATEGORY} Media Retrieved`),
  INSERTED:    type(`${CATEGORY} Media Inserted`),
  REMOVED:     type(`${CATEGORY} Media Removed`),
  UPDATED:     type(`${CATEGORY} Media Updated`),
  CHANGED:     type(`${CATEGORY} Media Changed`)
};

/**
 * Every action is comprised of at least a type and an optional
 * payload.
 **/
export class InitMediaAction implements Action {
  type = MediaActionTypes.INIT;
  payload: IMedium[] = undefined;

  constructor() { }
}

export class InitializedMediaAction implements Action {
  type = MediaActionTypes.INITIALIZED;

  constructor(public payload: IMedium[]) { }
}

export class InitFailedMediaAction implements Action {
  type = MediaActionTypes.INIT_FAILED;
  payload: IMedium[] = null;

  constructor() { }
}

export class MediaRetrievedAction implements Action {
    type = MediaActionTypes.RETRIEVED;

    constructor(public payload: IMedium[]) { }
}

export class MediaInsertedAction implements Action {
    type = MediaActionTypes.INSERTED;

    constructor(public payload: IMedium) { }
}

export class MediaRemovedAction implements Action {
    type = MediaActionTypes.REMOVED;

    constructor(public payload: IMedium) { }
}

export class MediaUpdatedAction implements Action {
    type = MediaActionTypes.UPDATED;

    constructor(public payload: IMedium) { }
}

export class MediaChangedAction implements Action {
    type = MediaActionTypes.CHANGED;
    payload: IMedium[] = null;

    constructor() { }
}

export type MediaAction
  = InitMediaAction
  | InitializedMediaAction
  | InitFailedMediaAction
  | MediaRetrievedAction
  | MediaInsertedAction
  | MediaRemovedAction
  | MediaUpdatedAction
  | MediaChangedAction;

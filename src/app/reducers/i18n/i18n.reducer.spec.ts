import {
    async,
    TestBed
} from '@angular/core/testing';

import {  I18N_ACTIONS, i18nReducer } from './i18n.reducer';

describe('Reducer: i18n', () => {
    let currentState = undefined;
    beforeEach(() => {
        currentState = i18nReducer({ code: 'de-DE'}, { type: I18N_ACTIONS.LANG_CHANGED });
    });

    it('should be available', () => {
        expect(i18nReducer).toBeTruthy();
    });

    it('should be initialized with language code: de-DE', () => {
        expect(currentState).toEqual({ code: 'de-DE' });
    });

    it('should change to language code: en-US', () => {
        currentState = i18nReducer({ code: 'en-US'}, { type: I18N_ACTIONS.LANG_CHANGED });
        expect(currentState).toEqual({ code: 'en-US' });
    });

});

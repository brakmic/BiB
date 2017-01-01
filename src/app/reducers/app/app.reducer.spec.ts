import {
    async,
    TestBed
} from '@angular/core/testing';
import { appReducer,
         LOGON_AVAILABLE,
         LOGON_UNAVAILABLE,
         DEBUG_TOOLS_AVAILABLE,
         DEBUG_TOOLS_UNAVAILABLE } from './app.reducer';

describe('Reducer: App', () => {

    beforeEach(() => {
        appReducer(undefined, { type: undefined });
    });

    it('should be available', () => {
        expect(appReducer).toBeTruthy();
    });

    it('should activate logons', () => {
        const state = appReducer({ logon: true }, { type: LOGON_AVAILABLE });
        expect(state).toEqual({logon: true});
    });

    it('should deactivate logons', () => {
        const state = appReducer({ logon: false }, { type: LOGON_UNAVAILABLE });
        expect(state).toEqual({logon: false});
    });

    it('should activate debug tools', () => {
        const state = appReducer({ debugTools: true }, { type: DEBUG_TOOLS_AVAILABLE });
        expect(state).toEqual({debugTools: true});
    });

    it('should deactivate debug tools', () => {
        const state = appReducer({ debugTools: false }, { type: DEBUG_TOOLS_UNAVAILABLE });
        expect(state).toEqual({debugTools: false});
    });
});

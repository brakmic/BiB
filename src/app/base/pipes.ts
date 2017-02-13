import { TestPipe } from 'app/pipes/test';
import { SanitizedUrlPipe } from 'app/pipes/url';
import { IterablePipe } from 'app/pipes/iterable';

const APP_PIPES = [
    TestPipe,
    SanitizedUrlPipe,
    IterablePipe
];


export {
    APP_PIPES
};

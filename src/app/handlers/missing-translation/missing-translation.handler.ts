import { MissingTranslationHandler, MissingTranslationHandlerParams } from 'ng2-translate';

export class BibMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        return `XX${params.key}`;
    }
}

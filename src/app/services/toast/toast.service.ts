import { Injectable } from '@angular/core';
// Services
import {
    LogService, i18nService,
    ConfigService, SessionService,
    UploadService
} from 'app/services';
import { ActionStatus } from 'app/enums';

@Injectable()
export class ToastService {

    constructor(private translate: i18nService) { }

    public show(message: string, caption: string, status: ActionStatus,
        progress: boolean = false, timeout: number = 2000,
        position: string = 'toast-top-center') {
        (<any>window).toastr.options.timeOut = timeout;
        (<any>window).toastr.options.progressBar = progress;
        (<any>window).toastr.options.positionClass = position;
        switch (status) {
            case ActionStatus.Success:
                {
                    (<any>window).toastr.info(message, caption);
                }
                break;
            case ActionStatus.Failure:
            case ActionStatus.Canceled:
                {
                    (<any>window).toastr.warning(message, this.translate.instant('Warning'));
                }
                break;
            default:
                {
                    (<any>window).toastr.info(message, caption);
                }
                break;
        }
    }

}
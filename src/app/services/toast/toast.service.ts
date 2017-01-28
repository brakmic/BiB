import { Injectable } from '@angular/core';
// Services
import { LogService, i18nService,
         ConfigService, SessionService,
         UploadService } from 'app/services';
import { ActionStatus } from 'app/enums';

@Injectable()
export class ToastService {
    
    constructor(/*private translate: i18nService*/) { }

    public show(message: string, caption: string, status: ActionStatus, 
                     progress: boolean = false, timeout: number = 2000,
                     position: string = 'toast-top-center') {
        toastr.options.timeOut = timeout;
        toastr.options.progressBar = progress;
        toastr.options.positionClass = position;
        switch (status) {
            case ActionStatus.Success:
                {
                    toastr.info(message, caption);
                }
                break;
            case ActionStatus.Failure:
            case ActionStatus.Canceled:
                {
                    // toastr.warning(message, this.translate.instant('Warning'));
                }
                break;
            default:
                {
                    toastr.info(message, caption);
                }
                break;
        }
    }

}
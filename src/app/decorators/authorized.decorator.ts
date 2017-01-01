// Helpers
import { Bib } from 'app/helpers';
// IUserData
import { IAppState, IUserGroup, IUserSettings,
         ISession, IConfig, IWindowEx,
         ICountry, ILocalData, IAcl } from 'app/interfaces';
// RxJS
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { bibApi } from 'app/apis';
import * as fetchApi from 'app/apis/fetch';
import * as _ from 'lodash';
// State Management with Redux
import '@ngrx/core/add/operator/select';
import { Store } from '@ngrx/store';
const config: IConfig = require('../../config.json');

const getAcl = (): IAcl => {
  const data: ILocalData = JSON.parse(localStorage.getItem(config.bib_localstorage));
  if (data && data.group) {
    return data.group.Acl;
  }
  return undefined;
};

const getGroup = (): IUserGroup => {
  const data: ILocalData = JSON.parse(localStorage.getItem(config.bib_localstorage));
  if (data && data.group) {
    return data.group;
  }
  return undefined;
};

const getLangCode = (): string => {
  const data: ILocalData = JSON.parse(localStorage.getItem(config.bib_localstorage));
  if (data && data.language) {
    return data.language;
  }
  return 'en-US';
}

const getLanguageFile = (code: string): Promise<{ [key:string]: string; }> => {
  return fetchApi.doFetch(`${bibApi.translationsUrl}/${code}`).then((translation: {[key: string]: string}) => {
    return translation;
  });
};

const showWarning = (message: string, caption: string) => {
    toastr.options.timeOut = 2000;
    toastr.options.progressBar = false;
    toastr.options.positionClass = "toast-top-center";
    toastr.error(message, caption);
};

const hasSufficientPermissions = (group: IUserGroup): boolean => {
   return ((group.Name == 'Administrators') || 
            (group.Name == 'Librarian'));
};

const authorized = function() {
    return (target: any, key: string, descriptor: any) => {
    let langFiles = {};
    let langFile = undefined;
    let acl = undefined;
    let group = undefined;
    let code = undefined;
    const all = _.map(config.countries, country => {
        return getLanguageFile(country.language).then(file => {
          return {
            code: country.language,
            file: file
          };
        });
    });

    Promise.all(all).then(results => langFiles = results);
    
    // save a reference to the original method
    // this way we keep the values currently in the 
    // descriptor and don't overwrite what another 
    // decorator might have done to the descriptor.
    const originalMethod = descriptor.value; 
    //editing the descriptor/value parameter
    descriptor.value =  function (...args: any[]) {
        let result = undefined;
        acl = getAcl();
        group = getGroup();
        code = getLangCode();
        langFile = _.find(langFiles, {code: code })['file'];
        if (hasSufficientPermissions(group)) {
          // const a = args.map(a => JSON.stringify(a)).join();
          // note usage of originalMethod here
          result = originalMethod.apply(this, args);
          const r = JSON.stringify(result);
        } else {
          showWarning(langFile['WarnInsufficientRights'], langFile['Error']);
        }
        // console.log(`Call: ${key}(${a}) => ${r}`);
        return result;
    }

    // return edited descriptor as opposed to overwriting 
    // the descriptor by returning a new descriptor
    return descriptor;
  };

};

export {
  authorized
}

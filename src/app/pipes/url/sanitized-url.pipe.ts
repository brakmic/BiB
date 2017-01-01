import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'sanitized'
})
export class SanitizedUrlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {}
    public transform(url): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

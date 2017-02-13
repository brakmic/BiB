import { Component, OnInit,
         ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { imagesApi } from 'app/apis';

@Component({
    selector: 'bib-home',
    // styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    private photo = '';
    constructor(private cd: ChangeDetectorRef) { }

    public ngOnInit() {

    }
    public ngOnDestroy() {
        $('bib-root').siblings().remove();
    }
    public ngAfterViewInit(){
        this.photo = imagesApi.getImageData('photo');
        this.cd.markForCheck();
    }
}

import { Component, OnInit,
         Input, OnChanges, OnDestroy,
         AfterViewInit, ChangeDetectionStrategy,
         ChangeDetectorRef, SimpleChanges,
         SimpleChange } from '@angular/core';

import { IMediumDisplay } from 'app/interfaces';
import { imagesApi } from 'app/apis';
import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    selector: 'bib-media-info',
    templateUrl: './media-info.component.html',
    styleUrls: [
        './media-info.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaInfoComponent implements OnInit,
                                           OnChanges,
                                           OnDestroy,
                                           AfterViewInit {

    @Input() public medium: IMediumDisplay;

    constructor(private cd: ChangeDetectorRef) { }

    public ngOnInit() {

    }
    public ngOnChanges(changes: SimpleChanges) {
        if (!_.isNil(changes['medium'].currentValue)) {
            if (_.isNil(this.medium.Picture)) {
                this.medium.Picture = imagesApi.getImageData('no-image');
            }
            console.log(`${changes['medium'].currentValue['Title']}`);
        }
    }
    public ngOnDestroy() {

    }
    public ngAfterViewInit() {

    }
}

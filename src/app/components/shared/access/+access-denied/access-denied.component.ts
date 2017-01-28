import { Component,
         ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
         // Routing
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'access-denied',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessDeniedComponent {
    private warningLogo: string;
    private data: any;

    constructor(private route: ActivatedRoute) { }

    public ngOnInit() {
      this.data = this.route.snapshot.data['data'];
    }

    private goBack($event: any) {
      $event.preventDefault();
      window.history.go(-1);
    }
}

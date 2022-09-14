import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { OnInit, ViewContainerRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: `./zd-change-price-demo.component.html`,
    styles: [`
    .textares{
        min-height: 500px;
        white-space: pre-wrap;
        overflow-y: scroll;
    }
    `]
})
export class ZdChangedemoComponent implements OnInit {
    changeDemo: '';
    constructor(private xn: XnService,
        private router: ActivatedRoute,
    ) {

    }

    ngOnInit(): void {
        this.router.queryParams.subscribe(v => {
            this.xn.api.post('/custom/zhongdeng/zd/asset_description', { registerNo: v.registerNo }).subscribe(x => {
                this.changeDemo = x.data.description;
            });
        });

    }
}

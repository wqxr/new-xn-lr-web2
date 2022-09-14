import {Component, OnInit} from '@angular/core';
import {XnService} from '../../services/xn.service';

@Component({
    selector: 'xn-platform-rate-view',
    templateUrl: './platform-rate-view.component.html',
    styles: [
        `.file-row-table { margin-bottom: 0; }`,
        `.file-row-table th { border-style: dashed; font-weight: normal; border-color: #d2d6de; border-bottom-width: 1px; line-height: 100%; font-size: 13px;}`,
        `.file-row-table td { border-style: dashed; padding: 6px; border-color: #d2d6de; font-size: 13px; }`,
        `.table-bordered {border-style: dashed; border-color: #d2d6de; }`,
    ]
})
export class PlatformRateViewComponent implements OnInit {

    ratePrivate = '-';
    rateP2P = '-';
    rateBank = '-';
    rateHonour = '-';

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.xn.api.mock('/record/platform-rate', {
            data: {
                ratePrivate: '20%',
                rateP2P: '18%',
                rateBank: '5.2%',
                rateHonour: '8.5%'
            }
        }).subscribe(json => {
            this.ratePrivate = json.data.ratePrivate;
            this.rateP2P = json.data.rateP2P;
            this.rateBank = json.data.rateBank;
            this.rateHonour = json.data.rateHonour;
        });
    }
}

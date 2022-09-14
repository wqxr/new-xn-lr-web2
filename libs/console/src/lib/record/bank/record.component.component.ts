import { Component, OnInit, ViewChild } from '@angular/core';
import { RecordComponent } from '../record.component';
import { ActivatedRoute, Params } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'xn-bank-record',
    templateUrl: './record.component.html'
})
export class BankRecordComponent implements OnInit {
    @ViewChild(RecordComponent) recordComponent: RecordComponent;
    private flowId: string;

    constructor(private xn: XnService, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.flowId = params.id;
        });

        // 重写 RecordComponent 的 onNewRecord 方法
        this.recordComponent.onNewRecord = () => {
            this.xn.router.navigate([`/console/bank/record/new/${this.flowId}`]);
        };

        this.recordComponent.editAction = this.editAction.bind(this);
    }

    editAction(val: any) {
        val.tag.preventDefault();
        const data = this.recordComponent.datatable.datatable.row($(val.tag.target).closest('tr')).data();
        // status：0, 1编辑，2 查看
        if ((data.status !== 1 && data.status !== 0) || this.xn.user.roles.indexOf(data.nowRoleId) < 0) {
            this.xn.router.navigate([`/console/record/${this.flowId}/view/${data.recordId}`]);
        } else {
            this.xn.router.navigate([`/console/bank/record/${this.flowId}/edit/${data.recordId}`]);
        }
    }
}

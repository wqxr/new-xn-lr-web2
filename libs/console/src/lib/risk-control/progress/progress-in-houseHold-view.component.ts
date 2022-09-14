import {Component, OnInit, Output, EventEmitter, ElementRef, ViewContainerRef, Input} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'app-progress-in-house-hold-view',
    templateUrl: './progress-in-houseHold-view.component.html',
    styles: [
            `.title {
            padding: 10px 0px;
            font-weight: bold
        }

        .title .text {
            font-size: 16px;
        }

        .deal {
            margin-bottom: 50px;
        }

        table th, table td {
            text-align: center;
        }

        .info {
            font-size: 16px;
            border: 1px solid #eee;
            background-color: #eee;
            padding: 10px 15px;
            margin-bottom: 15px
        }

        .label-text {
            width: 150px;
            padding-right: 20px;
            line-height: 34px;
        }

        .required-star:after {
            content: '*';
            color: red;
        }

        .flex {
            display: flex;
        }

        .label-input {
            flex: 1
        }

        .label-alert {
            width: 100px;
            color: red;
        }
        `
    ]
})
export class ProgressInHouseHoldViewComponent implements OnInit {

    @Input() item: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter(false);

    public clientType: string; // 客户类型
    public visitCom: string; // 受访公司
    public visitType: string; // 受访方式
    public visitDate: any = {
        value: this.formatTimestamps(+new Date()).yyyymmdd
    }; // 访谈日期
    public visitContent: string; // 访谈内容
    public whyVisit: string; // 访谈目的
    public visitAfter: string; // 后续跟进

    public objList = {
        staff: [],
        visited: []
    };

    public profileForm = new FormGroup({
        clientType: new FormControl('', [Validators.required]),
        visitCom: new FormControl('', [Validators.required]),
        visitType: new FormControl('', [Validators.required]),
        visitContent: new FormControl('', [Validators.required]),
        whyVisit: new FormControl(''),
        visitAfter: new FormControl(''),
    });


    constructor(
        private xn: XnService
    ) {
    }

    ngOnInit() {
        this.getHouseHold();
    }

    getHouseHold() {
        this.xn.api.post('/mdz/executive/query', {id: this.item.id}).subscribe(x => {
            if (x.ret === 0) {
                const init = x.data;
                this.profileForm.setValue({
                    clientType: init.appType, // 受访客户类型
                    visitCom: init.appName, // 受访公司名字
                    visitType: init.visitType, // 访谈方式
                    whyVisit: init.visitPurpose, // 访谈目的
                    visitContent: init.visitContent, // 访谈内容
                    visitAfter: init.visitOthert, // 后续跟进事项
                });
                this.visitDate = {value: this.formatTimestamps(Number(init.visitTime)).yyyymmdd}; // 访谈时间
                this.objList.staff = JSON.parse(init.followContentList); // 随访人员
                this.objList.visited = JSON.parse(init.visitContentList); // 受访人员
            }
        });
    }

    formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    }

    formatTimestamps(date) {
        const _date = new Date(date);
        const year = _date.getFullYear();
        const month = _date.getMonth() + 1;
        const day = _date.getDate();
        return {
            yyyymmdd: [year, month, day].map(this.formatNumber).join('-')
        };
    }

    // 获取日期
    getVisitDate(e) {
        this.visitDate = e;
    }


    // 检查数组长度
    chechLeh(e) {
        return this.objList[e].length > 0;
    }


    onBack() {
        this.onChange.emit({
            type: 'home'
        });
    }
}

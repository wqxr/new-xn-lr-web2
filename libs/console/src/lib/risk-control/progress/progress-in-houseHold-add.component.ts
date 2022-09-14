import {Component, OnInit, Output, EventEmitter, ElementRef, ViewContainerRef, Input, ViewChild} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {HouseHoldStaffModel} from './progress-in-houseHold-pop-staff.component';
import {BigDataListModel} from '../risk-control.service';
import { DateInputDayComponent } from 'libs/shared/src/lib/public/component/date-input.component';

@Component({
    selector: 'app-progress-in-house-hold-add',
    templateUrl: './progress-in-houseHold-add.component.html',
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
export class ProgressInHouseHoldAddComponent implements OnInit {

    @Input() item: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter(false);
    @Input() customerInfo: BigDataListModel; // 企业信息
    @ViewChild(DateInputDayComponent)
    private DateInputDayComponent: DateInputDayComponent;

    public clientType: string; // 客户类型
    public visitCom: string; // 受访公司
    public visitType: string; // 受访方式
    public visitDate: any = ''; // 访谈日期
    public visitContent: string; // 访谈内容
    public whyVisit: string; // 访谈目的
    public visitAfter: string; // 后续跟进

    public statusTit: string[] = ['新增', '编辑'];
    public status: string = this.statusTit[0]; // 页面状态

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
        private xn: XnService,
        private er: ElementRef,
        private vcr: ViewContainerRef
    ) {
    }

    ngOnInit() {
        if (this.item != null) {
            this.status = this.statusTit[1];
            this.getHouseHold();
        }
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
                this.DateInputDayComponent.initTime(this.visitDate);
                this.DateInputDayComponent.initDate();
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

    // 提交表单
    onSubmit() {
        let params: any = {
            appType: '',
            appName: '',
            visitType: '',
            visitPurpose: '',
            visitContent: '',
            visitOthert: '',
            visitTime: 0,
            createTime: 0,
            followContentList: '',
            visitContentList: '',
        };

        params.appType = this.profileForm.value.clientType; // 受访客户类型
        params.appName = this.profileForm.value.visitCom; // 受访公司名字
        params.visitType = this.profileForm.value.visitType; // 访谈方式
        params.visitPurpose = this.profileForm.value.whyVisit; // 访谈目的
        params.visitContent = this.profileForm.value.visitContent; // 访谈内容
        params.visitOthert = this.profileForm.value.visitAfter; // 后续跟进事项
        params.visitTime = +new Date(this.visitDate.value); // 访谈时间
        // params.createTime = +new Date() // 创建时间
        params.followContentList = JSON.stringify(this.objList.staff); // 随访人员
        params.visitContentList = JSON.stringify(this.objList.visited); // 受访人员
        if (this.status === this.statusTit[0]) {
            params.appId = this.customerInfo.appId;
            // 新增操作
            this.xn.api.post('/mdz/executive/add', params)
                .subscribe(json => {
                    if (json.ret === 0) {
                        this.profileForm.reset();
                        this.objList.visited = [];
                        this.objList.staff = [];
                        this.onBack();
                    }
                });
        } else if (this.status === this.statusTit[1]) {
            // 编辑操作
            params = Object.assign({}, params, {id: this.item.id});

            this.xn.api.post('/mdz/executive/update', params)
                .subscribe(json => {
                    if (json.ret === 0) {
                        this.profileForm.reset();
                        this.objList.visited = [];
                        this.objList.staff = [];
                        this.onBack();
                    }
                });
        }


    }

    // 删除访问与受访
    delObject(e, i) {
        this.xn.msgBox.open(true, '确定执行此操作？',
            () => {
                this.objList[e].splice(i, 1);
            }, () => {
                console.log('取消');
            });
    }

    // 检查数组长度
    chechLeh(e) {
        return this.objList[e].length > 0;
    }


    // 修改
    editObject(e, item, i) {
        const shows1 = [
            {
                checkerId: 'staffName',
                required: true,
                type: 'text',
                title: '姓名',
                validators: {
                    cnName: true
                },
                value: item.staffName
            },
            {
                checkerId: 'staffCode',
                required: true,
                type: 'text',
                title: '工号',
                validators: {},
                value: item.staffCode
            },
            {
                checkerId: 'staffTel',
                required: true,
                type: 'text',
                title: '联系方式',
                validators: {
                    mobile: true
                },
                value: item.staffTel
            }
        ];
        const shows2 = [
            {
                checkerId: 'visitedName',
                required: true,
                type: 'text',
                title: '姓名',
                validators: {
                    cnName: true
                },
                value: item.visitdName
            },
            {
                checkerId: 'visitedCode',
                required: true,
                type: 'text',
                title: '职务',
                validators: {},
                value: item.visitdCode
            },
            {
                checkerId: 'visitedTel',
                required: true,
                type: 'text',
                title: '联系方式',
                validators: {
                    mobile: true
                },
                value: item.visitdTel
            }
        ];
        let params;
        e === 'staff' ? params = shows1 : params = shows2;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, HouseHoldStaffModel, params).subscribe(x => {
            if (x) {
                this.objList[e][i] = x;
            }
        });
    }

    // 打开弹窗
    openPopLayer(e) {
        const shows1 = [
            {
                checkerId: 'staffName',
                required: true,
                type: 'text',
                title: '姓名',
                validators: {
                    cnName: true
                }
            },
            {
                checkerId: 'staffCode',
                required: true,
                type: 'text',
                title: '工号',
                validators: {}
            },
            {
                checkerId: 'staffTel',
                required: true,
                type: 'text',
                title: '联系方式',
                validators: {
                    mobile: true
                }
            }
        ];
        const shows2 = [
            {
                checkerId: 'visitedName',
                required: true,
                type: 'text',
                title: '姓名',
                validators: {
                    cnName: true
                },
            },
            {
                checkerId: 'visitedCode',
                required: true,
                type: 'text',
                title: '职务',
                validators: {}
            },
            {
                checkerId: 'visitedTel',
                required: true,
                type: 'text',
                title: '联系方式',
                validators: {
                    mobile: true
                }
            }
        ];
        let params;
        e === 'staff' ? params = shows1 : params = shows2;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, HouseHoldStaffModel, params).subscribe(x => {
            if (x) {
                this.objList[e].push(x);
            }
        });
    }

    onBack() {
        this.onChange.emit({
            type: 'home'
        });
    }
}

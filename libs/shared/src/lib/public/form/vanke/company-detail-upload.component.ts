import { Component, Input, OnInit, ElementRef, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of, fromEvent } from 'rxjs';
@Component({
    templateUrl: './company-detail-upload.component.html',
    selector: 'company-detail-upload',

})


export class CompanyDetailUploadComponent implements OnInit, AfterViewInit {
    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('fileGroup') fileGroup: ElementRef;
    svrConfig: any;
    datalist: any;
    mainForm: FormGroup;
    ctrl: AbstractControl;
    ctrl1: AbstractControl;
    alert = '';
    subResize: any;
    searchValue = {
        orgName: '',
    };
    public items = {
        businessLicenseFile: '',
        businessLicenseFileDate: '',
        orgLegalCard: '',
        orgLegalCardDate: '',
        orgLegalCert: '',
        orgLegalCertDate: '',
        certUserCard: '',
        certUserCardDate: '',
        certUserAuthorize: '',
        certUserAuthorizeDate: '',
        companyDecision: '',
        companyDecisionDate: '',
        authorizationFile: '',
        authorizationFileDate: ''
    };
    public checker = [
        {
            title: '营业执照',
            checkerId: 'businessLicenseFile',
            type: 'newfile',
            required: 1,
            checked: false,
            value: '',
        },
        {
            title: '营业执照失效日期',
            checkerId: 'businessLicenseFileDate',
            type: 'date4',
            required: 0,
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '法定代表人身份证',
            checkerId: 'orgLegalCard',
            required: 1,
            type: 'newfile',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '法定代表人身份证失效日期',
            checkerId: 'orgLegalCardDate',
            required: 1,
            type: 'date4',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '法定代表人证明书',
            checkerId: 'orgLegalCert',
            required: 1,
            type: 'newfile',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '法定代表人证明书失效日期',
            checkerId: 'orgLegalCertDate',
            required: 1,
            type: 'date4',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '数字证书使用人身份证',
            checkerId: 'certUserCard',
            required: 1,
            type: 'newfile',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '数字证书使用人身份证失效日期',
            checkerId: 'certUserCardDate',
            required: 1,
            type: 'date4',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '数字证书使用人授权书',
            checkerId: 'certUserAuthorize',
            required: 1,
            type: 'newfile',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '数字证书使用人授权书失效日期',
            checkerId: 'certUserAuthorizeDate',
            required: 1,
            type: 'date4',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '公司章程/股东会/董事会决议',
            checkerId: 'companyDecision',
            required: 1,
            type: 'newfile',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '公司章程/股东会/董事会决议失效日期',
            checkerId: 'companyDecisionDate',
            required: 1,
            type: 'date4',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '授权文件',
            checkerId: 'authorizationFile',
            required: 1,
            type: 'newfile',
            validators: {},
            checked: false,
            value: '',

        },
        {
            title: '授权文件失效日期',
            checkerId: 'authorizationFileDate',
            required: 1,
            type: 'date4',
            validators: {},
            checked: false,
            value: '',

        },

    ];
    constructor(private xn: XnService, private vcr: ViewContainerRef,
        private er: ElementRef) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        if (this.row.flowId && this.row.flowId === 'platform_check_information') {
            XnFormUtils.buildSelectOptions(this.checker);
            this.buildChecker(this.checker);
            this.mainForm = XnFormUtils.buildFormGroup(this.checker);
            this.items = JSON.parse(this.row.value);
            this.checker.forEach(x => {
                x.value = this.items[x.checkerId];
            });
            this.mainForm = XnFormUtils.buildFormGroup(this.checker);
            this.mainForm.valueChanges.subscribe(x => {
                this.searchValue = x;
                this.toValue1();
            });
        } else {
            this.ctrl1 = this.form.get('orgName');
            XnFormUtils.buildSelectOptions(this.checker);
            this.buildChecker(this.checker);
            this.mainForm = XnFormUtils.buildFormGroup(this.checker);
            // console.info(this.row.value);
            // if (this.row.value !== '' && this.row.value !== undefined) {
            //     this.items = JSON.parse(this.row.value);
            //     this.checker.forEach(x => {
            //         x.value = this.items[x.checkerId];
            //         // x.checked = this.items[x.checkerId] === "" ? false : true;
            //         this.mainForm = XnFormUtils.buildFormGroup(this.checker);
            //     });
            // }
            // console.info('items===>', this.items);

            // console.info('this.checker=>', this.checker);
            this.mainForm.valueChanges.subscribe(x => {
                this.searchValue = Object.assign({}, this.searchValue, x);
                this.toValue();
            });

            this.fromValue();
        }
        this.svrConfig = Object.assign({}, this.items, { flowId: this.row.flowId }, { orgName: this.form.get('orgName').value });
        // console.log(this.items,this.row,this.svrConfig,this.form.get('orgName'));
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
        // console.info(this.row.data, 'wqwq');
        // this.label = this.row.data;
    }
    ngAfterViewInit() {
        this.formResize();
    }

    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize) {
            this.subResize.unsubscribe();
        }
    }
    /**
     *
     * @param e 浏览器放缩动态改变组件样式
     */
    formResize() {
        const $parentForm = $(this.fileGroup.nativeElement).closest('.form-group');
        // 获取父元素宽度
        const parentWidth = $parentForm.outerWidth();
        const col2Width = $parentForm.children('.xn-control-label').outerWidth(true);
        const col8Left = ($parentForm.children('.col-sm-8').outerWidth(true) - $parentForm.children('.col-sm-8').width()) / 2;
        // 设置当前元素样式
        // console.log("---",parentWidth,col2Width,col8Left);
        $(this.fileGroup.nativeElement).css({
            width: `${parentWidth}`,
            position: 'relative',
            left: `${-(col2Width + col8Left)}px`
        });
    }
    /**
      * 单选
      * @param e
      * @param item
      * @param index
      */
    public singelChecked(e, items, itemsnext) {
        if (this.row.flowId === 'platform_check_information') {
            return;
        }
        if (items.checked && items.checked === true) {
            items.checked = false;
        } else {
            items.checked = true;
        }
        if (itemsnext.checked && itemsnext.checked === true) {
            itemsnext.checked = false;
        } else {
            itemsnext.checked = true;
        }
    }
    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
    private fromValue() {
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        this.toValue();
    }
    // 上传完后取回值
    private toValue() {
        this.searchValue.orgName = this.ctrl1.value;
        this.ctrl.setValue(JSON.stringify(this.searchValue));
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    private toValue1() {
        this.ctrl.setValue(JSON.stringify(this.searchValue));
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    /**
     * 下载授权文件
     */
    public authorizationFile() {
        this.xn.loading.open();
        this.xn.api.download('/user/get_auth_confirm_file', { type: "applyCa", download: 1 }).subscribe((v: any) => {
            this.xn.loading.close();
            this.xn.api.save(v._body, '授权文件.pdf');
        });
    }
}

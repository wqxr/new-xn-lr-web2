import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {ActivatedRoute} from '@angular/router';
import {SelectOptions} from 'libs/shared/src/lib/config/select-options';
import {LoadingService} from 'libs/shared/src/lib/services/loading.service';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

declare let $: any;

/**
 *  深圳CA信息详情
 */
@Component({
    selector: 'app-page-console-manage-ca-detail',
    templateUrl: './ca-detail.component.html',
    styles: [`
        .alert-text {
            padding: 5px;
            color: #cb0e23;
        }

        input.alert-boder {
            border-color: #cb0e23;
        }
    `]
})
export class CaDetailComponent implements OnInit {
    public data: CaDetailOutputModel = new CaDetailOutputModel();
    // 中国省份
    public china: any = SelectOptions.get('chinaCity');
    // 经办人身份类型
    public userCertType = SelectOptions.get('userCertType');
    // 城市列表
    public citys: any[];
    public label: any;
    public orgAddressBool = false;
    public orgRegAddressBool = false;
    public orgEmailBool = false;
    public areaBool = false;
    public orgZipCodeBool = false;
    public userNameBool = false;
    public userMobileBool = false;
    public userCertNOBool = false;
    public userEmailBool = false;
    public userCertTypeBool = false;
    public alert1 = false;
    public alert2 = false;
    public alert3 = false;
    public alert4 = false;
    public alert5 = false;
    public alert6 = false;
    public mainForm: FormGroup;
    public shows: any[] = [
        {
            title: '文件信息', checkerId: 'fileInfo', type: 'mfile',
            options: {
                filename: '数字证书申请表',
                fileext: 'jpg, jpeg, png',
                picSize: '300'
            }
        },
        {
            title: '营业执照', checkerId: 'businessLicenseFile', type: 'file',
            options: {
                filename: '营业执照',
                fileext: 'jpg, jpeg, png',
                picSize: '300'
            }
        },

    ];

    // 邮箱验证
    private emailReg: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // 邮政编码
    private zipCodeReg: RegExp = /^[0-9]\d{5}$/;
    // 电话号
    private userMobileReg: RegExp = /^(((13[0-9]{1})|(147)|(15[0-3]{1})|(15[5-9]{1})|(170)|(173)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;
    // 证件号码
    private userCertNOReg: RegExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    // 中文名称
    private userNameReg: RegExp = /^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*$/;

    public constructor(private xn: XnService,
                       private activatedRoute: ActivatedRoute,
                       private vcr: ViewContainerRef,
                       private loadingService: LoadingService) {
    }

    public ngOnInit() {
        this.loadingService.open();
        const appId = this.activatedRoute.snapshot.params.id;
        this.xn.api.post('/jzn/ca/get', {appId}).subscribe(x => {
            this.data = x.data;
            // 初始状态城市列表
            this.citys = this.china.second[this.data.orgProvince];
            // 构建表单赋值
            this.shows.forEach(checker => {
                checker.value = x.data[checker.checkerId];
            });
            this.buildForm();
            this.loadingService.close();
        });
    }

    public goBack() {
        this.xn.user.navigateBack();
    }

    // 从新发送ca
    public resetCa() {
        this.xn.msgBox.open(true, '确定要重新发送CA审核', () => {
            this.xn.api.post('/jzn/ca/reset', {appId: this.data.appId}).subscribe(() => {
                this.xn.user.navigateBack();
            });
        });
    }

    // 省份查询
    public onChange(val) {
        this.citys = this.china.second[val];
    }

    // 重置图片信息
    public setFileinfo(row) {
        if (row.checkerId === 'fileInfo') {
            const params = {appId: this.data.appId, fileInfo: this.mainForm.value.fileInfo};
            this.xn.api.post('/jzn/ca/set_file', params).subscribe();
        } else if (row.checkerId === 'businessLicenseFile') {
            const params = {appId: this.data.appId, businessLicenseFile: this.mainForm.value.businessLicenseFile};
            this.xn.api.post('/jzn/ca/set_file_business', params).subscribe();
        }
    }

    // 修改基本信息
    public setBaseInfo(value: any) {
        const params: any = {
            appId: this.data.appId
        };
        if (value === 'orgAddress') {
            this.orgAddressBool = !this.orgAddressBool;
            params.orgAddress = this.data.orgAddress;
        } else if (value === 'orgRegAddress') {
            this.orgRegAddressBool = !this.orgRegAddressBool;
            params.orgRegAddress = this.data.orgRegAddress;
        } else if (value === 'orgCity') {
            this.areaBool = !this.areaBool;
            params.orgCity = this.data.orgCity;
            params.orgProvince = this.data.orgProvince;
        } else if (value === 'orgEmail') {
            // 对邮箱格式进行验证
            if (!this.emailReg.test(this.data.orgEmail)) {
                this.alert1 = true;
                return;
            }
            this.alert1 = false;
            this.orgEmailBool = !this.orgEmailBool;
            params.orgEmail = this.data.orgEmail;
        } else if (value === 'orgZipCode') {
            if (!this.zipCodeReg.test(this.data.orgZipCode)) {
                this.alert2 = true;
                return;
            }
            this.alert2 = false;
            this.orgZipCodeBool = !this.orgZipCodeBool;
            params.orgZipCode = this.data.orgZipCode;
        } else if (value === 'userName') {
            if (!this.userNameReg.test(this.data.userName)) {
                this.alert3 = true;
                return;
            }
            this.alert3 = false;
            this.userNameBool = !this.userNameBool;
            params.userName = this.data.userName;
        } else if (value === 'userMobile') {
            if (!this.userMobileReg.test(this.data.userMobile)) {
                this.alert4 = true;
                return;
            }
            this.alert4 = false;
            this.userMobileBool = !this.userMobileBool;
            params.userMobile = this.data.userMobile;
        } else if (value === 'userCertNO') {
            if (!this.userCertNOReg.test(this.data.userCertNO)) {
                this.alert5 = true;
                return;
            }
            this.alert5 = false;
            this.userCertNOBool = !this.userCertNOBool;
            params.userCertNO = this.data.userCertNO;
        } else if (value === 'userEmail') {
            // 对邮箱格式进行验证
            if (!this.emailReg.test(this.data.userEmail)) {
                this.alert6 = true;
                return;
            }
            this.alert6 = false;
            this.userEmailBool = !this.userEmailBool;
            params.userEmail = this.data.userEmail;
        } else if (value === 'userCertType') {
            this.userCertTypeBool = !this.userCertTypeBool;
            params['userCertType:'] = this.data.userCertType;
        }
        this.xn.api.post('/jzn/ca/set_base', params).subscribe(x => {
            //
        });
    }

    private buildForm() {
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}

class CaDetailOutputModel {
    public appId?: string;
    public appName?: string; // 该应用的名称，例如香纳保理业务系统
    public applyId?: string; // 申请订单编号
    public step?: number; // 0=不需要处理，1=申请ca证书订单编号，2=上传证书需要的图片，3=处理完成
    // 业务单状态，“SUCCESS”和“ARCHIVE”表示已下载证书；“DISABLE”表示业务单已作废；“AUDITFAIL”表示业务单审核驳回；AUDIT 表示待审核
    public status?: string;
    public orgName?: string; // 机构名称
    public orgCode?: string; // 机构代码(统一社会信用代码 或 机构组织代码)
    public orgAddress?: string; // 机构地址
    public orgRegAddress?: string; // 机构注册地址
    public orgProvince?: string; // 机构所在省份
    public orgCity?: string; // 机构所在城市
    public orgZipCode?: string; // 机构邮编
    public orgEmail?: string; // 机构企业邮箱
    public applyValidate?: number; // 证书申请服务期限（单位:天）
    public certValidate?: number; // 证书申请有效期（单位:天）
    public userName?: string; // 经办人名称
    public userMobile?: string; // 经办人手机号
    public userCertType?: string; // 经办人证件类型（身份证为:SF)
    public userCertNO?: string; // 经办人证件号
    public userEmail?: string; // 经办人邮箱
    public fileInfo?: any[]; // 文件信息
    public errDesc?: string; // 被驳回描述
    public expressId?: string; // 物流单号
}

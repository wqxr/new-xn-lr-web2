import { Component, OnInit, Input, AfterViewChecked, ViewContainerRef, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { SelectOptions, applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceDataViewModalComponent } from '../../share/modal/invoice-data-view-modal.component';
import { isNullOrUndefined } from 'util';
import { MfilesViewModalComponent } from '../../share/modal/mfiles-view-modal.component';
import { reject } from 'q';
import { LoadingPercentService } from 'libs/shared/src/lib/services/loading-percent.service';
import { forkJoin } from 'rxjs';
import { SingleListParamInputModel, SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import * as _ from 'lodash';
import { ZhongDengStauts } from '../zhongdeng-record/zhongdeng-record.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ZdStatus } from 'libs/shared/src/lib/config/enum/common-enum';

declare var $: any;
/**
 *  中登流程check项
 */
@Component({
    selector: 'zhongdeng-info',
    templateUrl: './zhongdeng.component.html',
    styles: [`
        .btn {
            width: 100px;
            margin-right: 20px;
        }
        .desc{
            word-wrap: break-word;
            min-height: 100px;
            max-height: 200px;
            overflow-y: scroll;
        }
    `]
})

export class ZhongdengComponent implements OnInit, AfterViewChecked {
    // 登记业务类型
    public type: any = SelectOptions.get('registerType');
    // 登记期限
    public days: any = SelectOptions.get('registerDays');
    public registerType = 0;
    public registerDays: any;
    public show = [];
    public manual = [];
    public isFinish = [];
    public isJudge = [];

    @Input() row: any;
    public ctrl1: AbstractControl;

    public infos: any;
    public handRegister: {};
    public registerNum = '';
    public modifiedCode = '';
    public registerFile = [];
    public memo: string;
    public files = [];
    public flags = []; // 主题一致性
    public debtUnits = []; // 收款单位
    public alert = [];
    // 处理文件传输需要的参数
    public obj: any;
    public afiles: any;
    public rfiles: any[] = [];
    public checkId: string;
    public assetFileList = [];
    public asset = {} as any;
    public isEmpty = true;
    public index = -1;
    public amountTotals = [];
    public contractIdStrs = [];
    public descs = [];
    public invParam = [];

    public companyType: any[] = SelectOptions.get('zhongdengCompanyType');
    public companyTypesValue = []; //
    public showAlert = '请求正在进行中，是否跳转到台账列表';
    public factoringOrgNameList = [];


    form1: FormGroup;
    form2: FormGroup;
    public formModule = 'dragon-input';
    public checker1 = [
        {
            title: '登记证明文件',
            checkerId: 'registerFile',
            type: 'dragonMfile',
            required: 1,
            checked: false,
            options: { fileext: 'jpg,jpeg,png,pdf', picSize: '500' }
        },
        {
            title: '中等附件',
            checkerId: 'zhongdengAttachment',
            type: 'newMfile',
            required: 0,
            checked: false,
            options: { fileext: 'jpg,pdf', picSize: '500' },
            value: '',
        },
    ];
    public options = { fileext: 'pdf' };
    public zdAttachmentFile: any[] = [];  // 中登附件

    @ViewChild('numInput') numInput: ElementRef;

    constructor(private xn: XnService,
        private vcr: ViewContainerRef,
        private cdr: ChangeDetectorRef,
        private loading: LoadingPercentService,
        private publicCommunicateService: PublicCommunicateService) {
    }

    ngOnInit() {
        XnFormUtils.buildSelectOptions(this.checker1);
        this.buildChecker(this.checker1);
        this.form1 = XnFormUtils.buildFormGroup(this.checker1);
        this.ctrl1 = this.form1.get('registerFile');
        this.form1.get('zhongdengAttachment').valueChanges.subscribe(x => {
            if (x && this.judgeDataType(JSON.parse(x)) && JSON.parse(x).length > 0) {
                this.zdAttachmentFile = JSON.parse(x);
            } else {
                this.zdAttachmentFile = [];
            }
        })
        this.ctrl1.valueChanges.subscribe(x => {
            if (x && this.judgeDataType(JSON.parse(x)) && JSON.parse(x).length > 0) {
                this.rfiles = JSON.parse(x);
            } else {
                this.rfiles = [];
            }
        });

        this.infos = this.row;
        for (let i = 0; i < this.infos.length; i++) {
            this.show[i] = true;
            this.manual[i] = false;
            this.isFinish[i] = false;
            this.isJudge[i] = false;
            this.infos.status = 5;
            const amountTotal1 = '' + this.infos[i].amountTotal;
            this.amountTotals.push(amountTotal1);
            const contractIdStr1 = this.infos[i].contractIdStr;
            this.contractIdStrs.push(contractIdStr1);
            const desc1 = this.infos[i].desc;
            this.descs.push(desc1);
        }
        // 若收款单位相同，上传文件相同的初始设置
        for (const info of this.infos) {
            for (let i = 0; i < info.list.length; i++) {
                this.flags[i] = info.list[i].flag;
                this.debtUnits[i] = info.list[i].debtUnit;
                this.factoringOrgNameList[i] = info.list[i].factoringOrgName;

                this.companyTypesValue[i] = info.list[i].companyType;
                this.files[i] = {
                    mainFlowId: ''
                };
                this.files[i].mainFlowId = info.list[i].mainFlowId;
                // this.files[i].assetFile = info.list[i].assetFile;
                this.alert[i] = '';
            }
        }
    }

    ngAfterViewChecked() {
        if (this.index !== -1 && this.isFinish[this.index] && !this.isJudge[this.index]) {
            this.judgeValue(this.index);
        }
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    public arrayLength(paramFileInfos: any) {
        if (!paramFileInfos) {
            return false;
        }
        const obj =
            typeof paramFileInfos === 'string'
                ? paramFileInfos.split(',')
                : [paramFileInfos];
        return obj;
    }
    showRegisterFile(paramIndex: number) {
        return (this.infos.status === ZdStatus.REGISTER_COMPLETE || this.infos.status === ZdStatus.REGISTER_FAIL) && !!this.infos[paramIndex].zhongdengAttachment
    }

    /**
     *
     * @param type type 为1 代表出让人信息查看， type 为2 代表查看受让人信息
     */
    viewPersonInfo(type: number) {
        let companylist = [];
        if (type === 1) {
            companylist = _.sortedUniq(this.debtUnits);
        } else {
            companylist = _.sortedUniq(this.factoringOrgNameList);
        }
        // this.debtUnits = _.sortedUniq(this.debtUnits);
        const mainFlowIds$ = companylist.map(temp =>
            this.xn.api.post('/custom/dragon/verify_business_file/get_seller_info',
                {
                    orgName: temp,
                }));
        forkJoin(mainFlowIds$).subscribe(async (x: any) => {
            let dataInfo = x.map((x: any) => x.data);
            let params: SingleListParamInputModel = {
                title: `${ModalTitle[type]}`,
                get_url: '',
                get_type: '',
                multiple: null,
                heads: [
                    { label: '注册资本', value: 'registCapi', type: 'text' },
                    { label: '组织机构代码', value: 'orgNo', type: 'text' },
                    { label: '工商注册号', value: 'no', type: 'text' },
                    { label: '法定代表人', value: 'operName', type: 'text' },
                    { label: '所属行业', value: 'econKind', type: 'text' },
                    { label: '注册地址', value: 'address', type: 'text' },
                    // { label: '发票文件', value: 'invoiceFile',type: 'file' },
                ],
                searches: [],
                key: '',
                data: dataInfo || [],
                total: dataInfo.length || 0,
                inputParam: {
                },
                rightButtons: [{ label: '确定', value: 'submit' }]
            };
            if (type === 1) {
                params.heads.unshift({ label: '收款单位', value: 'orgName', type: 'text' });
            } else {
                params.heads.unshift({ label: '单位', value: 'orgName', type: 'text' });

            }
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
                if (v === null) {
                    return;
                }
            });
        });
    }


    /**
     *  判断数据类型
     * @param paramValue
     */
    public judgeDataType(paramValue: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(paramValue);
        } else {
            return Object.prototype.toString.call(paramValue) === '[object Array]';
        }
    }
    // 发票查看
    public viewMore(param) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, InvoiceDataViewModalComponent, param).subscribe(() => {
        });
    }
    // 企业类型
    getCompanytype(e, i: number) {
        this.companyTypesValue[i] = Number(e.target.value);
        for (let j = 0; j < this.debtUnits.length; j++) {
            if ((this.debtUnits[j] === this.debtUnits[i]) && (j !== i)) {
                this.companyTypesValue[j] = this.companyTypesValue[i];
            }
        }
    }
    // 登记业务类型查询
    public changeType(val, i) {
        this.registerType = Number(val);
        this.infos[i].registerType = this.registerType;
        // this.judgeValue(i);
    }

    // 登记期限查询
    public changeDays(val, i) {
        this.registerDays = val === '' ? '' : Number(val);
        this.infos[i].registerDays = this.registerDays;


        // this.infos[i].registerDays = this.registerDays;
        // this.judgeValue(i);
    }

    public isNotShow(i) {
        this.show[i] = false;
    }

    public isShow(i) {
        this.show[i] = true;
    }
    // 人工登记
    public manualRegister(i) {
        this.index = i;
        this.manual[i] = true;
        document.getElementsByClassName('registerNum')[i].removeAttribute('disabled');
        document.getElementsByClassName('modifiedCode')[i].removeAttribute('disabled');
        this.isFinish[i] = true;
    }
    // 完成人工登记
    public manualRegisterFinish(idx) {
        this.buildRegisterFile(idx);

        this.infos[idx].modifiedCode = this.modifiedCode;
        this.infos[idx].registerNum = this.registerNum;
        this.infos[idx].memo = this.memo ? this.memo : '';
        this.assetFileList.forEach((asset, index) => {
            asset.companyType = this.companyTypesValue[index];
        });
        this.handRegister = {
            registerId: this.infos[idx].registerId,
            registerType: this.registerType,
            registerDays: this.registerDays,
            contractIdStr: this.contractIdStrs[idx],
            amountTotal: parseFloat(this.amountTotals[idx]),
            desc: this.descs[idx],
            registerNum: this.registerNum,
            modifiedCode: this.modifiedCode,
            registerFile: JSON.stringify(this.registerFile),
            zhongdengAttachment: JSON.stringify(this.zdAttachmentFile),
            memo: this.memo ? this.memo : '',
            assetFileList: this.assetFileList
        };
        this.xn.dragon
            .post('/zhongdeng/zd/handRegister', this.handRegister)
            .subscribe(x => {
                if (x.ret === 0) {
                    this.isJudge[idx] = true;
                    this.infos[idx].contractIdStr = this.contractIdStrs[idx];
                    this.infos[idx].amountTotal = this.amountTotals[idx];
                    this.infos[idx].desc = this.descs[idx];
                    this.infos[idx].registerFile = JSON.stringify(this.registerFile);
                    this.manual[idx] = false;
                    this.infos.status = 3;
                    // 人工登记完成，人工登记、取消登记按钮不可用
                    this.registerFinish(idx);
                    this.cdr.markForCheck();
                    this.xn.msgBox.open(true, '中登登记序号' + parseInt(idx + 1) + '已完成登记,是否跳转到台账列表', () => {
                        window.history.back()
                    });
                }
            });
    }
    // 控制系统登记按钮是否可操作
    systemShow(paramIndex): boolean {
        let companyType = false;
        // 交易列表企业类型是否选择
        this.infos[paramIndex].list.forEach((x, index) => {
            if (!!!this.companyTypesValue[index]) {
                companyType = true;
            }
        });
        return !this.registerType || !this.registerDays
            || !this.descs[paramIndex] || companyType || this.infos.status === ZhongDengStauts.DONE
            || this.infos.status === ZhongDengStauts.DOING || this.manual[paramIndex];
    }
    // 人工登记和完成人工登记按钮是否可操作
    manualShow() {
        return this.infos.status === ZhongDengStauts.DONE || this.infos.status === ZhongDengStauts.DOING;
    }

    // 系统登记
    systemRegister(paramIndex) {

        const infos = [];
        this.infos[paramIndex].list.forEach((x, index) => {
            infos.push({ mainFlowId: x.mainFlowId, companyType: this.companyTypesValue[index] });

        });
        this.infos.modifiedCode = this.modifiedCode;
        this.infos.registerNum = this.registerNum;

        this.handRegister = {
            registerId: this.infos[paramIndex].registerId,
            registerType: this.registerType,
            registerDays: this.registerDays,
            collateralDescribe: this.descs[paramIndex],
            contractIdStr: this.contractIdStrs[paramIndex],
            zhongdengAttachment: JSON.stringify(this.zdAttachmentFile),
            assetFileList: infos,
            amountTotal:this.amountTotals[paramIndex],
        };
        // this.xn.loading.open();
        this.xn.avenger.post2('/sub_system/zd/system_register', this.handRegister).subscribe(x => {
            // this.xn.loading.close();
            if (x.ret === 0) {
                this.xn.msgBox.open(true, this.showAlert, () => {
                    this.infos.status = 1;
                    this.xn.user.navigateBack();
                }, () => {
                    this.infos.status = 1;
                });
                // $('.xn-msgbox-msg span').text('已完成系统中等登记，是否跳转到台账列表');
                // this.modifiedCode = x.data['modifiedCode'];
                // this.registerNum = x.data['registerNum'];
                // this.infos.status = 3;
                // this.infos[paramIndex].contractIdStr = this.contractIdStrs[paramIndex];
                // this.infos[paramIndex].amountTotal = this.amountTotals[paramIndex];
                // this.infos[paramIndex].desc = this.descs[paramIndex];
                // this.manual[paramIndex] = false;
                // // this.infos[paramIndex].status = 3;
                // this.infos[paramIndex].registerFile = x.data['registerFile'];
                // for (let i = 0; i < x.data.assetList.length; i++) {
                //     this.files[i] = {
                //         mainFlowId: ''
                //     };
                //     this.files[i]['mainFlowId'] = x.data.assetList[i].mainFlowId;
                //     this.alert[i] = '';
                //     this.files[i].file = x.data.assetList[i].assetFile;
                // }
                // this.cdr.markForCheck();
            } else {
                this.xn.msgBox.open(true, `${x.msg}，是否跳转到台账列表`, () => {
                    this.infos.status = 2;
                    console.log('this.files[0].mainFlowId', this.files[0].mainFlowId)
                    console.log(this.files[0].mainFlowId.endsWith('wk_xn'), this.files[0].mainFlowId.endsWith('wk'))
                    if (this.files[0].mainFlowId.endsWith('wk_xn')) {
                        this.xn.router.navigate([`/xnvanke/machine_list`]);
                    } else if (this.files[0].mainFlowId.endsWith('wk')) {
                        this.xn.router.navigate([`/vanke/vanke/machine_list`]);
                    } else if (this.files[0].mainFlowId.endsWith('bgy')) {
                        this.xn.router.navigate([`/country-graden/machine_list`]);
                    } else if (this.files[0].mainFlowId.endsWith('oct')) {
                        this.xn.router.navigate([`/oct/oct/machine_list`]);
                    } else {
                        this.xn.router.navigate([`/logan/machine_list`]);
                    }
                });
            }
        });
    }

    public onBeforeUpload(e, i) {
        if (this.files[i].file) {
            e.preventDefault();
            this.xn.msgBox.open(false, '请先删除已上传的文件，才能上传新文件');
            return;
        }
    }

    public onUploadFile(e, id, i, index) {
        if (e.target.files.length === 0) {
            return;
        }
        const err = this.validateFileExt(e.target.files[0].name);
        if (err.length > 0) {
            this.alert[i] = err;

            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            return;
        } else {
            this.alert[i] = '';
        }
        if (e.target.files[0].size / (1024 * 1024) > 80) {
            this.xn.msgBox.open(false, '很抱歉，您允许上传的图片不能超过80M，谢谢');
            return;
        }

        const fd = new FormData();
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        this.loading.open(1, 0);


        this.xn.dragon.upload('/file/pdfWk', fd).subscribe(v => {
            if (v.type === 'complete') {
                if (v.data.ret === 0) {
                    this.files[i].file = {
                        fileName: v.data.data.fileName,
                        fileId: v.data.data.fileId,
                        filePath: v.data.data.filePath,
                    };
                    if (v.data.data.orgName === this.debtUnits[i]) {
                        this.flags[i] = 1;
                    } else { this.flags[i] = 2; }
                    this.pushAsset(i, id, index);
                    this.showAsset(i, index);
                    this.loading.close();
                }
            }
        });
    }

    /**
     * 上传的文件将其放入到assetFileList
     * @param {*} i
     * @param {*} id
     */
    public pushAsset(i, id, index) {
        const asset1 = {} as any;
        const array = [];
        array.push(this.files[i].file);
        asset1.mainFlowId = id;
        asset1.assetFile = JSON.stringify(array);
        asset1.flag = this.flags[i];
        asset1.companyType = this.companyTypesValue[i];
        this.assetFileList.push(asset1);
        this.assetFileList = XnUtils.distinctArray2([...this.assetFileList], 'mainFlowId');
        this.assetFileList.forEach((x) => {
            if (x.mainFlowId === id) {
                x.mainFlowId = id;
                x.assetFile = JSON.stringify(array);
                x.flag = this.flags[i];
                x.companyType = this.companyTypesValue[i];
            }
        });
        this.infos[index].assetFileList = this.assetFileList;
    }

    /**
     * 如果有相同收款单位那么查询证明文件相同，也同步显示
     * @param {*} i
     */
    public showAsset(i, index) {
        for (let j = 0; j < this.debtUnits.length; j++) {
            if ((this.debtUnits[j] === this.debtUnits[i]) && (j !== i)) {
                this.flags[j] = this.flags[i];
                this.files[j].file = this.files[i].file;
                this.pushAsset(j, this.files[j].mainFlowId, index);
            }
        }
    }

    public onRemove(id, j) {
        delete this.files[j].file;
        this.flags[j] = 0;
        const div = document.getElementsByClassName('asset')[j];
        const input = div.getElementsByTagName('input')[0];
        input.value = '';
        for (let i = 0; i < this.assetFileList.length; i++) {
            if (this.assetFileList[i].mainFlowId === id) {
                this.assetFileList[i].assetFile = null;
            }
        }
        // 有相同的收款单位时，查询证明文件删除那么其余也同步
        for (let z = 0; z < this.debtUnits.length; z++) {
            if ((this.debtUnits[z] === this.debtUnits[j]) && (z !== j)) {
                delete this.files[z].file;
                this.flags[z] = 0;
                const div = document.getElementsByClassName('asset')[z];
                const input = div.getElementsByTagName('input')[0];
                input.value = '';
                for (let i = 0; i < this.assetFileList.length; i++) {
                    if (this.assetFileList[i].mainFlowId === this.files[z].mainFlowId) {
                        this.assetFileList[i].assetFile = null;
                    }
                }
            }
        }
    }

    /**
     *  验证所选文件格式，根据文件后缀
     * @param s 文件全名
     */
    private validateFileExt(s: string) {
        if (isNullOrUndefined(this.options)) {
            return '';
        }
        if ('fileext' in this.options) {
            const exts = this.options.fileext
                .replace(/,/g, '|')
                .replace(/\s+/g, ''); // 删除所有空格
            if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
                return '';
            } else {
                return `只支持以下文件格式: ${this.options.fileext}`;
            }
        } else {
            return '';
        }
    }

    public buildRegisterFile(idx) {
        this.registerFile = [];
        for (let i = 0; i < this.rfiles.length; i++) {
            const file = {} as any;
            file.fileId = this.rfiles[i].fileId;
            file.fileName = this.rfiles[i].fileName;
            file.filePath = this.rfiles[i].filePath;
            this.registerFile.push(file);
        }
        this.infos[idx].registerFile = this.registerFile.length > 0 ? JSON.stringify(this.registerFile) : '';
    }

    public cancelRegister(i) {
        this.xn.dragon
            .post('/zhongdeng/zd/cancelRegister', { registerId: this.infos[i].registerId })
            .subscribe(x => {
                if (x.ret === 0) {
                    console.log('取消登记完成');
                    this.manual[i] = false;
                    // 取消登记成功后如果中登序号只有1那么返回台账页面，如果有个多个中登序号则删除取消的模块
                    if (i === 0) {
                        this.xn.user.navigateBack();
                    } else {
                        this.infos.splice(i, 1);
                    }
                }
            });
    }

    public registerFinish(i) {
        document.getElementsByClassName('handRe')[i].setAttribute('disabled', 'disabled');
        document.getElementsByClassName('cancelRe')[i].setAttribute('disabled', 'disabled');
    }

    // 判断是否填完人工登记所需要的值
    public judgeValue(i) {
        if (this.registerType !== 0 && this.registerDays !== 0 && this.registerNum.length !== 0 &&
            this.modifiedCode.length !== 0 && (this.rfiles && this.rfiles.length !== 0) &&
            this.amountTotals[i].length !== 0 && this.descs[i].length !== 0) {
            this.files.every(file => {
                if (file.file) {
                    document.getElementsByClassName('handRe')[i].removeAttribute('disabled');
                    return true;
                } else {
                    document.getElementsByClassName('handRe')[i].setAttribute('disabled', 'disabled');
                }
            });
        } else {
            document.getElementsByClassName('handRe')[i].setAttribute('disabled', 'disabled');
        }
    }

    /**
     *  查看文件
     * @param paramFile
     */
    public onView(paramFile: { fileId: string, fileName: string }) {
        const paramFiles = [];
        const fileType: string = paramFile.fileName.substring(paramFile.fileName.lastIndexOf('.') + 1);
        paramFiles.push(paramFile);
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, paramFiles).subscribe(() => {
        });
    }
    returnBack() {
        const list = [];
        this.infos.forEach((x, idx) => {
            this.buildRegisterFile(idx);
            x.modifiedCode = this.modifiedCode;
            x.registerNum = this.registerNum;
            x.memo = this.memo ? this.memo : '';
            this.handRegister = {
                registerId: x.registerId,
                registerType: x.registerType,
                registerDays: x.registerDays,
                contractIdStr: this.contractIdStrs[idx],
                amountTotal: parseFloat(this.amountTotals[idx]),
                desc: this.descs[idx],
                registerNum: x.registerNum,
                modifiedCode: x.modifiedCode,
                registerFile: x.registerFile ? x.registerFile : '',
                memo: this.memo ? this.memo : '',
                assetFileList: x.assetFileList,
                zhongdengAttachment: JSON.stringify(this.zdAttachmentFile),

            };
            list.push(this.handRegister);
        });
        this.xn.dragon
            .post('/zhongdeng/zd/save_register', { list })
            .subscribe(x => {
                if (x.ret === 0) {
                    this.xn.user.navigateBack();
                }
            });



    }
    /**
        *  查看文件信息
        * @param paramFile
        */
    public viewFiles(paramFile) {
        let array = [];
        if (paramFile !== '' && typeof paramFile === 'string') {
            // 如果是json转为js
            const param = JSON.parse(paramFile);
            // 转换后验证是否为对象，如果是放进数组里
            if (!Array.isArray(param)) {
                array.push(param);
            } else {
                array = param;
            }
        } else {
            array.push(paramFile);
        }
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, array).subscribe();
    }
}
enum ModalTitle {
    '出让人信息' = 1,
    '受让人信息' = 2,
}

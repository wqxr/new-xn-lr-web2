import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from '../../services/xn.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnUtils } from '../../common/xn-utils';

@Component({
    selector: 'xn-fee-promise-pay',
    templateUrl: './fee-promise-pay.component.html',
    styles: [
        `
            .table {
                font-size: 13px;
            }
            .table-head {
                font-size: 12px;
            }
            input[type='file'] {
                display: none;
            }
            button {
                margin: 1em;
            }
        `
    ]
})
export class FeePromisePayComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;

    theadText = ['核心企业 ID', '核心企业名称', '核心企业类型', '是否可使用保证付款', '保理服务费率（%）', '有效期', '备注'];

    originData: Array<any> = [];
    data: Array<any> = [];
    auditInfo: {
        checkDate: string;
        checker: string;
        reChecker: string;
    } = {
        checkDate: '',
        checker: '',
        reChecker: ''
    };
    alert = '';
    ctrl: AbstractControl;
    uploading = false;
    private flowId = 'financing_payment_service';

    /**
     * 发起流程
     */
    get isNew() {
        return this.xn.router.url.indexOf('new') >= 0;
    }

    /**
     * 审核
     */
    get isEdit() {
        return this.xn.router.url.indexOf('edit') >= 0;
    }

    constructor(private xn: XnService, private route: ActivatedRoute) {}

    ngOnInit() {
        if (this.form && this.row) {
            this.ctrl = this.form.get(this.row.name);
        }

        if (this.isEdit) {
            this.initEditData();
        } else {
            this.initData();
        }
    }

    // 上传excel
    onUploadExcel(e) {
        this.alert = '';
        this.uploading = true;
        if (e.target.files.length === 0) {
            return;
        }
        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;
            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            return;
        }

        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        fd.append('file_data', e.target.files[0], e.target.files[0].name);

        // 上传excel
        this.xn.api.upload('/llz/promisepay/excel_upload', fd).subscribe(
            res => {
                if (res.type === 'complete') {
                    const resData = res.data.data;
                    if (
                        res.data.msg ||
                        (resData && typeof resData === 'string')
                    ) {
                        this.alert = resData || res.data.msg;
                        return;
                    }

                    this.ctrl.setValue(JSON.parse(JSON.stringify(resData)));
                    this.checkChanged(this.originData, resData.data);
                }
            },
            error => {
                this.alert = error;
            },
            () => {
                this.uploading = false;
            }
        );
    }

    private initData() {
        this.xn.api
            .post('/llz/promisepay/list', {
                flowId: this.flowId
            })
            .subscribe(v => {
                this.originData = JSON.parse(JSON.stringify(v.data.data));
                this.data = v.data.data;
                this.auditInfo = {
                    checkDate: v.data.checkDate,
                    checker: v.data.checker,
                    reChecker: v.data.reChecker
                };
            });
    }

    private initEditData() {
        this.xn.api
            .post('/llz/promisepay/check_data', {
                recordId: this.route.snapshot.params.id,
                flowId: this.flowId
            })
            .subscribe(v => {
                this.data = v.data.data_01;
                const newData = Array.isArray(v.data.data_02)
                    ? v.data.data_02
                    : v.data.data_02.data;
                this.checkChanged(this.data, newData);
            });
    }

    private checkChanged(originData, newData = []) {
        const data = originData;
        const resData = newData;
        // 以最后上传的数据为准;
        resData.forEach(item => {
            if (data.findIndex(y => item.appId === y.appId) >= 0) {
                const keys = Object.keys(item);
                const temp = data.find((x: any) => x.appId === item.appId);
                keys.forEach(key => {
                    if (temp && temp[key] && item[key] && temp[key].toString() !== item[key].toString()) {
                        // 修改
                        item[
                            `new${key.charAt(0).toUpperCase()}${key.slice(1)}` // key => newKey
                        ] =
                            item[key];
                        item[key] = temp[key];
                    }
                });
            }
        });

        this.data = resData;
    }

    private validateExcelExt(s: string): string {
        const exts = 'xlsx, xls'.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
        if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
            return '';
        } else {
            return `只支持以下文件格式: ${exts}`;
        }
    }
}

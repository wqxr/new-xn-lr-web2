import { Injectable, ViewContainerRef, ElementRef } from '@angular/core';
import { XnService } from './xn.service';
import { CheckersOutputModel } from '../config/checkers';
import { XnModalUtils } from '../common/xn-modal-utils';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
declare let $: any;

/**
 *  图片上传,压缩
 */
@Injectable({ providedIn: 'root' })
export class UploadPicService {

    constructor(private xn: XnService) {
    }

    /**
     *  图片压缩
     * @param file 文件
     * @param alert 上传进度
     * @param row 该项配置
     * @param callback
     */
    public compressImage(file: Blob, alert: any, row: any, callback: { (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (blob: any, file: any): void; (arg0: any, arg1: any): void; (arg0: any, arg1: any): void; (arg0: any, arg1: any): void; }) {
        // 图片压缩配置
        let picSize = row.options.picSize || null;
        if (!picSize) {
            callback(file, file);
            return;
        }
        picSize = parseInt(picSize, 0);
        if (/(PDF|pdf)$/.test(file.type) && file.size / 1024 > picSize) {
            if (file.size / (1024 * 1024) > 80) {
                this.xn.msgBox.open(false, '很抱歉，您允许上传的文件不能超过80M，谢谢');
                return;
            }
        }

        // 检查上传的文件是否是图片格式，并且大小是否超过picSize KB，否则不压缩直接上传
        if ((/(gif|jpg|jpeg|png|GIF|JPG|JPEG|PNG)$/.test(file.type)) && file.size / 1024 > picSize) {
            if (file.size / (1024 * 1024) > 80) {
                this.xn.msgBox.open(false, '很抱歉，您允许上传的图片不能超过80M，谢谢');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onprogress = evt => {
                // this.onProgress(evt);
                alert = this.onProgress(evt);
            };
            // 利用canvas对图片进行压缩
            reader.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const image = new Image();
                image.src = reader.result as string;
                let data: string, bolbImg: Blob, quality = 0.5; // 初始化压缩比率为0.2
                image.onload = () => {
                    const w = image.width;
                    const h = image.height;
                    canvas.width = w;
                    canvas.height = h;
                    // canvas中，png转jpg会变黑底，所以先给canvas铺一张白底
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0, w, h);

                    // 自调用函数，保证图片的大小被的压缩到默认是picSize KB以下，压缩的大小可以配置，参数quality为压缩比率
                    (function goOnCompress(q) {
                        data = canvas.toDataURL('image/jpeg', q);
                        bolbImg = dataURLtoBlob(data);
                        if (((bolbImg.size / 1000) > picSize) && (q > 0.1)) {
                            // console.log('picSize: ' + picSize);
                            goOnCompress(quality -= 0.1);
                        } else if (((bolbImg.size / 1000) > picSize) && (q > 0.05)) {
                            // console.log('picSize: ' + picSize);
                            goOnCompress(quality -= 0.05);
                        } else if (((bolbImg.size / 1000) > picSize) && (q > 0.02)) {
                            // console.log('picSize: ' + picSize);
                            goOnCompress(quality -= 0.02);
                        } else if (((bolbImg.size / 1000) > picSize) && (q > 0.005)) {
                            // console.log('picSize: ' + picSize);
                            goOnCompress(quality -= 0.005);
                        }
                    })(quality);

                    // canvas生成的格式为base64，需要进行转化
                    function dataURLtoBlob(dataurl: { split: (arg0: string) => void; }) {
                        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]);
                        let n = bstr.length;
                        const u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new Blob([u8arr], { type: mime });
                    }

                    // 回调，将canvas生成的图片保存到本地
                    callback(bolbImg, file);
                };
            };
        } else {
            callback(file, file);
        }
    }

    // 上传进度条
    public onProgress(e: any): string {
        let alert = '';
        if (e.lengthComputable) {
            alert = `正在上传... ${Math.floor(e.loaded * 100 / e.total)}%`;
        }
        return alert;
    }


    /**
     *
     * @param paramData 该条数据的信息
     * @param mainflowId  交易Id
     */
    public viewDetail(paramData: any, vcr: ViewContainerRef, modal: any) {
        const params = {
            title: '新增合同',
            type: 1,
            contractFile: paramData.contractFile,
            checker: [
                {
                    title: '合同名称',
                    checkerId: 'contractName',
                    type: 'text',
                    required: 0,
                    value: paramData.contractName || '',
                },
                {
                    title: '合同编号',
                    checkerId: 'contractId',
                    type: 'text',
                    required: 0,
                    value: paramData.contractId || '',
                },
                {
                    title: '合同金额',
                    checkerId: 'contractMoney',
                    required: 1,
                    type: 'money',
                    value: paramData.contractMoney && parseFloat(paramData.contractMoney).toFixed(2) || '',
                },
                {
                    title: '付款比例',
                    checkerId: 'payRate',
                    type: 'text',
                    required: true,
                    value: paramData.payRate || '',
                    number: 6
                },
                {
                    title: '合同类型',
                    checkerId: 'contractType',
                    type: 'select',
                    required: 1,
                    options: { ref: 'dragonContracttype' },
                    validators: {},
                    value: paramData.contractType || '',
                },
                {
                    title: '合同签订时间',
                    checkerId: 'signTime',
                    type: 'date4',
                    placeholder: '',
                    required: 0,
                    value: paramData.signTime || '',
                },
                {
                    title: '基础合同甲方名称',
                    checkerId: 'contractJia',
                    type: 'text',
                    required: true,
                    value: paramData.contractJia || '',
                    number: 6
                },
                {
                    title: '基础合同乙方名称',
                    checkerId: 'contractYi',
                    type: 'text',
                    required: true,
                    value: paramData.contractYi || '',
                    number: 6
                },
                {
                    title: '累计确认产值',
                    checkerId: 'totalReceive',
                    required: 0,
                    type: 'text',
                    value: paramData.totalReceive || '',
                },
                {
                    title: '本次产值金额',
                    checkerId: 'percentOutputValue',
                    type: 'money',
                    required: false,
                    value: paramData.percentOutputValue || '',
                    number: 6
                },
                {
                    title: '本次付款性质',
                    checkerId: 'payType',
                    type: 'select',
                    required: true,
                    options: { ref: 'payType' },
                    value: paramData.payType || '',
                    number: 6
                },
                {
                    title: '基础合同-收款单位户名',
                    checkerId: 'debtUnitName',
                    type: 'text',
                    required: 0,
                    value: paramData.debtUnitName || '',
                },
                {
                    title: '基础合同-收款单位开户行',
                    checkerId: 'debtUnitBank',
                    type: 'text',
                    required: 0,
                    value: paramData.debtUnitBank || '',
                },
                {
                    title: '基础合同-收款单位账号',
                    checkerId: 'debtUnitAccount',
                    required: 0,
                    type: 'text',
                    value: paramData.debtUnitAccount || '',
                },
                {
                    title: '收款单位',
                    checkerId: 'debtUnit',
                    type: 'text',
                    required: 0,
                    options: { readonly: true },
                    value: paramData.debtUnit || '',
                },
                {
                    title: '申请付款单位',
                    checkerId: 'projectCompany',
                    type: 'text',
                    required: 0,
                    options: { readonly: true },
                    value: paramData.projectCompany || '',
                },
                {
                    title: '应收账款金额',
                    checkerId: 'receive',
                    required: 0,
                    type: 'text',
                    options: { readonly: true },
                    value: paramData.receive || '',
                },
            ] as CheckersOutputModel[],
        };
        XnModalUtils.openInViewContainer(this.xn, vcr, modal, params).subscribe(v => {
            if (v === null) {
                return;
            } else {
            }
        });

    }
}

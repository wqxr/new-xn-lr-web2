import { XnModalUtils } from './../common/xn-modal-utils';
import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';
import { LoadwordEditModalComponent } from '../public/modal/loadword-edit-modal.component';

export default class UploadInvoicePdf {
    static readonly showName = '上传中登网文件';

    static readonly showPage = false;

    static readonly canSearch = false;

    static readonly canDo = false;

    static readonly apiUrlBase = '/tool/pdftxt_all';

    static readonly webUrlBase = '/upload/upload-invoice-pdf';

    // static readonly keys = ['originalSingleEencoding'];  // 根据这个数组来匹配

    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '未转换为txt的PDF', checkerId: 'title', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        }
    ];

    static readonly list = {
        pageSize: 10,

        onList: (base: CommBase, params) => {
            base.onReturnArrays(params, 'title');
            // console.log('base: ', base);
            // console.log('params: ', params);
            // const customBtn = base.getBtn();
            // console.log('btnShow: ', customBtn);
            // if (customBtn === false) {
            //     base.onDefaultList(params);
            // }
        },

        headButtons: [
            {
                title: '上传PDF',
                type: 'input',
                clicked: true,
                class: 'btn btn-primary',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (xn: XnService, base: CommBase, e) => {
                    // console.log('test click', e.target.files[0]);
                    // console.log('test clickname', e.target.files[0].name);
                    for (let i = 0; i < e.target.files.length; i++) {
                        const fd = new FormData();
                        fd.append('file_data', e.target.files[i], e.target.files[i].name);
                        xn.api.upload('/attachment/upload/pdftxt', fd).subscribe({
                            next: v => {
                                console.log('v： ', v);
                                if (v.type === 'progress') {
                                } else if (v.type === 'complete') {
                                    if (v.data.ret === 0) {
                                        console.log('v::: ', v);
                                        // base.setBtn(true);
                                        // base.showPage(false);
                                        base.onReturnArrays({}, 'title');
                                    } else {
                                        xn.msgBox.open(false, v.data.msg);
                                    }
                                }
                            }
                        });
                    }
                }
            },
            {
                title: '批量转换为txt',
                type: 'a',
                customClick: true,
                class: 'btn btn-primary',
                // 如果can未定义，则默认是能显示的
                can: (base: CommBase, record) => false,

                click: (xn: XnService, base: CommBase) => {
                    xn.api.post('/tool/pdftxt', {

                    }).subscribe((v: any) => {
                        // xn.api.save(v._body, filename);
                        base.onReturnArrays({}, 'title');
                    });
                }
            },
        ],

        // 允许在行内根据不同条件增加行按钮
        rowButtons: [
            // {
            //     title: '编辑',
            //     type: 'a',
            //     // 如果can未定义，则默认是能显示的
            //     can: (base: CommBase, record) => true,

            //     click: (base: CommBase, record, xn, vcr) => {
            //         console.log('test click', record);
            //         XnModalUtils.openInViewContainer(xn, vcr, LoadwordEditModalComponent, record).subscribe(v => {
            //             // this.items.toString();
            //         });
            //     }
            // },
            // {
            //     title: '下载文件',
            //     type: 'a',
            //     // 如果can未定义，则默认是能显示的
            //     can: (base: CommBase, record) => true,

            //     click: (base: CommBase, record, xn, vcr) => {
            //         console.log('test click', record);

            //         const appId = xn.user.appId;
            //         const orgName = xn.user.orgName;
            //         const time = new Date().getTime();
            //         const filename = appId + '-' + orgName + '-' + time + '.zip';
            //         const files = [{ contractId: record.contractId, 'invoiceNum': record.invoiceNum }];
            //         xn.api.download('/ljx/word/down_file', {
            //             type: 0,
            //             files: files
            //         }).subscribe((v: any) => {
            //             // console.log('download subscribe', v);
            //             xn.api.save(v._body, filename);
            //         });
            //         // }
            //     }
            // }
        ],
    };

    // 只要存在detail配置就允许查看详情
    static readonly detail = false;

    // 如果没有或没权限显示add，那就不用显示新增按钮
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitAdd();
        // }
    };

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly edit = {
        can: (xn: XnService, record: any) => {
            return false;
        },

        // onSubmit: (base: CommBase) => {
        //     base.onDefaultSubmitEdit();
        // }
    };
}

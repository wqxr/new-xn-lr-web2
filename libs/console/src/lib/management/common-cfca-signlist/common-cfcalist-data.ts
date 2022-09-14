import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { ViewContainerRef } from '@angular/core';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { CommonSignStatus } from 'libs/shared/src/lib/config/enum/common-enum';

export default class CfcaSignConfig {
    static Signsearch = {  // 通用签章配置项
        heads: [
            { label: '企业名称', value: 'appName', type: 'text' },
            { label: '核心企业', value: 'headquarters', type: 'text' },
            { label: '签章方式', value: 'signType', type: 'signType' },
            { label: '状态', value: 'status', type: 'status' },
            { label: '交易ID', value: 'mainFlowId', type: 'text' },
            { label: '快递信息', value: 'expressNum', type: 'expressNum' },
            { label: '归档编号', value: 'identId', type: 'text' },
            { label: '发起人', value: 'createUserName', type: 'text' },
            { label: '备注', value: 'memo', type: 'text' },
            {
                label: '创建时间', value: 'createTime', type: 'longDateTime', _inList: {
                    sort: true,
                    search: true
                }
            },
            {
                label: '最后更新时间', value: 'updateTime', type: 'longDateTime', _inList: {
                    sort: true,
                    search: true
                }
            },
        ],
        searches: [
            {
                title: '企业名称',
                checkerId: 'appName',
                type: 'text',
                required: false,
                placeholder: '请输入企业名称',
            },
            {
                title: '交易ID',
                checkerId: 'mainFlowId',
                type: 'text',
                required: false,
                placeholder: '请输入交易id',
            },
            {
                title: '状态',
                checkerId: 'status',
                type: 'select',
                required: false,
                options: { ref: 'cfcasignStatus' }
            },
            {
                title: '创建时间',
                checkerId: 'createTime',
                type: 'quantum1',
                required: false,
            },
            {
                title: '发起人',
                checkerId: 'createUserName',
                type: 'text',
                required: false,
                placeholder: '请输入发起人',
            },
            {
                title: '核心企业',
                checkerId: 'headquarters',
                type: 'text',
                required: false,
                placeholder: '请输入核心企业',
            },
            {
                title: '签章方式',
                checkerId: 'signType',
                type: 'select',
                required: false,
                options: { ref: 'cfcaSignTypes' }

            },

        ],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        cfcaSignsearch: {
            title: '通用签章列表',
            value: 'cfca-sign-list',
            tabList: [
                {
                    label: '',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                leftheadButtons: [
                                    {
                                        label: '发起通用签章',
                                        operate: 'put-sign-common',
                                        post_url: '/customer/changecompany',
                                        disabled: false,
                                    },
                                ],
                                headButtons: [
                                    {
                                        label: '下载附件',
                                        operate: 'more-download',
                                        post_url: '',
                                        disabled: true,
                                        click:(xn: XnService, item: any)=>{

                                        }
                                    },
                                    {
                                        label: '原件核销',
                                        operate: 'file-check',
                                        post_url: '',
                                        disabled: true,
                                    },
                                ],
                                rowButtons: [
                                    {
                                        label: '查看文件',
                                        operate: 'view',
                                        post_url: '',
                                        click: (xn: XnService, item: any, vcr: ViewContainerRef) => {
                                            if ([CommonSignStatus.READY_FILED, CommonSignStatus.COMPLETE].includes(Number(item.status))) {
                                                XnModalUtils.openInViewContainer(xn, vcr, DragonMfilesViewModalComponent,
                                                    JsonTransForm(item.signTemplate)).subscribe();
                                            } else {
                                                XnModalUtils.openInViewContainer(xn, vcr, DragonMfilesViewModalComponent,
                                                    JsonTransForm(item.template)).subscribe();

                                            }

                                        }
                                    },
                                    {
                                        label: '查看流程记录',
                                        operate: 'view-progress-record',
                                        post_url: '',
                                        click: (xn: XnService, item: any) => {
                                            xn.router.navigate(['/logan/record/todo/view/' + item.recordId]);
                                        }
                                    },
                                    {
                                        label: '终止',
                                        operate: 'termination',
                                        post_url: '',
                                        click: (xn: XnService, item: any) => {
                                        }
                                    },
                                ]
                            },
                            searches: CfcaSignConfig.Signsearch.searches,
                            headText: CfcaSignConfig.Signsearch.heads,
                        }
                    ],
                    post_url: '/cfca/cfca_sign_list',
                    params: 1
                },
            ]
        } as TabConfigModel
    };
    static getConfig(name) {
        return this.config[name];
    }
}

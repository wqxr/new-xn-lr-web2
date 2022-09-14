import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

export default class CfcaConfig {
    // 二次转让合同模板列表
    static cfcaConfigList = {  // 合同模板列表templateName
        heads: [
            {label: '企业名称', value: 'orgName', type: 'text'},  // templateName
            {label: '合同签署人', value: 'userName', type: 'text'},
            {label: '合同签署手机号', value: 'phone', type: 'signType'},
            {label: '申请时间', value: 'createTime', type: 'date'},
            {label: '数字证书状态', value: 'status', type: 'cfcaStatus'},

        ],
        searches: [
            {
                title: '企业名称',
                checkerId: 'orgName',
                type: 'text',
                required: false,
                number: 1,
            },
            {
                title: '合同签署人',
                checkerId: 'userName',
                type: 'text',
                required: false,
                number: 2,
            },
            {
                title: '合同签署手机号',
                checkerId: 'phone',
                type: 'text',
                required: false,
                number: 3,

            },
            {
                title: '数字证书状态',
                checkerId: 'status',
                type: 'select',
                required: false,
                options: { ref: 'caTypeStatus' },
                number: 4,
            }
        ],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly cfcaconfig = {
        cfcaList: {
            title: 'CFCA数字证书企业列表',
            value: 'do_not',
            tabList: [
                {
                    label: 'CFCA数字证书企业列表',
                    value: 'A',
                    canSearch: true,
                    canChecked: true,
                    searches: CfcaConfig.cfcaConfigList.searches,
                     params: 1,
                    headText: [...CfcaConfig.cfcaConfigList.heads],

                    post_url: '/cfca/list'
                },
            ]
        }
    };
    static getConfig(name) {
        return this.cfcaconfig[name];
    }
}
/***
 *  子标签页，针对采购融资交易列表，根据特定需求修改
 */
export enum SubTabEnum {
    /** 进行中 */
    DOING = '1',
    /** 待还款 */
    TODO = '2',
    /** 已完成 */
    DONE = '3'
}

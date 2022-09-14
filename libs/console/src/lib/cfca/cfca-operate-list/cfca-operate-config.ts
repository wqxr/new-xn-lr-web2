
export default class CfcaOperateConfig {
    static cfcaoperateList = {  // cfca审核列表
        heads: [
            { label: '企业名称', value: 'orgName', type: 'text' },  // templateName
            { label: '审批类型', value: 'type', type: 'reviewType' },
            {
                label: '创建时间', value: 'createTime', type: 'date', _inList: {
                    sort: true,
                    search: true
                }
            },
            { label: '快递单号', value: 'expressNum', type: 'expressNum' },
            { label: '授权文件', value: 'authConfirmationFile', type: 'file' },
            { label: '当前步骤', value: 'status', type: 'step' },
            {
                label: '最后更新时间', value: 'updateTime', type: 'date', _inList: {
                    sort: true,
                    search: true
                },
            },
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
                title: '审批类型',
                checkerId: 'reviewType',
                type: 'select',
                required: false,
                options: { ref: 'cfcaOperateType' },
                number: 2,
            },
            {
                title: '当前步骤',
                checkerId: 'status',
                type: 'select',
                options: { ref: 'cfcaOperate' },
                required: false,
                number: 3,

            },
            {
                title: '最后更新时间',
                checkerId: 'updateTime',
                type: 'quantum1',
                required: false,
                number: 3,

            },
        ],
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly cfcaconfig = {
        cfcaList: {
            title: 'CFCA审核列表',
            value: 'do_not',
            tabList: [
                {
                    label: 'CFCA数字证书企业列表',
                    value: 'A',
                    canSearch: true,
                    canChecked: true,
                    searches: CfcaOperateConfig.cfcaoperateList.searches,
                    params: 1,
                    headText: [...CfcaOperateConfig.cfcaoperateList.heads],

                    post_url: '/cfca/review_list'
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

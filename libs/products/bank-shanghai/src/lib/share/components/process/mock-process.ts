export default class Process {
    static configs = [
        { flowId: 'financing_500', modelId: 'vanke', status: 1, name: '万科供应商保理业务流程', version: 1 },
        { flowId: 'supplier_sign_510', modelId: 'vanke_ht', status: 1, name: '万科供应商保理业务 签署合作协议流程', version: 1 },
        { flowId: 'dragon_financing_pre', modelId: 'dragon', status: 1, name: '龙光地产ABS业务流程', version: 1 },
        { flowId: 'vanke_financing_pre', modelId: 'vanke_abs', status: 1, name: 'ABS业务流程', version: 1 },
        { flowId: 'sh_vanke_financing_pre', modelId: 'vanke_abs_sh', status: 1, name: 'ABS业务流程', version: 1 },
    ];

    /**
     * @description: 获取流程节点配置信息
     * @param {*} flowId
     * @return {*}
     */
    static get(flowId) {
        return Process.configs.filter(item => item.flowId === flowId);
    }

    /**
     * @description: 获取自定义流程节点配置信息
     * @param {*} param
     * @return {*}
     */
    static getCustom(param: { orgType: number, nodeList: any[]} = {orgType: 99, nodeList: []}) {
        let copyNodeList = JSON.parse(JSON.stringify(param.nodeList));
        const insertIndex = copyNodeList.findIndex((x: any) => x.id === 2904);
        const currentNode = param.nodeList.find((x: any) => x.status === 2);
        let finalNodeList = [];
        if (insertIndex > -1){
            finalNodeList = copyNodeList.slice(0, insertIndex + 1).concat({
                id: 2904,
                subList: [{
                    id: 290402,
                    name: '待录入合同',
                    status: !!currentNode && (currentNode.id > 2904) ? 3 : 1,
                    flowId: 'sh_vanke_contract_input'
                }],
                type: 0,
                status: !!currentNode && (currentNode.id > 2904) ? 3 : 1,
            }).concat(copyNodeList.slice(insertIndex + 1, copyNodeList.length));
        } else {
            finalNodeList = copyNodeList;
        }
        const extNodeId = FlowIdList[ExtNode[param.orgType]].filter((x: number) => !(copyNodeList.map((y: any) => y.id).includes(x)));
        finalNodeList = finalNodeList.concat(NodeList.filter((x: any) => extNodeId.includes(x.id)));
        return finalNodeList;
    }
}

/**
 * status: 1未完成节点   2当前节点   3已完成节点
 */
const NodeList = [
    {id: 2901, subList: [{id: 290101, name: '平台预录入', status: 1, flowId: 'sh_vanke_financing_pre'}], type: 0, status: 1},
    {id: 2902, subList: [{id: 290201, name: '待供应商上传资料', status: 1, flowId: 'sh_vanke_financing'}], type: 0, status: 1},
    {id: 2903, subList: [{id: 290301, name: '待平台审核', status: 1, flowId: 'sh_vanke_platform_verify'}], type: 0, status: 1},
    {id: 2904, subList: [{id: 290401, name: '待上银复核', status: 1, flowId: 'sh_vanke_bank_verify'}], type: 0, status: 1},
    {id: 2904, subList: [{id: 290402, name: '待录入合同', status: 1, flowId: 'sh_vanke_contract_input'}], type: 0, status: 1},
    {id: 2905, subList: [{id: 290501, name: '待供应商签署', status: 1, flowId: 'sh_vanke_financing_sign'}], type: 0, status: 1},
    {id: 2906, subList: [{id: 290601, name: '待签署《服务协议》', status: 1, flowId: 'sh_vanke_service_sign'}], type: 0, status: 1},
    {id: 2907, subList: [{id: 290701, name: '待放款审批', status: 1, flowId: 'sh_vanke_bank_loan'}], type: 0, status: 1},
    {id: 2908, subList: [{id: 290801, name: '待提现', status: 1, flowId: 'sh_vanke_financing_loan'}], type: 0, status: 1},
    {id: 2909, subList: [{id: 290901, name: '已提现', status: 1, flowId: 'sh_vanke_loaned'}], type: 0, status: 1},
];

enum ExtNode {
    supplierExt = 1,
    paltExt = 99
}

const FlowIdList = {
    supplierExt: [2905, 2907, 2908],
    paltExt: [2905, 2906, 2907, 2908, 2909 ],
};

import { XnUtils } from "libs/shared/src/lib/common/xn-utils";
import { FlowProcessStatusEnum } from "../../../logic/public-enum";

export enum SOFlowNode {
    So_financing_pre = 'so_financing_pre',
    So_financing = 'so_financing',
    So_platform_verify = 'so_platform_verify',
    So_bank_verify = 'so_bank_verify',
    So_contract_input = 'so_contract_input',
    So_financing_sign = 'so_financing_sign',
    So_service_sign = 'so_service_sign',
    So_bank_loan = 'so_bank_loan',
    So_financing_loan = 'so_financing_loan',
    So_loaned = 'so_loaned',
}

enum ExtNode {
    supplierExt = 1,
    paltExt = 99
}

const FlowIdList = {
    supplierExt: [
        SOFlowNode.So_financing_pre,
        SOFlowNode.So_financing,
        SOFlowNode.So_platform_verify,
        SOFlowNode.So_bank_verify,
        SOFlowNode.So_contract_input,
        SOFlowNode.So_financing_sign,
        SOFlowNode.So_bank_loan,
        SOFlowNode.So_financing_loan
    ],
    paltExt: [
        SOFlowNode.So_financing_pre,
        SOFlowNode.So_financing,
        SOFlowNode.So_platform_verify,
        SOFlowNode.So_bank_verify,
        SOFlowNode.So_contract_input,
        SOFlowNode.So_financing_sign,
        SOFlowNode.So_service_sign,
        SOFlowNode.So_bank_loan,
        SOFlowNode.So_financing_loan,
        SOFlowNode.So_loaned
    ],
};

/**
 * status: 1未完成节点   2当前节点   3已完成节点
 */
const NodeList = [
    { id: 3001, subList: [{ id: 300101, name: '平台预录入', status: 1, flowId: 'so_financing_pre' }], type: 0, status: 1 },
    { id: 3002, subList: [{ id: 300201, name: '待供应商上传资料', status: 1, flowId: 'so_financing' }], type: 0, status: 1 },
    { id: 3003, subList: [{ id: 300301, name: '待平台审核', status: 1, flowId: 'so_platform_verify' }], type: 0, status: 1 },
    { id: 3004, subList: [
        { id: 300401, name: '待上银复核', status: 1, flowId: 'so_bank_verify' },
        // { id: 300402, name: '待录入合同', status: 1, flowId: 'so_contract_input' }
    ], type: 0, status: 1 },
    { id: 3006, subList: [{ id: 300602, name: '待录入合同', status: 1, flowId: 'so_contract_input' }], type: 0, status: 1 },
    { id: 3005, subList: [{ id: 300501, name: '待供应商签署', status: 1, flowId: 'so_financing_sign' }], type: 0, status: 1 },
    { id: 3007, subList: [{ id: 300701, name: '待签署《服务协议》', status: 1, flowId: 'so_service_sign' }], type: 0, status: 1 },
    { id: 3008, subList: [{ id: 300801, name: '待放款审批', status: 1, flowId: 'so_bank_loan' }], type: 0, status: 1 },
    { id: 3009, subList: [{ id: 300901, name: '待提现', status: 1, flowId: 'so_financing_loan' }], type: 0, status: 1 },
    { id: 3010, subList: [{ id: 301001, name: '已提现', status: 1, flowId: 'so_loaned' }], type: 0, status: 1 },
];
export default class Process {
    static configs = [
        { flowId: 'financing_500', modelId: 'vanke', status: 1, name: '万科供应商保理业务流程', version: 1 },
        { flowId: 'supplier_sign_510', modelId: 'vanke_ht', status: 1, name: '万科供应商保理业务 签署合作协议流程', version: 1 },
        { flowId: 'dragon_financing_pre', modelId: 'dragon', status: 1, name: '龙光地产ABS业务流程', version: 1 },
        { flowId: 'vanke_financing_pre', modelId: 'vanke_abs', status: 1, name: 'ABS业务流程', version: 1 },
        { flowId: 'sh_vanke_financing_pre', modelId: 'vanke_abs_sh', status: 1, name: 'ABS业务流程', version: 1 },
        { flowId: 'so_financing_pre', modelId: 'oct_abs_sh', status: 1, name: '华侨城ABS业务流程', version: 1 },
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
    static getCustom(param: { orgType: number, nodeList: any[] } = { orgType: 99, nodeList: [] }) {
        let _finalNodeList: any[] = JSON.parse(JSON.stringify(NodeList)) || [];
        let finalNodeList = _finalNodeList.map((x: any, index: number, arr: any[]) => {
            let _nodeList = param.nodeList?.find((y: any) => String(y.id) === String(x.id)) || {};
            let _subNodeList = param.nodeList?.reduce((prev: any[], current: any) => {
                return prev.concat(current?.subList || []);
            }, []) || [];
            x.status = _nodeList.status || 1;
            x.subList = x.subList?.filter((h: any) => FlowIdList[ExtNode[param.orgType]].includes(h.flowId))?.map((z: any, index: number) => {
                let _status = _nodeList?.subList?.find((v: any) => v.flowId === z.flowId)?.status;
                if(!XnUtils.isEmptys(_status, [0])) {
                    z.status = _status;
                } else if(z.flowId === SOFlowNode.So_contract_input){
                    let _prevNodeStatus = _subNodeList.find((v: any) => v.flowId === SOFlowNode.So_bank_verify)?.status;
                    let _nextNodeStatus = _subNodeList.find((v: any) => v.flowId === SOFlowNode.So_financing_sign)?.status;
                    if([FlowProcessStatusEnum.current].includes(_prevNodeStatus)) {
                        z.status = FlowProcessStatusEnum.disabled;
                    } else if([FlowProcessStatusEnum.success].includes(_prevNodeStatus)) {
                        z.status = [FlowProcessStatusEnum.current, FlowProcessStatusEnum.success].includes(_nextNodeStatus) ?
                            FlowProcessStatusEnum.success : FlowProcessStatusEnum.current;
                    } else {
                        z.status = FlowProcessStatusEnum.disabled;
                    }
                }
                return z;
            }) || [];
            return x;
        }).filter((v: any) => v.subList?.length > 0);
        return finalNodeList;
    }
}

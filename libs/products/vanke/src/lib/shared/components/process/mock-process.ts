export default class Process {
    static configs = [
        { flowId: 'financing_500', modelId: 'vanke', status: 1, name: '万科供应商保理业务流程', version: 1 },
        { flowId: 'supplier_sign_510', modelId: 'vanke_ht', status: 1, name: '万科供应商保理业务 签署合作协议流程', version: 1 },
        { flowId: 'dragon_financing_pre', modelId: 'dragon', status: 1, name: '龙光地产ABS业务流程', version: 1 },
        { flowId: 'vanke_financing_pre', modelId: 'vanke_abs', status: 1, name: 'ABS业务流程', version: 1 },
        { flowId: 'sh_vanke_financing_pre', modelId: 'vanke_abs_sh', status: 1, name: '上海银行业务流程', version: 1 },
        { flowId: 'bgy_financing_pre', modelId: 'bgy_abs', status: 1, name: 'ABS业务流程', version: 1 },
        { flowId: 'oct_financing_pre', modelId: 'oct', status: 1, name: 'ABS业务流程', version: 1 },

    ];

    static get(flowId) {
        return Process.configs.filter(item => item.flowId === flowId);

    }
}

export default class Process {
    static configs = [
        { flowId: 'financing_500', modelId: 'vanke', status: 1, name: '万科供应商保理业务流程', version: 1 },
        { flowId: 'supplier_sign_510', modelId: 'vanke_ht', status: 1, name: '万科供应商保理业务 签署合作协议流程', version: 1 },

    ];

    static get(flowId) {
        return Process.configs.filter(item => item.flowId === flowId);

    }
}

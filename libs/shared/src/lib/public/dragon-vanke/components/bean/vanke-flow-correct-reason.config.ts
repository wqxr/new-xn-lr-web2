// 分步提单平台补正原因
export const correctReason = [
    {
        flowId: 'vanke_abs_step_platform_verify_operate',
        correctList: [
            {
                contractStep: [{
                    label: '补充',
                    value: '补充',
                    children: [
                        { label: '清晰的合同封面页', value: '清晰的合同封面页' },
                        { label: '清晰的合同标的页', value: '清晰的合同标的页' },
                        { label: '清晰的合同金额页', value: '清晰的合同金额页' },
                        { label: '清晰完整的合同价款支付页', value: '清晰完整的合同价款支付页' },
                        { label: '清晰的合同签章页', value: '清晰的合同签章页' },
                        { label: '加盖公章的合同签章页', value: '加盖公章的合同签章页' },
                        { label: '清晰的慧盟平台合同详情截图', value: '清晰的慧盟平台合同详情截图' },
                        { label: '清晰的采筑系统订单详情截图', value: '清晰的采筑系统订单详情截图' },
                        { label: '清晰的集采协议封面页', value: '清晰的集采协议封面页' },
                        { label: '清晰的集采协议签章页', value: '清晰的集采协议签章页' },
                        { label: '清晰的集采协议价款支付页', value: '清晰的集采协议价款支付页' },
                        { label: '清晰的集采协议标的页', value: '清晰的集采协议标的页' },
                        { label: '清晰的授权文件', value: '清晰的授权文件' },
                        { label: '清晰的三方协议', value: '清晰的三方协议' },
                        { label: '清晰的竣工结算造价协议', value: '清晰的竣工结算造价协议' },
                        { label: '清晰的补充协议或是签证', value: '清晰的补充协议或是签证' },
                        { label: '清晰的两个名称的项目为同一项目的证明文件', value: '清晰的两个名称的项目为同一项目的证明文件' },
                        { label: '清晰版加盖公章的合同详情截图清晰彩扫件', value: '清晰版加盖公章的合同详情截图清晰彩扫件' },
                        { label: '清晰版加盖公章的订单详情截图清晰彩扫件', value: '清晰版加盖公章的订单详情截图清晰彩扫件' },

                    ],
                }],
                invoiceStep: [{
                    label: '补充',
                    value: '补充',
                    children: [
                        { label: '万科系统确认的预录入发票', value: '万科系统确认的预录入发票' },
                        { label: '该合同项下其他有余额的发票', value: '该合同项下其他有余额的发票' },
                        { label: '未被其他保理机构或银行转让或质押的清洁发票', value: '未被其他保理机构或银行转让或质押的清洁发票' },
                        { label: '发票第三联', value: '发票第三联' },
                        { label: '加盖清晰监制章、发票专用章的完整发票', value: '加盖清晰监制章、发票专用章的完整发票' },
                        { label: '开票时间不超过一年的发票', value: '开票时间不超过一年的发票' },
                        { label: '开票时间不超过两年的发票', value: '开票时间不超过两年的发票' },
                        { label: '完整的发票', value: '完整的发票' },
                    ],
                },
                {
                    label: '删除',
                    value: '删除',
                    children: [
                        { label: '非预录入发票', value: '非预录入发票' },
                    ],
                }
                ],
                performanceFileStep: [{
                    label: '补充',
                    value: '补充',
                    children: [
                        { label: '清晰的过程产值确认单', value: '清晰的过程产值确认单' },
                        { label: '清晰的付款申请表', value: '清晰的付款申请表' },
                        { label: '清晰的竣工结算造价协议（加盖鲜章）', value: '清晰的竣工结算造价协议（加盖鲜章）' },
                        { label: '清晰的形象进度表（加盖鲜章）', value: '清晰的形象进度表（加盖鲜章）' },
                        { label: '清晰的监理方盖章或是签字的履约文件', value: '清晰的监理方盖章或是签字的履约文件' },
                        { label: '线上付款申请表文件（如无自带电子章需要加盖公章后提供清晰彩扫件）', value: '线上付款申请表文件（如无自带电子章需要加盖公章后提供清晰彩扫件）' },
                    ],
                }],
                otherFileStep: [{
                    label: '补充',
                    value: '补充',
                    children: [
                        { label: '清晰的授权文件', value: '清晰的授权文件' },
                        { label: '清晰的三方协议', value: '清晰的三方协议' },
                        { label: '清晰版两个名称的项目为同一项目的证明文件', value: '清晰版两个名称的项目为同一项目的证明文件' },
                        { label: '清晰的财务报表', value: '清晰的财务报表' },
                        { label: '清晰的营业执照正本', value: '清晰的营业执照正本' },
                        { label: '北京银行确认说明', value: '北京银行确认说明' },
                        { label: '符合资质要求的工程量清单', value: '符合资质要求的工程量清单' },
                        { label: '清晰的盖章版法人身份证扫描件', value: '清晰的盖章版法人身份证扫描件' },
                    ],
                }],
                certificateFileStep: [{
                    label: '补充',
                    value: '补充',
                    children: [
                        { label: '清晰且最新的资质文件', value: '清晰且最新的资质文件' },
                    ],
                }],
            }]
    }
]
export const opinionList = [
    { label: '审核意见', value: 'opinion', input: true,type:'text' },
]
export const allOpinionList = [
    { label: '资料类别', value: 'name', input: false, type: 'text' },
    { label: '审核意见', value: 'opinion', input: true, type: 'opinion' },
]

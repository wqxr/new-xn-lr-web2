export default class AuthConfirmtionFile {
    static common = {
        searches: [
            {
                title: '企业名称',
                checkerId: 'signTime',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                placeholder:'请选择或输入时间，格式20210101',
                sortOrder: 6
            },
            {
                title: '法定代表人姓名',
                checkerId: 'totalReceive',
                required: 0,
                type: 'text',
                options: { readonly: false },
                value: '',
                sortOrder: 9
            },
            {
                title: '管理员姓名',
                checkerId: 'debtUnitName',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 12
            },
            {
                title: '管理员身份证号',
                checkerId: 'debtUnitBank',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 13
            },
            {
                title: '管理员手机号',
                checkerId: 'debtUnitAccount',
                required: 0,
                type: 'text',
                options: { readonly: false },
                value: '',
                sortOrder: 14
            },
            {
                title: '管理员邮箱',
                checkerId: 'debtUnit',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: '',
                sortOrder: 15
            },
            {
                title: 'CA管理员姓名',
                checkerId: 'projectCompany',
                type: 'text',
                required: 0,
                options: { readonly: true },
                value: '',
                sortOrder: 16
            },
            {
                title: 'CA管理员身份证号',
                checkerId: 'receive',
                required: 0,
                type: 'text',
                options: { readonly: true },
                value: '',
                sortOrder: 17
            },

            {
                title: 'CA管理员手机号',
                checkerId: 'contractName',
                type: 'text',
                required: 0,
                options: { readonly: false },
                value: '',
                sortOrder: 1
            },
        ]
    };
}

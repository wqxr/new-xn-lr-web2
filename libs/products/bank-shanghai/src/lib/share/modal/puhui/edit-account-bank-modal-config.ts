import { CheckersOutputModel } from "libs/shared/src/lib/config/checkers";

// 修改对公账号
export const editShowFields: CheckersOutputModel[] = [
  {
    checkerId: "account",
    required: 1,
    type: "text",
    placeholder: '请输入...',
    title: "绑定银行对公账号",
    value: "",
    validators: {
      number: true
    }
  },
  {
    checkerId: "acctBank",
    required: 1,
    type: "dragon-select-search",
    title: "开户银行",
    options: { readonly: false, ref: "acctBank" },
    value: ""
  },
  {
    checkerId: "operatorName",
    required: 1,
    type: "text",
    title: "操作员姓名",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "operatorMobile",
    required: 1,
    type: "text",
    title: "操作员姓名手机号码",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "dynamicCode",
    required: 1,
    type: "text",
    title: "验证码",
    placeholder: '请输入...',
    options: { readonly: false, },
    validators: {
      maxlength: 6
    },
    value: ""
  },
];
// 确认打款信息
export const resultShowFields: CheckersOutputModel[] = [
  {
    checkerId: "account",
    required: 0,
    type: "text",
    title: "绑定银行对公账号",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "acctBank",
    required: 0,
    type: "dragon-select-search",
    title: "开户银行",
    options: { readonly: true, ref: "acctBank" },
    value: ""
  },
  {
    checkerId: "acctNo",
    required: 0,
    type: "text",
    title: "对公在线业务账号",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "acctName",
    required: 0,
    type: "text",
    title: "对公在线业务户名",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "subBranchNo",
    required: 0,
    type: "text",
    title: "开户归属支行号",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "subBranchName",
    required: 0,
    type: "text",
    title: "开户归属支行名称",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "actiAmount",
    required: 0,
    type: "text",
    title: "打款金额",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "actiDeadline",
    required: 0,
    type: "text",
    title: "打款激活最后日期",
    options: { readonly: true },
    value: "",
  },
]
// 重新激活信息
export const reActiveShowFields: CheckersOutputModel[] = [
  {
    checkerId: "modifyBindBankAccountNo",
    required: 0,
    type: "text",
    title: "绑定银行对公账号",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "modifyBindAcctBank",
    required: 0,
    type: "dragon-select-search",
    title: "开户银行",
    options: { readonly: true, ref: "acctBank" },
    value: ""
  },
  {
    checkerId: "acctNo",
    required: 0,
    type: "text",
    title: "对公在线业务账号",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "acctName",
    required: 0,
    type: "text",
    title: "对公在线业务户名",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "subBranchNo",
    required: 0,
    type: "text",
    title: "开户归属支行号",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "subBranchName",
    required: 0,
    type: "text",
    title: "开户归属支行名称",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "modifyBindActiAmount",
    required: 0,
    type: "text",
    title: "打款金额",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "modifyBindActiDeadline",
    required: 0,
    type: "text",
    title: "打款激活最后日期",
    options: { readonly: true },
    value: "",
  },
]


/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\pages\puhui-account-manage\puhui-account-manage-config.ts
* @summary：供应商普惠开户管理详情页面配置文件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-23
***************************************************************************/

import { CheckersOutputModel } from "libs/shared/src/lib/config/checkers";
import { ApplyTypeEnum } from "libs/shared/src/lib/config/enum";

export const electronictAccount: CheckersOutputModel[] = [
  {
    checkerId: "socieBankAccountNo",
    required: 1,
    type: "text",
    title: "绑定银行对公账号",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "socieAcctBank",
    required: 1,
    type: "select",
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

export const showFields: CheckersOutputModel[] = [
  {
    checkerId: "orgName",
    required: 0,
    type: "text",
    title: "企业名称",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "orgCodeNo",
    required: 0,
    type: "text",
    title: "统一社会信用代码",
    options: { readonly: true },
    value: "",
  },
  {
    checkerId: "comDibilityLimit",
    required: 1,
    type: "select",
    title: "企业规模",
    options: { readonly: true, ref: "comDibilityLimit" },
    value: ""
  },
  {
    checkerId: "custType",
    required: 1,
    type: "select",
    title: "企业类别",
    options: { readonly: true, ref: "custType" },
    value: ""
  },
  {
    checkerId: "industry",
    required: 1,
    type: "dragon-cascader-search",
    title: "所在行业",
    options: { readonly: true, ref: "industry" },
    value: ""
  },
  {
    checkerId: "companyImg",
    required: 1,
    type: "nzfile-upload",
    title: "营业执照照片",
    options: {
      readonly: true, filename: "营业执照照片", fileext: "image/jpg,image/jpeg,image/png",
      picSize: 5120, helpMsg: "请上传大小5M以内的JPEG/JPG/PNG格式文件"
    },
    value: ""
  },
  {
    checkerId: "confirmationDate",
    required: 1,
    type: "dragon-nzdate",
    title: "营业执照有效期",
    options: { readonly: true},
    value: ""
  },
  {
    checkerId: "regDist",
    required: 1,
    type: "multip-linkage-select-puhui",
    title: "营业执照注册地址",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "regStrentDoor",
    required: 1,
    type: "text",
    title: "详细注册地址",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "workDist",
    required: 1,
    type: "multip-linkage-select-puhui",
    title: "实际办公地址",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "workStrentDoor",
    required: 1,
    type: "text",
    title: "详细办公地址",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "registCapi",
    required: 1,
    type: "text",
    title: "营业执照注册资本",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "scope",
    required: 1,
    type: "textarea",
    title: "营业执照经营范围",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "shrhldList",
    required: 1,
    type: "shrhldList",
    title: "股东信息",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "bankAccountNo",
    required: 1,
    type: "text",
    title: "绑定银行对公账号",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "acctBank",
    required: 1,
    type: "dragon-select-search",
    title: "开户银行",
    options: { readonly: true, ref: "acctBank" },
    value: ""
  },
  {
    checkerId: "earningOwnerList",
    required: 1,
    type: "earningOwnerList",
    title: "收益人及股东信息",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "appApplyType",
    required: 1,
    type: "radio",
    title: "办理类型",
    options: { readonly: true, ref: "appApplyType" },
    value: ""
  },
  {
    checkerId: "corpName",
    required: 1,
    type: "text",
    title: "法定代表人姓名",
    options: { readonly: true, },
    value: ""
  },
  {
    checkerId: "corpMobile",
    required: 1,
    type: "text",
    title: "法定代表人手机号码",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "legPerId",
    required: 1,
    type: "text",
    title: "法定代表人证件号码",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "corpIdLimitDate",
    required: 1,
    type: "date4",
    title: "法定代表人证件到期日",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "corpIdFrontImg",
    required: 1,
    type: "nzfile-upload",
    title: "法定代表人证件正面图片",
    options: {
      readonly: true, filename: "法定代表人证件正面图片", fileext: "image/jpg,image/jpeg,image/png",
      picSize: 5120, helpMsg: "请上传大小5M以内的JPEG/JPG/PNG格式文件"
    },
    value: ""
  },
  {
    checkerId: "corpIdBackImg",
    required: 1,
    type: "nzfile-upload",
    title: "法定代表人证件反面图片",
    options: {
      readonly: true, filename: "法定代表人证件反面图片", fileext: "image/jpg,image/jpeg,image/png",
      picSize: 5120, helpMsg: "请上传大小5M以内的JPEG/JPG/PNG格式文件"
    },
    value: ""
  },
  {
    checkerId: "corpIdVideo",
    required: 1,
    type: "video-file-input",
    title: "上传法定代表人开户视频",
    options: { readonly: true },
    value: ""
  },
  {
    checkerId: "checkerName",
    required: 1,
    type: "text",
    title: "经办人姓名",
    options: { readonly: true, showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]] },
    value: ""
  },
  {
    checkerId: "checkerMobile",
    required: 1,
    type: "text",
    title: "经办人手机号码",
    options: { readonly: true, showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]] },
    value: ""
  },
  {
    checkerId: "checkerCFCACode",
    required: 1,
    type: "text",
    title: "经办人CFCA验证码",
    options: { readonly: true, showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]] },
    value: ""
  },
  {
    checkerId: "checkerIdCard",
    required: 1,
    type: "text",
    title: "经办人证件号码",
    options: { readonly: true, showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]] },
    value: ""
  },
  {
    checkerId: "checkerIdLimitDate",
    required: 1,
    type: "date4",
    title: "经办人证件到期日",
    options: { readonly: true, showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]] },
    value: ""
  },
  {
    checkerId: "checkerIdFrontImg",
    required: 1,
    type: "nzfile-upload",
    title: "经办人证件正面图片",
    options: {
      readonly: true, filename: "经办人证件正面图片", fileext: "image/jpg,image/jpeg,image/png",
      picSize: 5120, helpMsg: "请上传大小5M以内的JPEG/JPG/PNG格式文件", showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]]
    },
    value: ""
  },
  {
    checkerId: "checkerIdBackImg",
    required: 1,
    type: "nzfile-upload",
    title: "经办人证件反面图片",
    options: {
      readonly: true, filename: "经办人证件反面图片", fileext: "image/jpg,image/jpeg,image/png",
      picSize: 5120, helpMsg: "请上传大小5M以内的JPEG/JPG/PNG格式文件", showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]]
    },
    value: ""
  },
  {
    checkerId: "delegationImg",
    required: 1,
    type: "file",
    title: "企业授权书",
    options: {
      readonly: true, fileext: "jpg, jpeg, png, pdf", picSize: 500, showWhen: ["appApplyType", [ApplyTypeEnum.MANAGER]]
    },
    value: ""
  },
  ...electronictAccount
]






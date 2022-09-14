/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\console\src\lib\pages\register-company\register-company-detail\register-company-detail-config.ts
* @summary：注册企业详情页面table相关配置
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-06-21
***************************************************************************/
import { Column } from '@lr/ngx-table';



export default class CompanyDetailConfigList {
  //产品信息
  static productInfoColumn = [
    { title: '产品名称', index: 'name', width: 260, },
    { title: '创建时间', index: 'createTime', render: 'dateTimeTpl', width: 260, },
    { title: '企业角色', index: 'orgType', render: 'orgTypeTpl', width: 260, },
  ] as Column[];
  //数字证书信息
  static caInfoColumn = [
    { title: '证书类型', index: 'certType', render: 'certTypeTpl' , width: 260,},
    { title: 'CA数字证书管理员', index: 'certUserName', width: 260, },
    { title: '身份证号', index: 'certUserCardNo', width: 260, },
    { title: '手机号', index: 'certUserMobile', width: 260, },
  ] as Column[];
  //企业曾用名
  static originalNameColumn = [
    { title: '用户姓名', index: 'name', width: 260, },
    { title: '创建时间', index: 'date', render: 'dateTimeTpl', width: 260, },
  ] as Column[];
  //用户信息
  static userInfoColumn = [
    { title: '用户姓名', index: 'userName', width: 260, },
    { title: '用户ID', index: 'userId', width: 260, },
    { title: '证件类型', index: 'cardType' , width: 260,},
    { title: '身份证号', index: 'cardNo', width: 260, },
    { title: '手机号', index: 'mobile', width: 260, },
    { title: '邮箱', index: 'email' , width: 260,},
    { title: '用户角色', index: 'userRoleList', render: 'userRoleTpl' , width: 260,},
  ] as Column[];
   // 资质文件信息
   static certifyInfoColumn = [
    { title: '资质内容', index: 'certify_file',render:'files', width: 260, },
    { title: '文件状态', index: 'status', width: 180, },
    { title: '证书编号', index: 'certify_code' , width: 180,},
    { title: '发证日期', index: 'certify_date', width: 180, render: 'dateTimeTpl',},
    { title: '有效期', index: 'certify_indate', width: 180,render: 'dateTimeTpl', },
    { title: '资质类别及等级', index: 'certifyClasseList' , width: 200,render:'certifyList'},
    { title: '操作', index: 'operate', render: 'operate' , width: 280,},
  ] as Column[];
}

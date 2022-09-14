import { ListHeadsFieldOutputModel, TabConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import CommBase from '../pages/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：IndexTabConfig
 * @summary：
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wq                 上传付款确认书列表        2019-09-19
 * **********************************************************************
 */



export default class DragonpaymentTabConfig {
    // 交易列表 -采购融资，默认配置
    static dragonapprovalLists = {
        heads: [
            { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', },
            { label: '申请付款单位', value: 'projectCompany' },
            { label: '收款单位', value: 'debtUnit', },
            { label: '总部公司', value: 'headquarters', },
            { label: '资产池名称', value: 'capitalPoolName', },
            { label: '合同编号', value: 'contractId', },
            { label: '应收账款金额', value: 'receive', type: 'receive', },
            { label: '提单日期', value: 'createTime', type: 'date', },
            { label: '起息日', value: 'valueDate', type: 'date', },
            { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', },
        ] as ListHeadsFieldOutputModel[],
        searches: [
            { title: '资产池名称', checkerId: 'capitalPoolName', type: 'text', required: false, sortOrder: 1 },
            { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 2 },
            { title: '付款确认书编号', checkerId: 'payConfirmId', type: 'text', required: false, sortOrder: 5 },
            { title: '申请付款单位', checkerId: 'projectCompany', type: 'text', required: false, sortOrder: 6 },
            { title: '收款单位', checkerId: 'debtUnit', type: 'text', required: false, sortOrder: 4 },
            { title: '应收账款金额', checkerId: 'receive', type: 'text', required: false, sortOrder: 7 },
            { title: '提单日期', checkerId: 'preDate', type: 'quantum1', required: false, sortOrder: 8 },
            { title: '保理融资到期日', checkerId: 'factoringEndDate', type: 'quantum1', required: false, sortOrder: 3 },
        ] as CheckersOutputModel[]


    };
    static personMatch = {
        万科企业股份有限公司: {
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
                { label: '付款确认书编号', value: 'payConfirmId', type: 'text', width: '10%' },
                { label: '收款单位', value: 'debtUnit', width: '10%' },
                { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
                { label: '收款单位开户行', value: 'debtUnitBank', width: '10%' },
                { label: '应收账款金额', value: 'receive', width: '5%' },
                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
                { label: '付款确认书影印件', value: 'pdfProjectFiles', type: 'file', width: '10%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
        雅居乐集团控股有限公司: { // 雅居乐集团控股有限公司 - 《付款确认书（总部致供应商）》
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
                { label: '付款确认书编号（总部致供应商）', value: 'payConfirmId', type: 'text', width: '10%' },
                { label: '收款单位', value: 'debtUnit', width: '10%' },
                { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
                { label: '收款单位开户行', value: 'debtUnitBank', width: '10%' },
                { label: '应收账款金额', value: 'receive', width: '5%' },
                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
                { label: '付款确认书影印件（总部致供应商）', value: 'pdfProjectFiles', type: 'file', width: '10%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
        深圳市龙光控股有限公司: { // 深圳市龙光控股有限公司 - 《付款确认书（总部致管理人）》、《付款确认书（总部致券商）》
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
                { label: '付款确认书（总部致管理人）合同编号', value: 'codeFactoringPayConfirm', type: 'text', width: '10%' },
                { label: '付款确认书（总部致券商）合同编号', value: 'codeBrokerPayConfirm', type: 'text', width: '10%' },
                { label: '收款单位', value: 'debtUnit', width: '10%' },
                { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
                { label: '收款单位开户行', value: 'debtUnitBank', width: '10%' },
                { label: '应收账款金额', value: 'receive', width: '5%' },
                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
                { label: '付款确认书（总部致管理人）影印件', value: 'factoringPayConfirmYyj', type: 'file', width: '10%' },
                { label: '付款确认书（总部致券商）影印件', value: 'brokerPayConfirmYyj', type: 'file', width: '10%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
        龙光工程建设有限公司: {
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
                { label: '付款确认书（总部致管理人）合同编号', value: 'codeFactoringPayConfirm', type: 'text', width: '10%' },
                { label: '付款确认书（总部致券商）合同编号', value: 'codeBrokerPayConfirm', type: 'text', width: '10%' },
                { label: '收款单位', value: 'debtUnit', width: '10%' },
                { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
                { label: '收款单位开户行', value: 'debtUnitBank', width: '10%' },
                { label: '应收账款金额', value: 'receive', width: '5%' },
                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
                { label: '付款确认书（总部致管理人）影印件', value: 'factoringPayConfirmYyj', type: 'file', width: '10%' },
                { label: '付款确认书（总部致券商）影印件', value: 'brokerPayConfirmYyj', type: 'file', width: '10%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        }
    };
    static replaceFile = {
        万科企业股份有限公司: {
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
                { label: '付款确认书编号', value: 'payConfirmId', type: 'text', width: '10%' },
                { label: '总部公司', value: 'headquarters', type: 'text', width: '5%' },
                { label: '收款单位', value: 'debtUnit', width: '10%' },
                { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
                { label: '收款单位开户行', value: 'debtUnitBank', width: '10%' },
                { label: '应收账款金额', value: 'receive', width: '5%' },
                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
                { label: '付款确认书影印件', value: 'pdfProjectFiles', type: 'file', width: '10%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
        雅居乐集团控股有限公司: { // 雅居乐集团控股有限公司 - 《付款确认书（总部致供应商）》
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
                { label: '付款确认书编号（总部致供应商）', value: 'payConfirmId', type: 'text', width: '10%' },
                { label: '总部公司', value: 'headquarters', type: 'text', width: '5%' },
                { label: '收款单位', value: 'debtUnit', width: '10%' },
                { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
                { label: '收款单位开户行', value: 'debtUnitBank', width: '10%' },
                { label: '应收账款金额', value: 'receive', width: '5%' },
                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
                { label: '付款确认书影印件（总部致供应商）', value: 'pdfProjectFiles', type: 'file', width: '10%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
        深圳市龙光控股有限公司: { // 深圳市龙光控股有限公司 - 《付款确认书（总部致管理人）》、《付款确认书（总部致券商）》
            heads: [
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '14%' },
                { label: '付款确认书（总部致管理人）合同编号', value: 'codeFactoringPayConfirm', type: 'text', width: '10%' },
                { label: '付款确认书（总部致券商）合同编号', value: 'codeBrokerPayConfirm', type: 'text', width: '10%' },
                { label: '总部公司', value: 'headquarters', type: 'text', width: '5%' },
                { label: '收款单位', value: 'debtUnit', width: '10%' },
                { label: '收款单位账号', value: 'debtUnitAccount', width: '5%' },
                { label: '收款单位开户行', value: 'debtUnitBank', width: '5%' },
                { label: '应收账款金额', value: 'receive', width: '5%' },
                { label: '保理融资到期日', value: 'factoringEndDate', type: 'date', width: '5%' },
                { label: '付款确认书（总部致管理人）影印件', value: 'factoringPayConfirmYyj', type: 'file', width: '10%' },
                { label: '付款确认书（总部致券商）影印件', value: 'brokerPayConfirmYyj', type: 'file', width: '10%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
    };

    // 系统匹配
    static systemMatch = {
        /**
         * 应收账款转让通知书编号、供应商名称。供应商银行账号、开户行、币种、应收账款金额、账款到期日、款项性质、备注。
         */
        vanke: {  // 万科企业股份有限公司 - 《付款确认书》
            heads: [
                { label: '文件名', value: 'files', type: 'file', width: '10%' },

                { label: '供应商名称', value: 'debtUnit', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '开户行', value: 'debtUnitBank', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '供应商银行账号', value: 'debtUnitAccount', type: 'text', width: '10%', _inList: { sort: true, search: true } },
                { label: '币种', value: 'currency', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '应收账款金额', value: 'receive', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '账款到期日', value: 'factoringEndDate', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '款项性质', value: 'sumProperties', type: 'text', width: '6%' },
                { label: '应收账款转让通知书编号', value: 'contractNum', type: 'text', width: '10%', _inList: { sort: true, search: true } },
                { label: '备注', value: 'desc', type: 'text', width: '6%' },

                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '12%', _inList: { sort: true, search: true } },
                { label: '匹配结果', value: 'isMatching', type: 'result', width: '4%', _inList: { sort: true, search: true } }
            ] as ListHeadsFieldOutputModel[],
        },
        yjl1: { // 雅居乐集团控股有限公司 - 《付款确认书（总部致供应商）》
            /**
             * 债权人（供应商）、基础交易合同名称、基础交易合同编号、雅居乐下属公司、发票编号、发票金额、应收账款金额、应收账款债权到期日
             */
            heads: [
                { label: '文件名', value: 'files', type: 'file', width: '10%' },

                { label: '债权人（供应商）', value: 'debtUnit', type: 'text', width: '10%' },
                { label: '基础交易合同名称', value: 'contractName', type: 'text', width: '10%' },
                { label: '基础交易合同编号', value: 'contractId', type: 'text', width: '10%' },
                { label: '雅居乐下属公司', value: 'subCompany', type: 'text', width: '10%' },
                { label: '发票编号', value: 'invoiceNum', type: 'text' },
                { label: '发票金额', value: 'invoiceAmount', type: 'text' },
                { label: '应收账款金额', value: 'receive', type: 'text' },
                { label: '应收账款债权到期日', value: 'expiryTime', type: 'date' },

                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '19%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
        yjl2: { // 雅居乐集团控股有限公司 - 《付款确认书（项目公司致供应商）》
            heads: [
                { label: '文件名', value: 'files', type: 'file', width: '10%' },

                { label: '债权人（供应商）', value: 'debtUnit', type: 'text', width: '10%' },
                { label: '基础交易合同名称', value: 'contractName', type: 'text', width: '10%' },
                { label: '基础交易合同编号', value: 'contractId', type: 'text', width: '10%' },
                { label: '雅居乐下属公司', value: 'subCompany', type: 'text', width: '10%' },
                { label: '发票编号', value: 'invoiceNum', type: 'text' },
                { label: '发票金额', value: 'invoiceAmount', type: 'text' },
                { label: '应收账款金额', value: 'receive', type: 'text' },
                { label: '应收账款债权到期日', value: 'expiryTime', type: 'date' },

                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '19%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        },
        dragon1: { // 深圳市龙光控股有限公司 - 《付款确认书（总部致管理人）》
            /**
             * 项目公司、供应商名称、基础交易合同名称、基础交易合同编号、发票编号、发票金额、应收账款金额、应收账款到期日 、应收账款转让通知书编号
             */
            heads: [
                { label: '文件名', value: 'files', type: 'file', width: '10%' },

                { label: '项目公司', value: 'projectCompany', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '供应商名称', value: 'debtUnit', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '基础交易合同名称', value: 'contractName', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '基础交易合同编号', value: 'contractId', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '发票编号', value: 'invoiceNum', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '发票金额', value: 'invoice', type: 'invoice', width: '10%' },
                { label: '应收账款金额', value: 'receive', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '应收账款债权到期日', value: 'factoringEndDate', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '应收账款转让通知书编号', value: 'contractNum', type: 'text', width: '10%', _inList: { sort: true, search: true } },

                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '12%', _inList: { sort: true, search: true } },
                { label: '匹配结果', value: 'isMatching', type: 'result', width: '4%', _inList: { sort: true, search: true } }
            ] as ListHeadsFieldOutputModel[],
        },
        dragon2: {  // 深圳市龙光控股有限公司 - 《付款确认书（总部致券商）》
            /**
             * 保理合同/应收账款转让协议书编号 、项目公司（债务人）、总包/供应商名称（债权人）、商务合同名称、发票编号、发票金额（元）、标的应收账款金额（元）、应收账款到期日
             */
            heads: [
                { label: '文件名', value: 'files', type: 'file', width: '10%' },

                { label: '项目公司（债务人）', value: 'projectCompany', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '总包/供应商名称（债权人）', value: 'debtUnit', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '商务合同名称', value: 'contractName', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '发票编号', value: 'invoiceNum', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '发票金额（元）', value: 'invoice', type: 'invoice', width: '10%' },
                { label: '标的应收账款金额（元）', value: 'receive', type: 'text', width: '8%', _inList: { sort: true, search: true } },
                { label: '应收账款债权到期日', value: 'factoringEndDate', type: 'text', width: '6%', _inList: { sort: true, search: true } },
                { label: '保理合同/应收账款转让协议书编号', value: 'contractNum', type: 'text', width: '10%', _inList: { sort: true, search: true } },

                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '12%', _inList: { sort: true, search: true } },
                { label: '匹配结果', value: 'isMatching', type: 'result', width: '4%', _inList: { sort: true, search: true } }
            ] as ListHeadsFieldOutputModel[],
        },
        default: {
            heads: [
                { label: '文件名', value: 'fileName', type: 'file', width: '49%' },
                { label: '交易ID', value: 'mainFlowId', type: 'mainFlowId', width: '40%' },
                { label: '匹配结果', value: 'flag', type: 'result', width: '4%' }
            ] as ListHeadsFieldOutputModel[],
        }
    };
    // ocr模态框checker
    static ocrConfig = {
        vanke: {
            checkers: [
                {
                    title: '供应商名称:', checkerId: 'debtUnit', type: 'text',
                    required: false, options: {}, value: '',
                },
                {
                    title: '开户行:', checkerId: 'debtUnitBank', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '供应商银行账号:', checkerId: 'debtUnitAccount', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '币种:', checkerId: 'currency', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款金额:', checkerId: 'receive', type: 'money',
                    required: false, options: {}, value: ''
                },
                {
                    title: '账款到期日:', checkerId: 'factoringEndDate', type: 'date',
                    required: false, options: {}, value: ''
                },
                {
                    title: '款项性质:', checkerId: 'sumProperties', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款转让通知书编号:', checkerId: 'contractNum', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '备注:', checkerId: 'desc', type: 'text',
                    required: false, options: {}, value: ''
                },
            ] as CheckersOutputModel[],
        },
        yjl1: {
            // todo
            checkers: [
                {
                    title: '供应商名称:', checkerId: 'debtUnit', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '开户行:', checkerId: 'debtUnitBank', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '供应商银行账号:', checkerId: 'debtUnitAccount', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '币种:', checkerId: 'currency', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款金额:', checkerId: 'receive', type: 'money',
                    required: false, options: {}, value: ''
                },
                {
                    title: '账款到期日:', checkerId: 'factoringEndDate', type: 'date',
                    required: false, options: {}, value: ''
                },
                {
                    title: '款项性质:', checkerId: 'sumProperties', type: 'date',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款转让通知书编号:', checkerId: 'contractNum', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '备注:', checkerId: 'desc', type: 'text',
                    required: false, options: {}, value: ''
                },
            ] as CheckersOutputModel[],
        },
        yjl2: {
            // todo
            checkers: [
                {
                    title: '供应商名称:', checkerId: 'debtUnit', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '开户行:', checkerId: 'debtUnitBank', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '供应商银行账号:', checkerId: 'debtUnitAccount', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '币种:', checkerId: 'currency', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款金额:', checkerId: 'receive', type: 'money',
                    required: false, options: {}, value: ''
                },
                {
                    title: '账款到期日:', checkerId: 'factoringEndDate', type: 'date',
                    required: false, options: {}, value: ''
                },
                {
                    title: '款项性质:', checkerId: 'sumProperties', type: 'date',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款转让通知书编号:', checkerId: 'contractNum', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '备注:', checkerId: 'desc', type: 'text',
                    required: false, options: {}, value: ''
                },
            ] as CheckersOutputModel[],
        },
        dragon1: {
            checkers: [
                {
                    title: '项目公司:', checkerId: 'projectCompany', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '供应商名称:', checkerId: 'debtUnit', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '基础交易合同名称:', checkerId: 'contractName', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '基础交易合同编号:', checkerId: 'contractId', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '发票编号:', checkerId: 'invoiceNum', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '发票金额:', checkerId: 'invoice', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款金额:', checkerId: 'receive', type: 'money',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款债权到期日:', checkerId: 'factoringEndDate', type: 'date',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款转让通知书编号:', checkerId: 'contractNum', type: 'text',
                    required: false, options: {}, value: ''
                },
            ] as CheckersOutputModel[],
        },
        dragon2: {
            checkers: [
                {
                    title: '项目公司（债务人）:', checkerId: 'projectCompany', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '总包/供应商名称（债权人）:', checkerId: 'debtUnit', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '商务合同名称:', checkerId: 'contractName', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '发票编号:', checkerId: 'invoiceNum', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '发票金额（元）:', checkerId: 'invoice', type: 'text',
                    required: false, options: {}, value: ''
                },
                {
                    title: '标的应收账款金额（元）:', checkerId: 'receive', type: 'money',
                    required: false, options: {}, value: ''
                },
                {
                    title: '应收账款债权到期日:', checkerId: 'factoringEndDate', type: 'date',
                    required: false, options: {}, value: ''
                },
                {
                    title: '保理合同/应收账款转让协议书编号:', checkerId: 'contractNum', type: 'text',
                    required: false, options: {}, value: ''
                }
            ] as CheckersOutputModel[],
        }
    };
    // 多标签页，A,B,C,D,E,F......
    static readonly config = {
        dragon: {
            title: '上传付款确认书-龙光-博时资本',
            value: 'upload_qrs',
            tabList: [
                {
                    label: '',
                    value: 'A',
                    subTabList: [
                        {
                            label: '未上传',
                            value: 'DOING',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '人工匹配付款确认书',
                                        operate: 'person_match_qrs',
                                        post_url: '/customer/changecompany',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'financeOperator' || x === 'financeReviewer';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/pslogan/record/new/`],
                                                    {
                                                        queryParams: {
                                                            id: 'sub_person_match_qrs',
                                                            relate: 'mainIds',
                                                            relateValue: params,
                                                        }
                                                    });
                                            }
                                        },

                                    },
                                ],
                                rowButtons: [
                                ]
                            },
                            searches: DragonpaymentTabConfig.dragonapprovalLists.searches,
                            params: 0,
                            headText: [...DragonpaymentTabConfig.dragonapprovalLists.heads,
                            { label: '付款确认书（总部致管理人）影印件', value: 'factoringPayConfirmYyj', type: 'file' },
                            { label: '付款确认书（总部致管理人）合同编号', value: 'codeFactoringPayConfirm', type: 'text', },
                            ],
                        },
                        {
                            label: '已上传',
                            value: 'TODO',
                            canSearch: true,
                            canChecked: true,
                            edit: {
                                headButtons: [
                                    {
                                        label: '替换付款确认书',
                                        operate: 'replace_qrs',
                                        post_url: '/customer/changecompany',
                                        disabled: false,
                                        click: (xn: XnService, params) => {
                                            const rolesArr = xn.user.roles.filter((x) => {
                                                return x === 'financeOperator' || x === 'financeReviewer';
                                            });
                                            if (!(rolesArr && rolesArr.length)) {
                                                xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
                                            } else {
                                                xn.router.navigate([`/pslogan/record/new/`],
                                                    {
                                                        queryParams: {
                                                            id: 'sub_replace_qrs',
                                                            relate: 'mainIds',
                                                            relateValue: params,
                                                        }
                                                    });
                                            }
                                        },
                                    },
                                ],
                                rowButtons: []
                            },
                            params: 1,
                            searches: DragonpaymentTabConfig.dragonapprovalLists.searches,
                            headText: [...DragonpaymentTabConfig.dragonapprovalLists.heads,
                            { label: '付款确认书（总部致管理人）影印件', value: 'factoringPayConfirmYyj', type: 'file' },
                            { label: '付款确认书（总部致管理人）合同编号', value: 'codeFactoringPayConfirm', type: 'text', },
                            { label: '付确匹配方式', value: 'qrsMatchMethod', type: 'qrsMatchMethod', }
                            ],
                        },
                    ],
                    post_url: '/upload_qrs/list'
                },
            ]
        } as TabConfigModel,
    };

    static getConfig(name) {
        return this.config[name];
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

/***
 * 在数组特定位置插入元素
 * @param array 原数组
 * @param positionKeyWord 参考关键字
 * @param ele 插入元素
 * @param position 相对于参考元素位置 after | before
 */
function arraySplice(array: ListHeadsFieldOutputModel[], ele: ListHeadsFieldOutputModel,
    positionKeyWord: string, position: string) {
    const findIndex = array.findIndex(find => find.value === positionKeyWord);
    const idx = position === 'before' ? findIndex : findIndex + 1;
    array.splice(idx, 0, ele);
    return array;
}

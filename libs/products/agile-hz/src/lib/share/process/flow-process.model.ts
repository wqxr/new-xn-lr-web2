/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：flow-process.model.ts
 * @summary：流程字段数据结构
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新建                2019-05-19
 * **********************************************************************
 */

/**
 *  基础字段
 */
export class BaseOutputModel {
    /** 版本 */
    public version?: number;
    /** 子节点是否有顺序 */
    public sorted?: boolean;
    /** 顺序前后 0 | 1 | 2 |  3 */
    public sorting?: number;
    /** 当前步骤状态 3:已完成，2 进行中，0：未开始 */
    public status: number;
}

/**
 * 主流程数据结构
 */
export class FlowProcessOutputModel {
    /** 业务模式   */
    public type: string;
    /** 流程节点 */
    public nodeList: FlowProcessNodeOutputModel[];
    public modelId: string;
    public mainFlowId: string;
}

/**
 *  流程节点
 */
export class FlowProcessNodeOutputModel extends BaseOutputModel {
    /** 节点id */
    public id: string;
    /** 子节点 */
    public subList: FlowProcessSubNodeOutputModel[];
}

/**
 * 子节点流程
 */
export class FlowProcessSubNodeOutputModel extends BaseOutputModel {
    /** 子节点id */
    public id: string;
    /** 子节点名称 */
    public name: string;
    /** 子节点flowId */
    public flowId?: string;
    public status: number;
}

/**
 *  链表节点
//  */
// export class FlowProcessLinkOutputModel extends BaseOutputModel {
//     /** 链节点id */
//     public linkId: string;
//     /** 连接点名称 */
//     public linkName: string;
// }

/**
 *  将获得的流程配置，前端输出格式
 */
export class LocalFlowProcessModel extends BaseOutputModel {
    /** 节点id */
    public id: string;
    /** 子节点 */
    public subList: FlowProcessSubNodeOutputModel[];
}
// // 》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》
// export class ProcessInfoSublistOutputModel {
//     /** 流程flowId */
//     public id: string;
//     /** 流程名称 */
//     public name: string;
//     /** 流程状态 */
//     public status: string;

// }

// export class ProcessInfoOutputModel {
//     /** 流程节点id */
//     public id: number;
//     /** 节点子流程 */
//     public sublist: ProcessInfoSublistOutputModel[];
//     /** 节点子流程是否并列进行 */
//     public type: number;
// }

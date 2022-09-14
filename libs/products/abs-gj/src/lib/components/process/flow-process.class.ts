/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\process\flow-process.model.ts
 * @summary：flow-process.model.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-23
 ***************************************************************************/

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
 *  将获得的流程配置，前端输出格式
 */
export class LocalFlowProcessModel extends BaseOutputModel {
  /** 节点id */
  public id: string;
  /** 子节点 */
  public subList: FlowProcessSubNodeOutputModel[];
}

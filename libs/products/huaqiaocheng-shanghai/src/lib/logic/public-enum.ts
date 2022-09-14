/** 流程进行状态: 此处键success|current|disabled|noway对应流程节点的状态class，故用小写*/
export enum FlowProcessStatusEnum {
    /** 已完成 = 3 */
    success = 3,
    /** 进行中 =2 */
    current = 2 || 99,
    /** 未开时 =1 */
    disabled = 1,
    /** 无效 */
    noway = 0,
}

/** 生成付确类型 */
export enum QRSInterfaceType {
    HeadquartersQrs = '/shanghai_bank/so_general/createGroupPayConfirm',
    ProjectcompanyQrs = '/shanghai_bank/so_general/createPrjPayConfirm',
}

/** 生成付确类型 */
export const SoCustomSearch = {
    reviewList: [78, 77]
}

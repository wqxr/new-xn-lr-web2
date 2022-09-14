/** 流程进行状态 */
export enum FlowProcessStatusEnum {
    /** 已完成 = 3 */
    success = 3,
    /** 进行中 =2 */
    current = 2 || 99,
    /** 未开时 =0 */
    disabled = 1,
    /**wuxiao */
    noway = 0,
}
/** unused*/
export interface Model {
    name: string;
    age: string;
}

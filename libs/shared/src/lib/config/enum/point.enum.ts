/**
 * 端类型
 */
 export enum RequestType {
	/** web端 */
	PC = 1,
	/** 小程序端 */
	WX = 2,
}
/**
 * 产品类型
 */
export enum ProductType {
	/**
	 * 保理通
	 */
	Factoring = 2,
	/**
	 * 保函通
	 */
	Guarantee = 5,
}

/** 埋点-保理PC按钮类型 */
export enum ViewButtonType {
	/** 用户登录按键 */
	UserLogin = 'BL-PC-login',
	/** 用户注册按键 */
	UserRegistry = 'BL-PC-registry',
    /** 业务资料上传（初审）功能按键 */
	UploadDataOperate = 'BL-PC-upload-data-operate',
	/** 业务资料上传（复审）功能按键 */
	UploadDataReview = 'BL-PC-upload-data-review',
	/** 合同签署功能按键（初审） */
	SignContractOperate = 'BL-PC-sign-contract-operate',
	/** 合同签署功能按键（复审）*/
	SignContractReview = 'BL-PC-sign-contract-review',
}

/** 埋点-操作状态 */
export enum OperatoState {
	/** 操作失败 */
	Fail = 0,
	/** 操作成功 */
	Success = 1,
}
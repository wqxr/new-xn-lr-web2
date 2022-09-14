/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：list-config-model.ts
 * @summary：交易列表数据结构模型
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan             新增         2019-05-27
 * **********************************************************************
 */

import { FormlyFieldConfig } from '@lr/ngx-formly';
import { CheckersOutputModel } from './checkers';

/***
 * 交易列表表头显示字段，及字段配置
 */
export class ListHeadsFieldOutputModel {
    /** 字段名称 */
    public label: string;
    /** 字段id */
    public value: string;
    /** dom中根据type 的类型对文件进行不同处理，达到特定显示 */
    public type: string;
    /** 列表列是否可排序 */
    public sort?: boolean;
    public _inList?: Issort;
    public width?: string;
    public show?: boolean;

}

/**
 *  按钮组参数字段
 */
export class ButtonConfigModel {
    /** 按钮标题 */
    public label: string;
    /** 操作行为 */
    public operate: string;
    /** 操作api */
    public post_url?: string;
    /** 是否禁用 */
    public disabled?: boolean;
    /** 某些条件下是否显示按钮 */
    public showButton?: boolean;
    /** 其他配置 */
    public options?: ButtonConfigModel;
    /** 子按钮，适用于下拉按钮显示更多按钮 */
    public children?: ButtonConfigModel[];
    /** 是否只读 */
    public readonly?: number[];
    /** 适用中介机构集合 */
    agencyTypeList?: number[];
    /** 层级 0，1,2，... */
    level?: number;
    /** 是否可点击 */
    public click?: any;
    public flag?: number;
    public color?: string;
    public danger?: boolean;
}

/**
 *  列表编辑
 */
export class ListButtonEditModel {
    /** 表头操作 */
    headButtons?: ButtonConfigModel[];
    /** 左侧表头按钮 */
    leftheadButtons?: ButtonConfigModel[];
    /** 右侧表头按钮 */
    rightheadButtons?: ButtonConfigModel[];
    /** 行内操作 */
    rowButtons?: ButtonConfigModel[];
}

/**
 *  子标签页
 */
export class SubTabListOutputModel {
    /** 标签名 */
    public label: string;
    /** 标签值 */
    public value: string;
    /** 表单操作 */
    public edit?: ListButtonEditModel;
    /** 是否可搜索 */
    public canSearch?: boolean;
    /** 是否可选 */
    public canChecked?: boolean;
    /** 搜索项 */
    public searches?: CheckersOutputModel[];
    /** 表头*/
    public headText?: ListHeadsFieldOutputModel[];
    /** 表格内容控制 */
    public tableContent?: TableContent;
    /** 适用中介机构集合 */
    agencyTypeList?: number[];
    /** 层级 0，1,2，... */
    level?: number;

    public count?: number;
    public params?: number;
    public searchNumber?: number;
    public headNumber?: number;
    public showFields?: FormlyFieldConfig[];
}

/**
 * 表格内容权限控制
 */
export class TableContent {
    /** 内容只读 */
    public readonly?: string[];
}

export class Issort {
    public sort: boolean;
    public search: boolean;
}

/***
 *  标签页
 */
export class TabListOutputModel {
    /** 标签名 */
    public label: string;
    /** 标签值 */
    public value: string;
    /** 子标签 */
    public subTabList?: SubTabListOutputModel[];
    /** 列表请求api */
    public post_url?: string;
    /** 列表请求入参 */
    public params?: number;
    /** 适用中介机构集合 */
    agencyTypeList?: number[];
    /** 层级 0，1,2，... */
    level?: number;
}

/**
 *  交易列表
 */
export class TabConfigModel {
    /** 列表名称 */
    public title: string;
    /** 列表一级tab页 */
    public tabList: TabListOutputModel[];
    /** 列表标识 */
    public value?: string;
    /** 是否隐藏列表标题 */
    public hideTitle?: boolean;
    /** 适用中介机构集合 */
    agencyTypeList?: number[];
    /** 层级 0，1,2，... */
    level?: number;
}

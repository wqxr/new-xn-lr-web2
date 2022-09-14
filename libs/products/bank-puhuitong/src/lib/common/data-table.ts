/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AvengerDataTable
 * @summary：thinkjs 3.0 不支持2.0 时的method 方法
 *  DataTableUtils.buildAvengerUrl(this.config, 'getRecord'));
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import { isNullOrUndefined } from 'util';


import { Tables } from 'libs/shared/src/lib/config/tables';
import { DataTableUtils } from 'libs/shared/src/lib/common/data-table-utils';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


export class BankDataTable {
    protected options: any;
    protected config: any;

    protected editor: any;
    protected table: any;

    protected isViewAction: boolean;
    protected isShowViewButton: boolean; // 实现在DataTable中显示查看按钮
    protected isCreateEditor: boolean; // 是否创建Editor

    constructor(protected xn: XnService, protected eid: string, confName: string, options?: any) {
        this.options = options || {};

        this.config = $.extend(true, {}, Tables.getConfig(confName));
        this.calcByConfig();
        this.build();
    }

    get datatable() {
        return this.table;
    }

    destroy() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
        if (this.table) {
            this.table.destroy();
            this.table = null;
        }
    }

    protected calcByConfig(): void {
        // 计算isShowViewButton
        do {
            if (this.config.allowDelete || this.config.allowUpdate) {
                this.isShowViewButton = true;
                break;
            }

            for (const field of this.config.fields) {
                // 不在DataTable中显示，那肯定就在Editor里显示
                if (field.inColumn === false) {
                    this.isShowViewButton = true;
                    break;
                }
            }

            this.isShowViewButton = false;
        } while (false);

        this.isCreateEditor = this.config.allowCreate || this.config.allowUpdate
            || this.config.allowDelete || this.isShowViewButton || true;

        // 把options.where中的字段从config里去掉
        if (this.options.where) {
            for (const key in this.options.where) {
                this.config.fields = $.grep(this.config.fields, (v: any) => v.name !== key);
            }
        }
    }

    protected build(): void {
        const element: any = $(this.eid);
        element.attr('class', 'table table-bordered table-striped table-hover xn-table');

        if (this.isCreateEditor) {
            const j: any = $.fn;
            this.editor = new j.dataTable.Editor({
                table: this.eid,
                fields: this.buildEditorFields(),
                display: 'xiangna',
                ajax: (method, url, data, success, error) => {
                    this.modifyAction(method, url, data, success, error);
                },
                i18n: {
                    create: {
                        button: '<span class="glyphicon glyphicon-plus"></span> 新增',
                        title: '新增记录',
                        submit: '提交'
                    },
                    edit: {
                        button: '修改',
                        title: '修改记录',
                        submit: '提交'
                    },
                    remove: {
                        button: '删除',
                        title: '删除记录',
                        confirm: '您确定要删除这条记录吗？',
                        submit: '删除',

                    }
                }
            });

            this.bindEditorEvent();
        }

        const buttons = [];
        if (this.config.allowCreate) {
            buttons.push({ extend: 'create', editor: this.editor, className: 'btn-danger' });
        }

        const columns = this.buildTableColumns();
        const order = this.buildTableOrder(columns);

        this.table = element.DataTable({
            // dom: this.buildDom(),  //不需要才能显示搜索框
            processing: true,
            serverSide: true,
            ajax: (data, callback, oSettings) => {
                this.getAction(data, callback, oSettings, DataTableUtils.buildAvengerUrl(this.config, 'getRecord'));
            },
            filter: (this.options.filter === true),
            ordering: (this.options.ordering !== false),
            orderMulti: false,
            order,
            language: DataTableUtils.dataTableLanguage,
            columns,
            buttons
        });
    }

    protected buildDom(): string {
        return '<\'row xn-dt-header\'<\'col-sm-6\'l><\'col-sm-6 text-right\'f>>' +
            '<\'row\'<\'col-sm-12\'tr>>' +
            '<\'row xn-dt-footer\'<\'col-sm-5\'i><\'col-sm-7\'p>>';
    }

    /**
     * 绑定事件
     */
    protected bindEditorEvent(): void {
        const element: any = $(this.eid);

        // 有些字段在新增时不允许填写
        if (this.config.allowCreate) {
            this.editor.on('initCreate', () => {
                for (const field of this.config.fields) {
                    const f = this.editor.field(field.name);
                    if (isNullOrUndefined(f)) { continue; }

                    let memo = field.options && field.options.memoLink ? '选择后才有具体的描述' : (field.memo || '');
                    if (field.denyCreate) {
                        f.disable();
                        if (memo.length > 0) { memo += ', '; }
                        f.message(memo + '不允许填写');
                    } else {
                        f.enable();
                        // f.input().attr('placeholder', 'placeholder信息');  // test
                        f.message(memo);
                    }
                }
            });
        }

        // 有些字段在编辑时不允许修改
        if (this.config.allowUpdate || this.isShowViewButton) {
            this.editor.on('initEdit', () => {
                if (this.isViewAction) {
                    for (const field of this.config.fields) {
                        const f = this.editor.field(field.name);
                        if (isNullOrUndefined(f)) { continue; }
                        f.disable();
                    }
                } else {
                    for (const field of this.config.fields) {
                        const f = this.editor.field(field.name);
                        if (isNullOrUndefined(f)) { continue; }

                        let memo = field.options && field.options.memoLink ? '选择后才有具体的描述' : (field.memo || '');
                        if (field.denyUpdate || field.denyCreate) {
                            f.disable();
                            if (memo.length > 0) { memo += ', '; }
                            f.message(memo + '不允许修改');
                        } else {
                            f.enable();
                            f.message(memo);
                        }
                    }
                }
            });
        }

        // 编辑按钮
        if (this.config.allowUpdate) {
            element.off('click', 'a.editor_edit');
            element.on('click', 'a.editor_edit', e => this.editAction(e));
        }

        // 查看按钮
        if (this.isShowViewButton) {
            element.off('click', 'a.editor_view');
            element.on('click', 'a.editor_view', e => this.viewAction(e));
        }

        // 删除按钮
        if (this.config.allowDelete) {
            element.off('click', 'a.editor_remove');
            element.on('click', 'a.editor_remove', e => this.deleteAction(e));
        }

        this.editor.on('preSubmit', (e, data) => this.preSubmit(e, data));

        this.editor.on('postSubmit', () => {
            // 在editor.xiangna.js中把self._dom.content的model fade改为model后（去掉模态框的动画效果）时，
            // 出现processing动画没法消失的bug
            // 这里处理下修改该bug
            this.editor._processing(false);
        });

        // 在打开时处理memoLink字段，让select变化时能让别的字段的desc也跟着改变
        this.editor.on('open', (e, mode, action) => {
            if (!(action === 'create' || (action === 'edit' && !this.isViewAction))) { return; }

            // 看看有没有字段有descLink字段
            for (const field of this.config.fields) {
                if (!(field.options && field.options.memoLink)) { continue; }
                const f = this.editor.field(field.name);
                if (isNullOrUndefined(f)) { continue; }

                $(`#DTE_Field_${field.options.memoLink.field}`).change((e) => {
                    const select = $(e.target).val();
                    if (select === null) {
                        f.message('选择后才有具体的描述');
                        return;
                    }

                    for (const v of SelectOptions.get(field.options.memoLink.selectOptions)) {
                        if (v.value === select) {
                            f.message(v.label);
                            return;
                        }
                    }
                    f.message('选择后才有具体的描述');
                });
            }
        });
    }

    preSubmit(e, data) {
        let params;
        if (data.action === 'edit' || data.action === 'create') {
            for (const key in data.data) {
                params = data.data[key];
                const msg = DataTableUtils.verifyRequired(this.config, params);
                if (msg.length > 0) {
                    this.editor.error('请填写 ' + msg.join(', '));
                    return false;
                }

                break;
            }
        }

        return true;
    }

    newAction(): void {
        this.editor.create();
    }

    editAction(e): void {
        e.preventDefault();
        this.isViewAction = false;
        this.editor.edit($(e.target).closest('tr'), {
            title: '修改记录',
            buttons: '提交'
        });
    }

    viewAction(e): void {
        e.preventDefault();
        this.isViewAction = true;
        this.editor.edit($(e.target).closest('tr'), '查看记录', [
            {
                label: '<span class="glyphicon glyphicon-eye-close"></span> 关闭',
                className: 'btn btn-primary',
                fn: () => {
                    this.editor.close();
                }
            }
        ]);
    }

    deleteAction(e): void {
        e.preventDefault();
        this.editor.remove($(e.target).closest('tr'), {
            title: '删除记录',
            message: '您确定要删除这条记录吗？',
            buttons: '删除'
        });
    }

    protected buildEditorFields(): any[] {
        const fields = [];
        for (const field of this.config.fields) {
            if (field.inEditor === undefined || field.inEditor === true) {
                fields.push({
                    label: field.label + ((field.required === false) ? '' : ' <span class="required-label">*</span>'),
                    name: field.name,
                    type: field.type,
                    placeholder: '请选择',
                    options: field.selectOptions && SelectOptions.get(field.selectOptions) || undefined,
                    def: field.def
                });
            }
        }
        return fields;
    }

    protected buildTableColumns(): any[] {
        const columns = DataTableUtils.buildTableColumns(this.config);

        // 加入编辑按钮
        if (this.isShowViewButton || this.config.allowUpdate || this.config.allowDelete) {
            let html = '<a href="javascript:void(0)" class="editor_view">查看</a>';
            if (this.config.allowUpdate) {
                html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="editor_edit">修改</a>';
            }
            if (this.config.allowDelete) {
                html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" class="editor_remove">删除</a>';
            }

            return columns.concat({
                title: '操作',
                data: null,
                defaultContent: html,
                orderable: false,
                searchable: false,
                width: '100px'
            });
        }
        return columns;
    }

    protected buildTableOrder(columns: any[]): any[] {
        if (this.config.order) {
            let orderName;
            let orderType = 'asc';
            const a = this.config.order[0];
            if (Array.isArray(a)) {
                orderName = a[0];
                orderType = a[1];
            } else {
                orderName = a;
            }

            let orderIdx = 0;
            for (const column of columns) {
                if (column.data === orderName) {
                    break;
                }
                ++orderIdx;
            }

            return [orderIdx, orderType];
        }
    }

    protected buildGetActionParams(data: any): any {
        // 重新构造order
        const order = [];
        for (const item of data.order) {
            order.push(data.columns[item.column].data + ' ' + item.dir);
        }
        const params = {
            draw: data.draw,
            start: data.start,
            length: data.length,
            order,
            options: true,
            where: {}
        };


        if (this.options && this.options.where) {
            params.where = this.options.where;
        }

        return params;
    }

    protected beforeGetAjaxCallback(json: any): void {
        DataTableUtils.addRowId(this.config, json.data.data);
    }

    protected getAction(data: any, callback: Function, oSettings: any, url: string): void {
        this.xn.api.avenger.post2(url, this.buildGetActionParams(data))
            .subscribe((json) => {
                const j: any = $.fn;
                const i: any = j.DataTable.ext.internal;  // 这种写法避免WebStorm报_fnProcessingDisplay无法解析的错误
                i._fnProcessingDisplay(oSettings, false);
                if (json.ret === 0) {
                    oSettings.json = json.data;
                    DataTableUtils.splitOptions(json.data);
                    this.beforeGetAjaxCallback(json);
                    callback(json.data);
                }
            });
    }

    protected modifyAction(method: any, url2: string, data: any, success: Function, error: Function): void {
        let url: string;
        const req: any = {} as any;
        if (data.action === 'edit') {
            url = DataTableUtils.buildUrl(this.config, 'put');
            for (const key in data.data) {
                req.where = DataTableUtils.parseRowId(this.config, key);
                req.value = data.data[key];
                for (const field of this.config.fields) {
                    if (field.denyUpdate === true && field.name in req.value) {
                        delete req.value[field.name];
                    }
                }
                if (this.options.where) {
                    for (const key in this.options.where) {
                        req.where[key] = this.options.where[key];
                    }
                }
                break;
            }
        } else if (data.action === 'remove') {
            url = DataTableUtils.buildUrl(this.config, 'delete');
            for (const key in data.data) {
                req.where = DataTableUtils.parseRowId(this.config, key);
                break;
            }
        } else if (data.action === 'create') {
            url = DataTableUtils.buildUrl(this.config, 'post');
            for (const key in data.data) {
                req.value = data.data[key];
                for (const field of this.config.fields) {
                    if (field.denyCreate === true && field.name in req.value) {
                        delete req.value[field.name];
                    }
                }

                if (this.options.where) {
                    for (const key in this.options.where) {
                        req.value[key] = this.options.where[key];
                    }
                }
                break;
            }
        }

        this.xn.api.avenger.post2(url, req)  // 只处理一条记录
            .subscribe((json) => {
                if (json.ret === 0) {
                    DataTableUtils.addRowId(this.config, json.data.data);
                    success(json.data);
                } else {
                    error(null, json.msg, null);
                }
            });
    }

    search(words) {
        this.options.where.billNumber = words ? ['like', '%' + words + '%'] : undefined,
            this.table.search(words).draw();
    }
}

import { Component, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { Observable } from 'rxjs';

/**
 *  picker 选项模态框
 */
@Component({
    templateUrl: './guarant-add-manage.template.modal.html',
    styles: [`
        table {
            table-layout: fixed;
            margin: 0;
        }

        table tr td:first-child, table tr th:first-child {
            width: 300px;
        }

        table tr td:nth-child(2), table tr th:nth-child(2) {
            width: 350px;
        }

        .scroll-height {
            max-height: calc(100vh - 450px);
            overflow-y: auto
        }

        .scroll-height > table {
            border-top: none;
        }

        .scroll-height > table tr:first-child td {
            border-top: 0;
        }
    `]
})
export class ChoseManageModalComponent {
    @ViewChild('modal') modal: ModalComponent;
    private observer: any;
    private lists: any[] = [];
    selectItems: any[] = [];
    pageSize = 10;
    first = 0;
    total = 0;
    heads: any[] = [];
    data: any[] = [];
    searchValue = ''; // 搜索值
    currentPage = 1;
    allCheckedStatus: boolean;
    params: any;

    constructor() {
    }

    open(params: any): Observable<string> {
        this.params = params;
        this.total = params.total;
        this.lists = params.data;
        this.initPage(params.data); // 默认显示
        this.heads = params.heads;
        // 初始化时有选中项，则打开添加按钮
        this.selectItems = [...this.selectItems, ...this.lists.filter((x: any) => x.checked && x.checked === true)];
        this.isAllChecked();
        this.modal.open(ModalSize.Large);
        return Observable.create(observer => {
            this.observer = observer;
        });
    }

    cancel() {
        this.close(null);
    }

    handleAdd() {
        // selectItems 先去重在提交
        const items = this.selectItemsUnique(this.selectItems);
        this.close({ action: 'ok', value: items });
    }

    /**
     * event.page: 新页码 event.pageSize: 页面显示行数 event.first: 新页面之前的总行数 event.pageCount : 页码总数
     * @param event {first:0  page :1 pageCount:3 pageSize:2}
     * @param data
     */

    onPage(event) {
        this.currentPage = event.page;
        this.pageSize = event.pageSize;
        this.data = this.lists.slice((event.page - 1) * event.pageSize, event.page * event.pageSize);
        // 切换页面 清除全选状态
        // 当数组中不具有checked且为false。没有找到则表示全选中。
        const check = this.data.some((x: any) => x.checked === undefined || x.checked === false);
        if (!check) {
            this.allCheckedStatus = true;
        } else {
            this.allCheckedStatus = false;
        }
    }


    // 搜索
    search(reg) {
        let lists = [];
        if (reg.replace(/\s+/g, '') === '') {
            lists = this.lists;
        } else {
            lists = this.lists.filter((x: any) => x.appId && x.appId.includes(reg)
                || x.orgName && x.orgName.includes(reg)
                || x.userId && x.userId.includes(reg)
                || x.userName && x.userName.includes(reg)
                || x.label && x.label.includes(reg));
        }
        this.initPage(lists);
    }
    // 全选
    allPageChecked() {
        this.allCheckedStatus = !this.allCheckedStatus;
        if (this.allCheckedStatus) {
            this.data.forEach(item => item.checked = true);
            this.selectItems = [...this.selectItems, ...this.data]; // 全选怎全部加入
        } else {
            this.data.forEach(item => item.checked = false);
            // 取消则，在数组中删除该数组所有项
            this.data.map(data => {
                this.selectItems = this.selectItems.filter((x: any) => x[this.params.key] !== data[this.params.key]);
            });
        }
    }

    checkedSingle(item, index) {
        if (this.data[index].checked && this.data[index].checked === true) {
            this.data[index].checked = false;
            // 如果取消此项，怎从数组中删除此项
            this.selectItems = this.selectItems.filter((x: any) => x[this.params.key] !== this.data[index][this.params.key]);
        } else {
            this.data[index].checked = true;
            // 选中则添加此项
            this.selectItems.push(this.data[index]);
        }
        this.isAllChecked();

    }

    // 过滤选中项
    selectItemsUnique(data: any) {
        return XnUtils.distinctArray2(data, this.params.key);
    }

    // 单选选择
    selected(item) {
        this.close({ action: 'ok', value: [item] });
    }

    private close(value) {
        this.modal.close();
        this.observer.next(value);
        this.observer.complete();
    }
    private isAllChecked() {
        // 当数组中不具有checked且为false。没有找到则表示全选中。
        const check = this.data.some((x: any) => x.checked === undefined || x.checked === false);
        if (!check) {
            this.allCheckedStatus = true;
        } else {
            this.allCheckedStatus = false;
        }
    }
    private initPage(data) {
        this.data = data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }

}

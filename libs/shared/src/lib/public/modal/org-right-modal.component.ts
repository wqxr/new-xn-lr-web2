/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\modal\org-right-modal.component.ts
 * @summary：org-right-modal.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.1                  DengPei           重构、加注释         2021-07-14
 ***************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { XnUtils } from '../../common/xn-utils';
import { ModalComponent } from '../../common/modal/components/modal';
import { TreeviewItem } from '../component/treeview/models/treeview-item';
import { TreeviewConfig } from '../component/treeview/models/treeview-config';
import { SelectOptions } from '../../config/select-options';
import { ProductNodeKey, RegisterFlowType } from '../../config/enum';

@Component({
  selector: 'org-right-modal',
  templateUrl: './org-right-modal.component.html',
})
export class OrgRightModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  private observer: any;
  private treeList = [];

  defaultTree = [];
  currentOrgId = 0;
  orgPermission: any = {};
  /** 机构类型名称 */
  orgName: string;
  /** 实际上是用来控制是否可提交，已注释，采用 submitDisabled 变量 */
  // defaultOrg = null;
  registerType: RegisterFlowType;
  submitDisabled = false;
  /** 初始化后的树 */
  items: any[];
  /** 叶子节点的标识 */
  LeafNode = 2;

  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true,
    maxHeight: 450,
  });

  constructor() { }

  ngOnInit() {
    // 有出错风险
    this.currentOrgId = SelectOptions.get('pattern') && SelectOptions.get('pattern')[0]?.value;
  }

  /**
   * 勾选树上节点
   * @param data 已勾选节点的 id 数组
   */
  onSelectedChange(data: string[] | number[]) {
    if (data.length) {
      if (Object.keys(this.orgPermission).length === 0) {
        // this.defaultOrg = `${this.currentOrgId}`;
        this.submitDisabled = false;
      }

      let nodeExt = [];
      do {
        if (data.every((c) => typeof c === 'number')) {
          nodeExt = this.idIsNumberDo(data as number[]);
          break;
        }
        if (data.every((c) => typeof c === 'string')) {
          nodeExt = this.idIsStringDo(data as string[]);
          break;
        }
      } while (true);

      this.orgPermission[this.currentOrgId] = [...data, ...nodeExt];
    } else {
      delete this.orgPermission[this.currentOrgId];
      if (Object.keys(this.orgPermission).length === 0) {
        // this.defaultOrg = '';
        this.submitDisabled = true;
      }
    }
  }

  /**
   * 新版选择产品情况处理，id 是 number 类型
   * @param data 已选 id 数值
   */
  idIsNumberDo(data: number[]) {
    return [
      ...new Set(
        this.treeList
          .filter((x) => x.text === '所有' && data.includes(x.value))
          .map((x) => x.value)
      ),
    ];
  }

  /**
   * 老版选择产品情况处理，id 的格式是 "00-0000-0000-000-0000"
   * @param data 已选 id 数值
   */
  idIsStringDo(data: string[]) {
    const temp = data.map((x) => `${x.slice(0, 13)}000-0000`);

    return [
      ...new Set(
        this.treeList
          .filter((x) => x.text === '所有' && temp.includes(x.value))
          .map((x) => x.value)
      ),
    ];
  }

  /**
   * 打开模态框
   * @param orgName 机构类型名称
   * @param productTree 产品树
   * @param orgPermission 当前机构类型已有产品 ids
   * @param defaultOrg 无实际用途，已删除
   * @param registerType 0 默认注册流程 1保函通注册流程
   */
  open({orgName, productTree, orgPermission, registerType}): Observable<string> {
    this.orgName = orgName;
    this.orgPermission = orgPermission;
    this.registerType = registerType;

    // 传入的 defaultOrg 没有实际用途，已从入参中移除
    // this.defaultOrg = defaultOrg;
    console.log('菜单权限树形选择框 =>', orgPermission[this.currentOrgId]);
    this.defaultTree = XnUtils.deepCopy(productTree.sub, []);
    this.initTreeView(this.defaultTree, orgPermission[this.currentOrgId] || []);

    this.modal.open();

    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  onOk() {
    this.close({
      action: 'cancel',
    });
  }

  onSubmit() {
    this.close({
      action: 'ok',
      orgPermission: this.orgPermission,
      // 这个值传出去没有被用到
      // defaultOrg: this.defaultOrg,
    });
  }

  private close(value: any) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }

  /**
   * 初始化树状结构，回显已选节点，树形转列表
   * @param treeList 树状数据
   * @param checkedValues 已选节点
   */
  private initTreeView(treeList, checkedValues) {
    const trees = XnUtils.deepCopy(treeList, []);
    this.treeList = [];
    this.items = trees?.reduce((prev, curr) => {
      const tree = this.walk(curr, checkedValues).map((x) => new TreeviewItem(x));
      return [].concat(prev, tree);
    }, []);
  }

  private walk(root: any, checkedValues) {
    const arr = this.treeToList(root, checkedValues);
    this.treeList = this.treeList.concat(
      this.treeList,
      XnUtils.deepCopy(arr, [])
    );
    return this.listToTree(
      arr.filter((x) => x.text !== '所有').reverse()
    );
  }

  private convert(root, node, checkedValues) {
    this.rename(node, 'name', 'text');
    this.rename(node, 'sub', 'children');

    const isLeafNode = node.type === this.LeafNode; // 叶子节点

    let _productNodeKey = ProductNodeKey[0];
    if(!XnUtils.isEmptys(this.registerType, [0])) {
      _productNodeKey = ProductNodeKey[Number(this.registerType)];
    }

    if (
      node.children &&
      node.children.length &&
      node.children[0].name === '所有'
    ) {
      node.value = node.children[0].product ? (node.children[0].product[_productNodeKey] || node.children[0].product?.id) :
        (node.children[0][_productNodeKey] || node.children[0].id);
    } else {
      node.value = isLeafNode ? (node.product[_productNodeKey] || node.product.id) : (node[_productNodeKey] || node.id);
    }

    node.checked = !!checkedValues && checkedValues.includes(node.value);
    node.disabled = this.getNodeLevel(root, node, 0) >= 3; // 只能操作 3 级节点
  }

  private treeToList(root, checkedValues) {
    const stack = [];
    const result = [];

    stack.push(root);
    while (stack.length) {
      const node = stack.pop();
      const uid = this.uid();
      node._uid = uid;
      this.convert(root, node, checkedValues);

      result.push(node);

      if (node.children) {
        node.children.forEach((item) => {
          item.parentId = uid;
          stack.push(item);
        });
      }
    }

    return result;
  }

  private getNodeLevel(root, node, level) {
    if (!root) {
      return 0;
    }
    if (root.value === node.value) {
      return level;
    }
    if (root.children) {
      if (root.children.includes((x) => x.value === node.value)) {
        return level + 1;
      }

      for (const item of root.children) {
        const l = this.getNodeLevel(item, node, level + 1);
        if (l) {
          return l;
        }
      }
    }
  }

  private uid() {
    return Math.random().toString(36).substring(2);
  }

  private listToTree(list) {
    const map = {};
    const roots = [];
    let node;
    let i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i]._uid] = i;
      list[i].children = [];
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];

      if (node.parentId) {
        list[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  private rename(obj, prev, curr) {
    obj[curr] = obj[prev];
    delete obj[prev];
  }

  onFilterChange(event) {}

  /** 这个函数应该是没有用到 */
  // onSelectOrg(orgId) {
  //   this.currentOrgId = orgId;
  //   this.initTreeView(this.defaultTree, this.orgPermission[orgId]);
  // }

  /** 这个函数应该是没有用到 */
  // disableDefaultOrg(orgId) {
  //   return Object.keys(this.orgPermission).includes(`${orgId}`) === false;
  // }
}

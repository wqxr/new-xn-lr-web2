import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnService } from '../../services/xn.service';

import { XnModalUtils } from '../../common/xn-modal-utils';
import { OrgRightModalComponent } from '../modal/org-right-modal.component';
import { SelectOptions } from '../../config/select-options';
import { TreeviewConfig } from '../component/treeview/models/treeview-config';
import { XnUtils } from '../../common/xn-utils';
import { TreeviewItem } from '../component/treeview/models/treeview-item';
import { GuaranteeAgencyTypes, ProductNodeKey, RegisterFlowType, RegisterFlowTypes } from '../../config/enum';

/**
 *  权限
 */
@Component({
  selector: 'xn-org-right-show',
  templateUrl: './org-right-show.component.html'
})
export class OrgRightShowComponent implements OnInit {
  @Input() row: any;
  @Input() form?: FormGroup;
  @Input() svrConfig?: any;
  @Input() canEdit = false;

  patterns: any[] = []; // SelectOptions.get('pattern');

  defaultOrg: string;
  orgPermission: any;
  selectedOrgPermissionInfo: any;


  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: true,
    maxHeight: 450,
  });
  defaultTree = '';
  private treeList = [];
  items: any[];
  noTree = true;


  constructor(
    private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    let _patterns: any[] = String(this.svrConfig?.registerType) === RegisterFlowType.PatternWithGuaranteeAgency.toString() ? 
      (this.svrConfig?.orgTypeList || [])
      .filter((y: any) => String(y.orgType) !== GuaranteeAgencyTypes.Guest.toString())
      .map((x: any) => {return {label: x.orgName, value: String(x.orgType)}}) : SelectOptions.get('patternWithAgency');
    this.patterns = [..._patterns];
    if (!!this.row.data) {
      const { orgRightInfo, defaultOrg } = JSON.parse(this.row.data);
      this.initValue(orgRightInfo, defaultOrg);
      if (JSON.stringify(Object.values(orgRightInfo)[0]) === '[]') {
        this.noTree = false;
      }
      this.defaultTree = XnUtils.deepCopy(this.svrConfig?.productTree.sub, []);
      this.initTreeview(this.defaultTree, Object.values(orgRightInfo)[0] || []);
      this.getData(this.items);
    }
  }

  private initTreeview(treeList, checkedValues) {
    const trees = XnUtils.deepCopy(treeList, []);
    this.treeList = [];
    this.items = trees?.reduce((prev, curr) => {
      const tree = this.walk(curr, checkedValues).map(
        (x) => new TreeviewItem(x)
      );
      return [].concat(prev, tree);
    }, []);
  }

  private walk(root: any, checkedValues) {
    const arr = this.treeToList(root, checkedValues);
    this.treeList = this.treeList.concat(
      this.treeList,
      XnUtils.deepCopy(arr, [])
    );
    const trees = this.listToTree(
      arr.filter((x) => x.text !== '所有').reverse()
    );
    return trees;
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

  private convert(root, node, checkedValues) {
    this.rename(node, 'name', 'text');
    this.rename(node, 'sub', 'children');

    const isLeafNode = node.type === 2; // 叶子节点

    let _productNodeKey = ProductNodeKey[0];
    if(!XnUtils.isEmptys(this.svrConfig?.registerType, [0])) {
      _productNodeKey = ProductNodeKey[Number(this.svrConfig.registerType)];
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
  private rename(obj, prev, curr) {
    obj[curr] = obj[prev];
    delete obj[prev];
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
  // 设置展开与收缩
  getData(items) {
    items.forEach(x => {
      if (!!x.internalChildren && x.internalChildren.length > 0) {
        this.getData(x.internalChildren);
      }
      if (x.checked === undefined) {
        x.checked = true;
      }
      x.collapsed = !x.checked;
      x.disabled = true;
    });
  }

  private initValue(orgPermission, defaultOrg) {
    this.orgPermission = orgPermission;
    this.defaultOrg = defaultOrg;
    this.selectedOrgPermissionInfo = this.getOrgInfo(this.orgPermission);
  }
  private getOrgInfo(orgPermission: any): any {
    return Object.keys(orgPermission).map((key) => {
      const pattern = this.patterns.find((x) => x.value === key);

      return {
        org: pattern.label,
        defaultOrg: pattern.value === this.defaultOrg,
      };
    });
  }

}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import Todo from 'libs/shared/src/lib/logic/todo';
import SysMessages from 'libs/shared/src/lib/logic/sys-messages';
import PaymentMessages from 'libs/shared/src/lib/logic/payment-messages';
import TodoDragon from 'libs/products/dragon/src/lib/Tododragon';
import TodoAgile from './TodoAgile';
import OrgNoticeToDo from './pages/angency-todolist/to-orgnotice';


import { AgileComponent } from './pages/agile/agile.component';
import { GtasksComponent } from './pages/gtasks/gtasks.component';
import { SysMessagesComponent } from './pages/sys-messages/sys-messages.component';
import { SystemUpdateComponent } from './pages/system-update/system-update.component';
import { PaymentMessagesComponent } from './pages/payment-messages/payment-messages.component';
import { AngencyTodoListComponent } from './pages/angency-todolist/angency-todolist.component';
import { ViewRemindComponent } from './pages/view-remind/view-remind.component';
import { AngencyComponent } from './pages/angency/angency.component';
import TodoAngency from './pages/angency/todoAngency';
import RegisterTodo from './pages/estate-register/todo-register';
import { RegisterEstateComponent } from './pages/estate-register/estate-register.component';
import { VerifyCompanyInfoEstateComponent } from './pages/estate-verify-company/estate-verify-company.component';
import VerifyCompanyInfoTodo from './pages/estate-verify-company/todo-verify-company-info';

const routes: Routes = [
  {
    // 地产业务列表-雅居乐
    path: 'agile/:productIdent',
    component: AgileComponent,
    data: { todo: TodoAgile, isPerson: false }
  },
  {
    // 保理通-雅居乐-柏霖汇（个人待办）
    path: 'agile-person/:productIdent',
    component: AgileComponent,
    data: { todo: TodoAgile, isPerson: true }
  },
  {
    // 其他待办
    path: 'gtasks/:productIdent',
    component: GtasksComponent,
    data: { todo: Todo }
  },
  {
    // 系统消息列表
    path: 'sys-messages',
    component: SysMessagesComponent,
    data: { sysMsg: SysMessages }
  },
  // 提醒列表
  {
    path: 'system-update',
    component: SystemUpdateComponent,
  },
  {
    // 备付通知列表
    path: 'payment-messages',
    component: PaymentMessagesComponent,
    data: { payMsg: PaymentMessages, dragonTodo: TodoDragon }
  },
  // 中介机构待办列表
  {
    path: 'angency/:productIdent',
    component: AngencyComponent,
    data: { dragonTodo: TodoAngency }
  },
  // abs2中介机构提醒待办列表
  {
    path: 'angency-todolist',
    component: AngencyTodoListComponent,
    data: { orgNoticeToDo: OrgNoticeToDo }
  },
  { //首页代办查看提醒-关联项目管理提醒功能
    path: 'view-remind',
    component: ViewRemindComponent
  },
  {
    // 注册待办
    path: 'estate-register/:productIdent',
    component: RegisterEstateComponent,
    data: { todo: RegisterTodo }
  },
  {
    // 企业资料审核待办
    path: 'estate-verify-company/:productIdent',
    component: VerifyCompanyInfoEstateComponent,
    data: { todo: VerifyCompanyInfoTodo }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

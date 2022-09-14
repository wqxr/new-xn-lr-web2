import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockInputIndexComponent } from './input/index.component';
import { MockShowIndexComponent } from './show/index.component';

const routes: Routes = [
    {
        path: '',
        component: MockInputIndexComponent
    },
    {
        path: 'input',
        component: MockInputIndexComponent
    },
    {
        path: 'show',
        component: MockShowIndexComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MockRoutingModule { }

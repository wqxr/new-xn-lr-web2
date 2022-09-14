import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from './directives/dropdown.directive';
import { DropdownMenuDirective } from './directives/dropdown-menu.directive';
import { DropdownToggleDirective } from './directives/dropdown-toggle.directive';
import { DropdownTreeviewComponent } from './components/dropdown-treeview/dropdown-treeview.component';
import { TreeviewComponent } from './components/treeview/treeview.component';
import { TreeviewItemComponent } from './components/treeview-item/treeview-item.component';
import { TreeviewPipe } from './pipes/treeview.pipe';
import { TreeviewConfig } from './models/treeview-config';
import { TreeviewEventParser, DefaultTreeviewEventParser } from './helpers/treeview-event-parser';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    TreeviewComponent,
    TreeviewItemComponent,
    TreeviewPipe,
    DropdownDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    DropdownTreeviewComponent
  ],
  exports: [
    TreeviewComponent,
    TreeviewPipe,
    DropdownTreeviewComponent
  ],
  providers: [
    TreeviewConfig,
    { provide: TreeviewEventParser, useClass: DefaultTreeviewEventParser }
  ]
})
export class TreeviewModule {}

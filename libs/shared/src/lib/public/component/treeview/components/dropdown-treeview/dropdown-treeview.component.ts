import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import { TreeviewItem } from '../../models/treeview-item';
import { TreeviewConfig } from '../../models/treeview-config';
import { TreeviewComponent } from '../treeview/treeview.component';
import { TreeviewHeaderTemplateContext } from '../../models/treeview-header-template-context';
import { TreeviewItemTemplateContext } from '../../models/treeview-item-template-context';

@Component({
    selector: 'dropdown-treeview',
    templateUrl: './dropdown-treeview.component.html',
    styleUrls: ['./dropdown-treeview.component.css'],
})
export class DropdownTreeviewComponent {
    @Input() buttonClass = 'btn-outline-secondary';
    @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
    @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
    @Input() items: TreeviewItem[];
    @Input() config: TreeviewConfig;
    @Input() disabled: boolean;
    @Output() selectedChange = new EventEmitter<any[]>(true);
    @Output() filterChange = new EventEmitter<string>();
    @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
    buttonLabel = '';

    constructor(private defaultConfig: TreeviewConfig) {
        this.config = this.defaultConfig;
    }

    onSelectedChange(values: any[]): void {
        this.buttonLabel = this.treeviewComponent.selection.checkedItems.map((x: any) => x.text).join(',');
        this.selectedChange.emit(values);
    }

    onFilterChange(text: string): void {
        this.filterChange.emit(text);
    }
}

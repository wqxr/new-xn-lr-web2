import { Component, OnInit } from '@angular/core';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';


@Component({
    selector: 'xn-check-show-component',
    template: `<h3>Dragon form show</h3>`
})
@DynamicForm({ type: 'type', formModule: 'dragon-show' })
export class XnDemoCheckShowComponent implements OnInit {
    ngOnInit(): void {
        //
    }
}

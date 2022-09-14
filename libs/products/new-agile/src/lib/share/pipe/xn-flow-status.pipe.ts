import { Pipe, PipeTransform } from '@angular/core';
import { FlowCustom } from '../components/flow/config/flow.custom';

@Pipe({ name: 'xnFlowStatus' })
export class XnFlowStatus implements PipeTransform {
    transform(status: any): string {
        const step = FlowCustom.getSteped(status);
        return step ? step.name : '';
    }
}

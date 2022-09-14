import { Pipe, PipeTransform } from '@angular/core';
import { XnUtils } from '../../common/xn-utils';

@Pipe({ name: 'xnLabel' })
export class XnLabelPipe implements PipeTransform {
    transform(data: string, key: string = 'label'): string {
        if (!data) {
            return;
        }

        try {
            const obj = JSON.parse(data.replace(/'/g, '"'));
            if (Array.isArray(obj)) {
                return [...obj]
                    .map(x => {
                        return this.transform(JSON.stringify(x), key);
                    })
                    .toString();
            } else {
                return obj.hasOwnProperty(key) ? obj[key] : obj;
            }
        } catch (e) {
            return data;
        }
    }
}

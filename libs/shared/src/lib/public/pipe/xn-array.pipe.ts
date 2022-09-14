import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'xnArray'})
export class XnArrayPipe implements PipeTransform {
    transform(data: any[]): any {
        if (data.length) { return data.join(' , '); }
        else { return ''; }
    }
}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'br'})
export class XnBrPipe implements PipeTransform {
    transform(data: string): any {
        data = data.replace(/\n/g, '<br/>');
        return data;
    }
}

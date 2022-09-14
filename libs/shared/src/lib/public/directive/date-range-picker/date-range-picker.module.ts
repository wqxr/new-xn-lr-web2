import { NgModule } from '@angular/core';
import { DaterangepickerDirective } from './date-range-picker.directive';
import { DaterangepickerConfigService } from './config.service';

@NgModule({
    declarations: [DaterangepickerDirective],
    providers: [DaterangepickerConfigService],
    exports: [DaterangepickerDirective]

})
export class DaterangepickerModule {

}

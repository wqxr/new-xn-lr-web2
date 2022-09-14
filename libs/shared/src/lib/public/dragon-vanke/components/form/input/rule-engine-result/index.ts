import { XnRuleEngineResultInputComponent } from "./xn-rule-engine-result.component";
import { XnRuleEngineErrorInputComponent } from './components/system-judge-error-input/system-judge-error-input.component'
import {XnRuleEngineErrorManagerInputComponent} from './components/artificial-judge-error/artificial-judge-error-input.component'
import {XnRuleEngineSuccessInputComponent} from './components/system-judge-success-input/system-judge-success-input.component'
import {XnRuleEngineSuccessManagerInputComponent} from './components/artificial-judge-success-input/artificial-judge-success-input.component'

export const RuleEngineInputs = [
  XnRuleEngineResultInputComponent,
  XnRuleEngineErrorInputComponent,
  XnRuleEngineErrorManagerInputComponent,
  XnRuleEngineSuccessInputComponent,
  XnRuleEngineSuccessManagerInputComponent
]

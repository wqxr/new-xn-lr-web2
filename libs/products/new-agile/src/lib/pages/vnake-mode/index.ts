import { ContractTemplate } from './contract-template';
import { VankeYjlSupplierSignComponent } from './vanke-yjl-supplier-sign.component';
import { YajvleSignContractComponent } from './yajvle-sign-contract.component';

import { BankManagementService } from './bank-mangement.service';

export const Service = BankManagementService;

export const VnakeModeComponents = [
    ...ContractTemplate,
    VankeYjlSupplierSignComponent,
    YajvleSignContractComponent,
];

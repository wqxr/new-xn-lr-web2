import { AccountAntEditModalComponent } from "./account-ant-edit-modal/account-ant-edit-modal.compoonent";
import { XnAddBankModalComponent } from "./add-bank-account.modal";
import { ChoseBankModalComponent } from "./chose-bank.modal";
import { XnChoseFilmBankModalComponent } from "./chose-film-bank.modal";
import { ProtocolFileViewerModal } from "./file-viewer.modal";
import { XnProcessRecordModalComponent } from "./process-record.modal";
import { XnUploadAuthorizeModalComponent } from "./upload-authorize-file.modal";

export const ModalComponents = [
  // 公用modal框
  ProtocolFileViewerModal,
  XnAddBankModalComponent,
  ChoseBankModalComponent,
  XnChoseFilmBankModalComponent,
  XnProcessRecordModalComponent,
  AccountAntEditModalComponent,
  XnUploadAuthorizeModalComponent
];

## 流程操作模板

|功能 |组件 |入口 |
|:----|:----|:----|
|编辑|    VankeEditComponent     |  VankeEditComponent     |  vanke/record/:type/edit/:id
|发起流程|   VankeNewComponent      | VankeNewComponent    vanke/record/new/:id/:relatedRecordId |  vanke/new/:id/:headquarters
|流程记录列表|      VankeRecordComponent   | vanke/record/:id  
|流程详情|     VankeFlowDetailRecordComponent    |    台账交易中查看交易详情   | vanke/main-list/detail/:id  
|查看主流程详情|     VankeViewComponent    |   vanke/record/:type/view/:id  | vanke/record/view/:id
|提示|      VankeMemoComponent  

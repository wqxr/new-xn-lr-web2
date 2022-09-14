# 流程配置
+ 2019-05-16

+ 将本次 `平台角色` + `采购融资` 在该文件下创建对应的配置,方便修改查看

### 特殊情况

+ 除了采购融资中 `申请流程` ，`合作签约` 使用 `projects/avenger/src/lib/flow/flow-custom.ts`
  > 使用该流程配置的 流程id配置在 `SpecialFlows` 中，此文件需要前后端一起配置，保持一致

+ 其他流程 使用 `src/app/pages/console/record/flow.custom.ts`

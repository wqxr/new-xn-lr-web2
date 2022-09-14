import { ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';

export default class VankeFactorTabConfig {
  static paltformMsg = {
    heads: [
      {
        label: '平台审核复核人',
        value: 'recordId',
        type: 'mainFlowId',
        width: '19%',
      },
      { label: '审核意见', value: 'modelId', type: 'text', width: '10%' },
      { label: '后补资料', value: 'flowId', type: 'text', width: '10%' },
    ] as ListHeadsFieldOutputModel[],
  };
  static businessFactor = {
    title: '本笔业务要素及资料',
    heads: [
      {
        label: '交易id',
        value: 'mainFlowId',
        type: 'mainFlowId',
        width: '19%',
      },
      { label: '总部公司', value: 'poolTradeCode', type: 'text', width: '10%' },
      {
        label: '项目公司',
        value: 'projectCompany',
        type: 'text',
        width: '10%',
      },
      { label: '供应商', value: 'projectCompany', type: 'text', width: '10%' },
      {
        label: '应收账款金额',
        value: 'projectCompany',
        type: 'text',
        width: '10%',
      },
      {
        label: '资产转让折扣率',
        value: 'projectCompany',
        type: 'text',
        width: '10%',
      },
      {
        label: '保理融资到期日',
        value: 'projectCompany',
        type: 'date',
        width: '10%',
      },
    ] as ListHeadsFieldOutputModel[],
  };
  static historyLoan = {
    title: '历史已放款业务情况',
    allheads: [
      {
        title: '',
        heads: [
          {
            label: '供应商名称',
            value: 'debtUnit',
            type: 'text',
            width: '19%',
          },
          {
            label: '历史业务笔数',
            value: 'poolTradeCode',
            type: 'text',
            width: '10%',
          },
          {
            label: '历史业务总额',
            value: 'receive',
            type: 'text',
            width: '10%',
          },
          {
            label: '历史笔均金额',
            value: 'discountRate',
            type: 'text',
            width: '10%',
          },
        ] as ListHeadsFieldOutputModel[],
      },
      {
        title: '详情列表',
        heads: [
          {
            label: '交易id',
            value: 'mainFlowId',
            type: 'mainFlowId',
            width: '19%',
          },
          {
            label: '总部公司',
            value: 'headquarters',
            type: 'text',
            width: '10%',
          },
          {
            label: '项目公司',
            value: 'projectCompany',
            type: 'text',
            width: '10%',
          },
          { label: '供应商', value: 'debtUnit', type: 'text', width: '10%' },
          {
            label: '应收账款金额',
            value: 'receive',
            type: 'text',
            width: '10%',
          },
          {
            label: '资产转让折扣率',
            value: 'discountRate',
            type: 'text',
            width: '10%',
          },
          {
            label: '保理融资到期日',
            value: 'factoringEndDate',
            type: 'date',
            width: '10%',
          },
        ] as ListHeadsFieldOutputModel[],
      },
    ],
  };
  static holdersInfo = {
    title: '股东信息',
    allheads: [
      {
        title: '',
        heads: [
          { label: '股东', value: 'stockName', type: 'text', width: '10%' },
          { label: '股东类型', value: 'stockType', type: 'text', width: '10%' },
          {
            label: '认缴出资额（万元）',
            value: 'shouldCapi',
            type: 'text',
            width: '10%',
          },
          {
            label: '出资比例',
            value: 'stockPercent',
            type: 'text',
            width: '10%',
          },
          {
            label: '认缴出资时间',
            value: 'shoudDate',
            type: 'date',
            width: '10%',
          },
          { label: '备注', value: 'tagsList', type: 'text', width: '10%' },
        ] as ListHeadsFieldOutputModel[],
      },
    ],
  };
  static litigationInfo = {
    allheads: [
      {
        title: '立案信息',
        label: 'caseFiling',
        heads: [
          { label: '案号', value: 'CaseNo', type: 'text', width: '10%' },
          {
            label: '原告',
            value: 'ProsecutorList',
            type: 'list',
            width: '10%',
          },
          { label: '被告', value: 'DefendantList', type: 'list', width: '10%' },
          {
            label: '立案时间',
            value: 'PublishDate',
            type: 'text',
            width: '10%',
          },
        ] as ListHeadsFieldOutputModel[],
      },
      {
        title: '开庭公告',
        label: 'courtAnnoV4',
        heads: [
          { label: '案由', value: 'CaseReason', type: 'text', width: '10%' },
          { label: '案号', value: 'CaseNo', type: 'text', width: '10%' },
          {
            label: '上诉人',
            value: 'Prosecutorlist',
            type: 'list',
            width: '10%',
          },
          {
            label: '被上诉人',
            value: 'Defendantlist',
            type: 'list',
            width: '10%',
          },
          { label: '开庭日', value: 'LianDate', type: 'text', width: '10%' },
        ] as ListHeadsFieldOutputModel[],
      },
      {
        title: '法院公告',
        label: 'courtNoticeV4',
        heads: [
          { label: '公告类型', value: 'Category', type: 'text', width: '10%' },
          { label: '公告人', value: 'Court', type: 'list', width: '10%' },
          { label: '当事人', value: 'Party', type: 'list', width: '10%' },
          {
            label: '刊登日期',
            value: 'PublishedDate',
            type: 'text',
            width: '10%',
          },
        ] as ListHeadsFieldOutputModel[],
      },
      {
        title: '裁判文书信息',
        label: 'judgeDocV4',
        heads: [
          { label: '案件编号', value: 'CaseNo', type: 'text', width: '10%' },
          {
            label: '裁判文书名字',
            value: 'CaseName',
            type: 'text',
            width: '10%',
          },
          { label: '案由', value: 'CaseReason', type: 'text', width: '10%' },
          { label: '执行法案', value: 'Court', type: 'text', width: '10%' },
          {
            label: '发布时间',
            value: 'SubmitDate',
            type: 'text',
            width: '10%',
          },
        ] as ListHeadsFieldOutputModel[],
      },
      {
        title: '失信被执行人',
        label: 'shiXinInfo',
        heads: [
          { label: '案件编号', value: 'Anno', type: 'text', width: '10%' },
          {
            label: '被执行人履行情况',
            value: 'Executestatus',
            type: 'text',
            width: '10%',
          },
          {
            label: '生效法律文书确定的义务',
            value: 'Yiwu',
            type: 'text',
            width: '10%',
          },
          {
            label: '执行法院',
            value: 'ExecuteGov',
            type: 'text',
            width: '10%',
          },
          {
            label: '作出执行依据',
            value: 'Executeunite',
            type: 'text',
            width: '10%',
          },
          { label: '发布时间', value: 'Liandate', type: 'text', width: '10%' }, // Publicdate
        ] as ListHeadsFieldOutputModel[],
      },
    ],
  };
  // 流程中公共表格组件
  static flowtableInfo = [
    {
      flowId: [
        'vanke_abs_step_platform_verify_operate',
        'vanke_abs_step_platform_verify_review',
      ],
      // -> 基础交易合同表格
      checkerId: 'contractClassifyInfo',
      headOperate: [],
      heads: [
        { label: '序号', value: 'id', type: 'id', width: '3%' },
        {
          label: '合同类型',
          value: 'file_nature_child_option_name',
          type: 'text',
          width: '6%',
        },
        {
          label: '分类类别',
          value: 'file_classify_name',
          type: 'text',
          width: '5%',
        },
        {
          label: '人工审核标准',
          value: 'manualApprovalStandardList',
          type: 'manualApproval',
          width: '10%',
        },
        // {
        //   label: '指标名称',
        //   value: 'indexItemList',
        //   type: 'itemName',
        //   width: '20%',
        // },
        {
          label: '指标内容',
          value: 'indexItemList',
          type: 'itemValue',
          width: '20%',
        },
        {
          label: '操作',
          value: 'classifyResultList',
          type: 'listClassify',
          width: '6%',
        },
      ] as ListHeadsFieldOutputModel[],
      datas: [],
      rowButtons:[],
    },
    {
      flowId: [
        'vanke_abs_step_platform_verify_operate',
        'vanke_abs_step_platform_verify_review',
      ],
      // -> 履约信息表格
      checkerId: 'performanceClassifyInfo',
      headOperate: [],
      heads: [
        { label: '序号', value: 'id', type: 'id', width: '3%' },
        {
          label: '款项性质',
          value: 'file_nature_child_option_name',
          type: 'text',
          width: '6%',
        },
        {
          label: '分类类别',
          value: 'file_classify_name',
          type: 'text',
          width: '5%',
        },
        {
          label: '人工审核标准',
          value: 'manualApprovalStandardList',
          type: 'manualApproval',
          width: '10%',
        },
        // {
        //   label: '指标名称',
        //   value: 'indexItemList',
        //   type: 'itemName',
        //   width: '15%',
        // },
        {
          label: '指标内容',
          value: 'indexItemList',
          type: 'itemValue',
          width: '20%',
        },
        {
          label: '操作',
          value: 'classifyResultList',
          type: 'listClassify',
          width: '7%',
        },
      ] as ListHeadsFieldOutputModel[],
      datas: [],
      rowButtons:[],
    },
    {
      flowId: [
        'vanke_abs_step_platform_verify_operate',
        'vanke_abs_step_platform_verify_review',
      ],
      checkerId: 'certificateFile',
      headOperate: [],
      heads: [
        { label: '序号', value: 'id', type: 'id', width: '19%' },
        {
          label: '文件名称',
          value: 'mainFlowId',
          type: 'mainFlowId',
          width: '19%',
        },
        {
          label: '资质类别',
          value: 'poolTradeCode',
          type: 'text',
          width: '10%',
        },
        {
          label: '资质证书号',
          value: 'projectCompany',
          type: 'text',
          width: '10%',
        },
        {
          label: '资质名称',
          value: 'projectCompany',
          type: 'text',
          width: '10%',
        },
        {
          label: '发证日期',
          value: 'projectCompany',
          type: 'text',
          width: '10%',
        },
        {
          label: '发证有效期',
          value: 'projectCompany',
          type: 'text',
          width: '10%',
        },
        {
          label: '发证机关',
          value: 'projectCompany',
          type: 'text',
          width: '10%',
        },
        { label: '操作', value: 'projectCompany', type: 'text', width: '10%' },
      ] as ListHeadsFieldOutputModel[],
      datas: [],
      rowButtons:[],
    },
    {
      flowId: [
        'sub_platform_certify',
      ],
      headOperate: [],
      checkerId: 'certifyList',
      heads: [
        { label: '序号', value: 'id', type: 'id', width: '19%' },
        {
          label: '文件名称',
          value: 'certify_file',
          type: 'file',
          width: '19%',
        },
        {
          label: '证书编号',
          value: 'certify_code',
          type: 'text',
          width: '10%',
        },
        {
          label: '发证日期',
          value: 'certify_date',
          type: 'date',
          width: '10%',
        },
        {
          label: '企业名称',
          value: 'appName',
          type: 'text',
          width: '10%',
        },
        {
          label:'资质文件企业名称',
          value: 'certify_app_name',
          type: 'text',
          width: '10%',
        },
        {
          label: '有效期',
          value: 'certify_indate',
          type: 'date',
          width: '10%',
        },
        {
          label: '资质类别及等级',
          value: 'certifyClasseList',
          type: 'level-certifile',
          width: '10%',
        },

        { label: '操作', value: 'projectCompany', type: 'operate', width: '10%' },
      ] as ListHeadsFieldOutputModel[],
      datas: [],
      rowButtons: [{ label: '录入', value: 'enterInfo', click: () => { } }
        , { label: '删除', value: 'deleteInfo', click: () => { } }]
    },
    {
      flowId: [
        'sub_debtUnit_certify',
      ],
      headOperate: [],
      checkerId: 'certifyList',
      heads: [
        { label: '序号', value: 'id', type: 'id', width: '19%' },
        {
          label: '文件名称',
          value: 'certify_file',
          type: 'file',
          width: '19%',
        },
        {
          label: '证书编号',
          value: 'certify_code',
          type: 'text',
          width: '10%',
        },
        {
          label: '发证日期',
          value: 'certify_date',
          type: 'date',
          width: '10%',
        },
        {
          label: '企业名称',
          value: 'appName',
          type: 'text',
          width: '10%',
        },
        {
          label:'资质文件企业名称',
          value: 'certify_app_name',
          type: 'text',
          width: '10%',
        },
        {
          label: '有效期',
          value: 'certify_indate',
          type: 'date',
          width: '10%',
        },
        {
          label: '资质类别及等级',
          value: 'certifyClasseList',
          type: 'level-certifile',
          width: '10%',
        },

        { label: '操作', value: 'projectCompany', type: 'operate', width: '10%' },
      ] as ListHeadsFieldOutputModel[],
      datas: [],
       rowButtons: [{ label: '录入', value: 'enterInfo', click: () => { } }
      ,]
    },
    {
      flowId: [
        'vanke_abs_step_financing',
        'vanke_abs_step_platform_verify_operate',
      ],
      checkerId: 'contractNeed',
      heads: [],
      headOperate: [],
      datas: [
        { contractNeed: '1、如该版块已有甲方提供的资料，请您务必核实确认并查漏补缺。如资料有误，请点击“上传文件”按钮并完整上传' },
        { contractNeed: '2、分页且清晰，关键页需要完整上传' },
        { contractNeed: '3、如合同为补充协议，原合同也需要提供' },
      ],
      rowButtons:[],
    },
    {
      flowId: [
        'sub_debtUnit_upload_certify',
        'sub_debtUnit_certify'
      ],
      checkerId: 'certifyInfo',
      heads: [],
      headOperate: [],
      datas: [
        { contractNeed: '1、请上传企业近四年全部资质文件' },
        { contractNeed: '2、资质文件审核通过后，可在提交业务资料时选择使用' },
      ],
      rowButtons:[],
    },
    {
      flowId: [
        'vanke_abs_step_financing',
        'vanke_abs_step_platform_verify_operate',
      ],
      checkerId: 'invoiceNeed',
      headOperate: [],
      heads: [],
      datas: [
        { contractNeed: '1、如该版块已有甲方提供的资料，请您务必核实确认并查漏补缺。如资料有误，请点击“批量上传图片”按钮并完整上传' },
        { contractNeed: '2、发票信息及章需清晰' },
        {
          contractNeed:
            '3、全国统一发票监制章（必需）+发票专用章（记账联不要求）',
        },
        { contractNeed: '4、必需是纸质发票样式' },
        { contractNeed: '5、均按预填发票号上传' },
      ],
      rowButtons:[]
    },
    {
      flowId: [
        'vanke_abs_step_financing',
        'vanke_abs_step_platform_verify_operate',
      ],
      checkerId: 'performanceNeed',
      headOperate: [],
      heads: [],
      datas: [
        { contractNeed: '1、如该版块已有甲方提供的资料，请您务必核实确认并查漏补缺。如资料有误，请点击“上传文件”按钮并完整上传' },
        {
          contractNeed:
            '2、线下文件：彩色扫描件；若是黑白复印件，需要加盖贵司公章',
        },
        { contractNeed: '3、以图片格式（jpg.jpeg.png.）或PDF格式上传' },
      ],
      rowButtons:[],
    },
    {
      flowId: [
        'vanke_abs_step_financing',
        'vanke_abs_step_platform_verify_operate',
      ],
      checkerId: 'certificateNeed',
      heads: [],
      headOperate: [],
      datas: [
        {
          contractNeed: '1、彩色扫描件；若是黑白复印件，需要加盖贵司公章。',
        },
        { contractNeed: '2、资质需要覆盖基础交易合同施工内容；有效期覆盖本次应收账款确认时间。' },
        { contractNeed: '3、以图片格式（jpg. jpeg. png.）或PDF格式上传。' },
      ],
      rowButtons:[],
    },
  ];
}

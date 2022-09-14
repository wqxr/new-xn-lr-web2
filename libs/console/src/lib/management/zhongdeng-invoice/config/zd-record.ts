import { Column, TableData } from '@lr/ngx-table';

export default class ZdRecordConfig {

    static commonConfig = {
        // 表头 批量查询记录字段
        heads: [
            { title: '记录编号', index: 'id' },
            {
                title: '查询开始时间', index: 'start_time', render: 'dateTimeTpl',
            },
            {
                title: '查询结束时间', index: 'end_time', render: 'dateTimeTpl'
            },
            { title: '当前状态', index: 'status_name' },
            { title: '查询成功企业数量', index: 'success_num' },
            { title: '查询异常企业数量', index: 'fail_num' },
            { title: '操作', index: '', render: 'operateTpl' },
        ] as Column[],
        // 批量查询记录详情表头字段
        singleDetailHeads: [
            { title: '序号', index: 'id' },
            {
                title: '企业名称', index: 'name',
            },
            {
                title: '查询开始时间', index: 'start_time', render: 'dateTimeTpl'
            },
            { title: '查询结束时间', index: 'end_time', render: 'dateTimeTpl' },
            { title: '查询进度', index: 'status_name' },
            { title: '查询结果', index: 'query_result' },
        ],
        // 中登关联记录表头字段
        relationRecord:
            [
                { title: '登记证明编号', index: 'registerNo',render:'transferAssetDesc' },
                {
                    title: '登记类型', index: 'registerType',
                },
                {
                    title: '交易业务类型', index: 'bizType',
                },
                { title: '登记时间', index: 'registerDate', render: 'dateTimeTpl' },
                { title: '登记到期日', index: 'registerDueDate', render: 'dateTimeTpl' },
                { title: '转让财产描述', index: 'transferAssetDesc', render: 'transferAssetDesc', width: '40%' },
                { title: '发票信息', index: 'invoiceInfo',width:'20%',render:'transferAssetDesc'},
                { title: '受让人', index: 'assignee', },
                { title: '中登类别', index: 'classify', render: 'classType' },
                { title: '备注信息', index: 'remark', },
                { title: '操作', index: '', render: 'operateTpl' },

            ] as Column[],
    }
}

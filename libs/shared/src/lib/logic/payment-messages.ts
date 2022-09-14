import CommBase from '../public/component/comm-base';
import { XnService } from '../services/xn.service';
import { XnUtils } from '../common/xn-utils';
/**
 *  备付通知
 */
export default class PaymentMessages {
    static readonly flowId = '';
    static readonly showName = '备付通知';
    static readonly showPage = true;
    static readonly apiUrlBase = '/llz/financing/payment_msg';
    static readonly webUrlBase = ``;
    static readonly tableText = 'text-left';
    /**
     * 【重要】字段默认会在new/edit/detail/list出现
     * _inList/_inNew/_inDetail/_inEdit为false表示不在new/detail/edit里出现，为object表示追加属性
     */
    static readonly fields = [
        {
            title: '来自', checkerId: 'senderAppName', memo: '', type: 'list-title',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false
            },
            _inEdit: {
                options: {
                    readonly: true
                }
            }
        },
        {
            title: '标题', checkerId: 'msg', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: true
            }
        },
        {
            title: '相关交易', checkerId: 'mainFlowId', memo: '',
            _inSearch: false,
            _inList: {
                sort: false,
                search: false,
            }
        },
        {
            title: '时间', checkerId: 'createTime', memo: '', type: 'dateTime',
            _inSearch: false,
            _inList: {
                sort: true,
                search: false,
            }
        }
    ];

    static readonly list = {
        onList: (base: CommBase, params) => {
            // params['where'] = {
            //     flowId: Vanke.flowId
            // };
            base.onDefaultList(params);
        },
        // 分页设置
        payMsg: {
            paging: 0,
            pageSize: 10,
            first: 0,
            arrObjs: {}
        },
        headButtons: [],

        // 允许在行内根据不同条件增加行按钮
        rowButtons: [],
    };

    // 只要存在detail配置就允许查看详情
    static readonly detail = false;

    // 如果没有或没权限显示add，那就不用显示新增按钮
    static readonly add = {
        can: (xn: XnService) => {
            return false;
        },
    };

    // 如果没有或没权限显示detail和edit，那就不用显示最后的操作列
    static readonly edit = {
        can: (xn: XnService, record: any) => {
            return false;
        }
    };
}

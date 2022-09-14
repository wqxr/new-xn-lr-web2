import { ElementRef } from '@angular/core';

/**
 * 跟具体业务逻辑相关的一些方法
 */
export default class XnLogicUtils {

    static formatBcDataType(type) {
        switch (parseInt(type)) {
            case 0:
                return '其他';
            case 1:
                return '机构数据';
            case 2:
                return '机构App数据';
            case 3:
                return '融资订单数据';
            case 4:
                return '机构关系数据';
            case 5:
                return '融资订单流程数据';
            case 6:
                return '文件数据';
            default:
                return '其他';
        }
    }

    static formatBcOrderStatus(type) {
        switch (parseInt(type, 0)) {
            case 1:
                return '录入融资订单';
            case 2:
                return '融资订单审核确认';
            case 3:
                return '放款中';
            case 4:
                return '还款中';
            case 5:
                return '结束';
            default:
                return '其他';
        }
    }

    /**
     * AppCa的step字段的解释
     * @param step
     * @returns {string}
     */
    static formatCaStep(step): string {
        switch (parseInt(step, 0)) {
            case 1:
                return '向CA提交申请资料';
            case 2:
                return '向CA上传图片';
            case 3:
                return '提交完成，等待CA审核';
            default:
                return `其他(${step})`;
        }
    }

    /**
     * AppCa的step字段的解释
     * @param status
     * @returns {string}
     */
    static formatCaStatus(status, step): string {
        if (step !== 3) {
            if (step === 1 || step === 2) {
                return '上传资料中';
            }
            else {
                return '';
            }
        }

        switch (status) {
            case 'SUCCESS':
                return '审核通过';
            case 'ARCHIVE':
                return '审核通过';
            case 'DISABLE':
                return '业务单已作废';
            case 'AUDITFAIL':
                return '业务单审核驳回';
            case 'AUDIT':
                return '待审核';
            default:
                return `其他(${status})`;
        }
    }

    /**
     * 未登陆时是否跳转
     * @param url
     */
    static needRedirectWhenLogout(url: string): boolean {
        const urls = ['/login', '/registry'];
        return urls.indexOf(url) < 0;
    }


    /**
     * 改变主体颜色
     * @param er
     * @param orgType
     */
    static changeTheme(er: ElementRef, orgType) {
        // 修改主体颜色
        const body = $(er.nativeElement.ownerDocument.body);
        body.removeClass('skin-blue');
        body.removeClass('skin-purple');
        body.removeClass('skin-green');
        body.removeClass('skin-red');
        body.removeClass('skin-white');
        switch (orgType) {
            case 2:
                body.addClass('skin-purple');
                break;
            case 201:
                body.addClass('skin-purple');
                break;
            case 202:
                body.addClass('skin-purple');
                break;
            case 3:
                body.addClass('skin-green');
                break;
            case 99:
                body.addClass('skin-red');
                break;
            default:
                body.addClass('skin-blue');
        }
    }
}

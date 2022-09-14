/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：PortalData
 * @summary：平台首页，相关配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-05-28
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';


export class PortalData {
    static readonly columns: any[] = [
        {
            title: '新闻中心', id: '11', level: 1,
            children: [
                { title: '公司新闻', id: '111' },
                // { title: '行业动态', id: '113' },
                { title: '监控政策', id: '114' },
            ]
        },
      {
        title: '关于我们', id: '16', level: 1,
        children: [
          { title: '企业大事记', id: '169' },
        ]
      },
      // {
      //   title: '新闻与通知', id: '11', level: 1,
      //   children: [
      //     { title: '平台新闻', id: '111' },
      //     { title: '平台通知', id: '112' },
      //     { title: '行业动态', id: '113' },
      //     { title: '监控政策', id: '114' },
      //     { title: '企业大事记', id: '115' },
      //   ]
      // },
        // {
        //     title: '平台守则', id: '21', level: 1
        // },
        // {
        //     title: '业务指引', id: '22', level: 1,
        //     children: [
        //         { title: '法律法规', id: '221' },
        //         { title: '深圳地方规定', id: '222' }
        //     ]
        // },
        // // {
        // //     title: '帮助中心', id: '23', level: 1,
        // //     children: [
        // //         { title: '注册', id: '232' },
        // //         { title: '出票登记', id: '231' },
        // //         { title: '保理申请', id: '233' },
        // //         { title: '电票指南', id: '234' },
        // //         { title: '问题汇总', id: '235' },
        // //         { title: '数字证书续期', id: '236' },
        // //     ]
        // // },
        // {
        //     title: '关于我们', id: '16', level: 1,
        //     children: [
        //         { title: '平台介绍', id: '161' },
        //         { title: '内设机构', id: '162' },
        //         { title: '人才招聘', id: '163' },
        //         { title: '联系我们', id: '164' },
        //     ]
        // },
    ];

    static readonly columns2: any[] = [
        {
            title: '平台守则', id: '21', level: 1
        },
        {
            title: '业务指引', id: '22', level: 1,
            children: [
                { title: '法律法规', id: '221' },
                { title: '深圳地方规定', id: '222' }
            ]
        },
        // {
        //     title: '帮助中心', id: '23', level: 1,
        //     children: [
        //         { title: '注册', id: '232' },
        //         { title: '出票登记', id: '231' },
        //         { title: '保理申请', id: '233' },
        //         { title: '电票指南', id: '234' },
        //         { title: '问题汇总', id: '235' },
        //         { title: '数字证书续期', id: '236' },
        //     ]
        // },
    ];
    static readonly newcolumns2: any[] = [

        {
            title: '新闻与通知', id: '11', level: 1,
            children: [
                { title: '平台新闻', id: '111' },
                { title: '平台通知', id: '112' },
            ]
        },
        {
            title: '平台守则', id: '21', level: 1
        },
        {
            title: '业务指引', id: '22', level: 1,
            children: [
                { title: '法律法规', id: '221' },
                { title: '深圳地方规定', id: '222' }
            ]
        },
        // {
        //     title: '帮助中心', id: '23', level: 1,
        //     children: [
        //         { title: '注册', id: '232' },
        //         { title: '出票登记', id: '231' },
        //         { title: '保理申请', id: '233' },
        //         { title: '电票指南', id: '234' },
        //         { title: '问题汇总', id: '235' },
        //         { title: '数字证书续期', id: '236' },
        //     ]
        // },
        {
            title: '关于我们', id: '16', level: 1,
            children: [
                { title: '平台介绍', id: '161' },
                { title: '内设机构', id: '162' },
                { title: '人才招聘', id: '163' },
                { title: '联系我们', id: '164' },
            ]
        },
    ]

    static readonly lists = {
        111: [],

        112: [],

        113: [],

        114: [],

        115: [],

        21: [],

        221: [],

        222: [],

        231: [],

        232: [],

        233: [],

        234: [],

        235: [],
        236: [],
        161: [],

        162: [],

        163: [],

        169: [],

        164: [],
    };

    // 直接展示的文章
    static readonly directiveShow: any[] = [
        {
            id: '161',
            articleId: '12',
            title: '平台介绍'
        },
        {
            id: '162',
            articleId: '33',
            title: '内设机构'
        },
        {
            id: '164',
            articleId: '13',
            title: '联系我们'
        },
    ];

    static readonly details = {} as any;


    private static getColumnData(cid: string, includeLists?: boolean): any {
        let column = null;
        const lists = [];
        const nav = [];
        let level;
        for (const col of PortalData.columns) {
            if (col.id === cid) {
                column = col;
                level = 1;
                nav.push({
                    id: col.id,
                    title: col.title
                });

                if (includeLists) {
                    if (PortalData.lists[col.id]) {
                        lists.push({
                            id: col.id,
                            title: col.title,
                            rows: PortalData.lists[col.id]
                        });
                    }

                    for (const child of (col.children || [])) {
                        if (PortalData.lists[child.id]) {
                            lists.push({
                                id: child.id,
                                title: child.title,
                                rows: PortalData.lists[child.id]
                            });
                        }
                    }
                }
                break;
            }

            for (const child of (col.children || [])) {
                if (child.id === cid) {
                    column = col;
                    level = 2;
                    nav.push({
                        id: col.id,
                        title: col.title
                    });
                    nav.push({
                        id: child.id,
                        title: child.title
                    });

                    if (includeLists) {
                        if (PortalData.lists[cid]) {
                            lists.push({
                                id: child.id,
                                title: child.title,
                                rows: PortalData.lists[child.id]
                            });
                        }
                    }
                    break;
                }
            }
        }

        return {
            id: cid,
            level,
            nav,
            column,
            lists
        };
    }

    /**
     * 获取column信息
     * @param cid column id
     * @returns {any}
     */
    static getColumn(cid: string): Observable<any> {
        return of(PortalData.getColumnData(cid, true));
    }


    /**
     * 获取文章详情
     * @param aid
     */
    static getDetail(aid: string): Observable<any> {
        const detail = PortalData.details[aid];
        if (!detail) {
            return of({
                ret: 99903
            });
        }

        const column = PortalData.getColumnData(detail.cid, false);
        return of({
            id: aid,
            nav: column.nav,
            title: detail.title,
            date: detail.date,
            data: detail.data,
            attachments: detail.attachments
        });
    }


    /**
     * 获取直接展示的文章的ID，先判断要不要进来获取文章
     * @param cid
     */
    static getDirectiveColumn(cid: string) {
        const lists = [];

        // 如果匹配成功，则返回想对应的直接展示的文章
        for (const show of PortalData.directiveShow) {
            if (show.id === cid) {
                lists.push({
                    id: show.id,
                    articleId: show.articleId,
                    title: show.title
                });
            }
        }
        return lists;
    }

    /**
     * 返回想对应的直接展示的文章数组
     */
    static getDirectiveNav(): any {
        const lists = [];
        for (const show of PortalData.directiveShow) {
            lists.push(show.id);
        }
        return lists;
    }

    /**
     * 通过id获取title
     */
    static getTitle(cid): any {
        let title = '';
        for (const column of PortalData.columns) {
            if (column && column.children) {
                for (const child of column.children) {
                    if (child.id === cid) {
                        title = child.title;
                    }
                }
            }
        }
        return title;
    }

    static getTitles(): any {
        return PortalData.columns.map(v => v.title);
    }
}

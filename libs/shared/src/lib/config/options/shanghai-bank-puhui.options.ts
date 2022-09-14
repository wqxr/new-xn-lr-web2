/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\config\options\shanghai-bank-puhui.optins.ts
* @summary：上海银行普惠开户用到的options
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2022-02-14
***************************************************************************/

import { NzCascaderOption } from "ng-zorro-antd/cascader";
import { SelectItemsModel } from "../checkers";

/** 企业规模 */
export const ComDibilityLimit: SelectItemsModel[] = [
  { label: '微型（少于15人）', value: 'T' },
  { label: '小型（15-150人）', value: 'S' },
  { label: '中型（150-2000人）', value: 'M' },
  { label: '大型（2000人以上）', value: 'L' },
];

/** 企业类别 */
export const CustType: SelectItemsModel[] = [
  { value: 3000, label: '国有企业-内资' },
  { value: 3010, label: '集体企业-内资' },
  { value: 3011, label: '城镇企业' },
  { value: 3012, label: '乡镇企业' },
  { value: 3020, label: '股份合作企业-内资' },
  { value: 3031, label: '国有联营企业' },
  { value: 3032, label: '集体联营企业' },
  { value: 3033, label: '国有与集体联营企业' },
  { value: 3039, label: '其他联营企业' },
  { value: 3041, label: '国有独资公司' },
  { value: 3049, label: '其他有限责任公司' },
  { value: 3050, label: '股份有限公司-内资' },
  { value: 3061, label: '私营独资企业' },
  { value: 3062, label: '私营合伙企业' },
  { value: 3063, label: '私营有限责任公司' },
  { value: 3064, label: '私营股份有限公司' },
  { value: 3099, label: '其他企业-内资' },
  { value: 3101, label: '合资经营企业-港资' },
  { value: 3102, label: '合资经营企业-澳资' },
  { value: 3103, label: '合资经营企业-台资' },
  { value: 3104, label: '合作经营企业-港资' },
  { value: 3105, label: '合作经营企业-澳资' },
  { value: 3106, label: '合作经营企业-台资' },
  { value: 3107, label: '港商独资经营企业' },
  { value: 3108, label: '澳商独资经营企业' },
  { value: 3109, label: '台商独资经营企业' },
  { value: 3110, label: '港商投资股份有限公司' },
  { value: 3111, label: '澳商投资股份有限公司' },
  { value: 3112, label: '台商投资股份有限公司' },
  { value: 3201, label: '中外合资经营企业' },
  { value: 3202, label: '中外合作经营企业' },
  { value: 3203, label: '外资企业' },
  { value: 3204, label: '外商投资股份有限公司' },
] as SelectItemsModel[];

/** 所在行业 */
export const Industry: NzCascaderOption[] = [
  {
    value: 'A0000', label: '农、林、牧、渔业', children: [
      {
        value: 'A0100', label: '农业', children: [
          {
            value: 'A0110', label: '谷物种植', children: [
              { value: 'A0111', label: '稻谷种植', isLeaf: true, },
              { value: 'A0112', label: '小麦种植', isLeaf: true, },
              { value: 'A0113', label: '玉米种植', isLeaf: true, },
              { value: 'A0119', label: '其他谷物种植', isLeaf: true, },
            ]
          },
          {
            value: 'A0120', label: '豆类、油料和薯类种植', children: [
              { value: 'A0121', label: '豆类种植', isLeaf: true, },
              { value: 'A0122', label: '油料种植', isLeaf: true, },
              { value: 'A0123', label: '薯类种植', isLeaf: true, },
            ],
          },
          {
            value: 'A0130', label: '棉、麻、糖、烟草种植', children: [
              { value: 'A0131', label: '棉花种植', isLeaf: true, },
              { value: 'A0132', label: '麻类种植', isLeaf: true, },
              { value: 'A0133', label: '糖料种植', isLeaf: true, },
              { value: 'A0134', label: '烟草种植', isLeaf: true, },
            ]
          },
          {
            value: 'A0140', label: '蔬菜、食用菌及园艺作物种植', children: [
              { value: 'A0141', label: '蔬菜种植', isLeaf: true, },
              { value: 'A0142', label: '食用菌种植', isLeaf: true, },
              { value: 'A0143', label: '花卉种植', isLeaf: true, },
              { value: 'A0149', label: '其他园艺作物种植', isLeaf: true, },
            ]
          },
          {
            value: 'A0150', label: '水果种植', children: [
              { value: 'A0151', label: '仁果类和核果类水果种植', isLeaf: true, },
              { value: 'A0152', label: '葡萄种植', isLeaf: true, },
              { value: 'A0153', label: '柑橘类种植', isLeaf: true, },
              { value: 'A0154', label: '香蕉等亚热带水果种植', isLeaf: true, },
              { value: 'A0159', label: '其他水果种植', isLeaf: true, },
            ]
          },
          {
            value: 'A0160', label: '坚果、含油果、香料和饮料作物种植', children: [
              { value: 'A0161', label: '坚果种植', isLeaf: true, },
              { value: 'A0162', label: '含油果种植', isLeaf: true, },
              { value: 'A0163', label: '香料作物种植', isLeaf: true, },
              { value: 'A0164', label: '茶叶种植', isLeaf: true, },
              { value: 'A0169', label: '其他饮料作物种植', isLeaf: true, },
            ]
          },
          {
            value: 'A0170', label: '中药材种植', children: [
              { value: 'A0171', label: '中草药种植', isLeaf: true, },
              { value: 'A0179', label: '其他中药材种植', isLeaf: true, },
            ]
          },
          {
            value: 'A0180', label: '草种植及割草', children: [
              { value: 'A0181', label: '草种植', isLeaf: true, },
              { value: 'A0182', label: '天然草原割草', isLeaf: true, },
            ]
          },
          { value: 'A0190', label: '其他农业', isLeaf: true, },
        ]
      },
      {
        value: 'A0200', label: '林业', children: [
          {
            value: 'A0210', label: '林木育种和育苗', children: [
              { value: 'A0211', label: '林木育种', isLeaf: true, },
              { value: 'A0212', label: '林木育苗', isLeaf: true, },
              { value: 'A0220', label: '造林和更新', isLeaf: true, },
            ]
          },
          {
            value: 'A0230', label: '森林经营、管护和改培', children: [
              { value: 'A0231', label: '森林经营和管护', isLeaf: true, },
              { value: 'A0232', label: '森林改培', isLeaf: true, },
            ]
          },
          {
            value: 'A0240', label: '木材和竹材采运', children: [
              { value: 'A0241', label: '木材采运', isLeaf: true, },
              { value: 'A0242', label: '竹材采运', isLeaf: true, },
            ]
          },
          {
            value: 'A0250', label: '林产品采集', children: [
              { value: 'A0251', label: '木竹材林产品采集', isLeaf: true, },
              { value: 'A0252', label: '非木竹材林产品采集', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'A0300', label: '畜牧业', children: [
          {
            value: 'A0310', label: '牲畜饲养', children: [
              { value: 'A0311', label: '牛的饲养', isLeaf: true, },
              { value: 'A0312', label: '马的饲养', isLeaf: true, },
              { value: 'A0313', label: '猪的饲养', isLeaf: true, },
              { value: 'A0314', label: '羊的饲养', isLeaf: true, },
              { value: 'A0315', label: '骆驼饲养', isLeaf: true, },
              { value: 'A0319', label: '其他牲畜饲养', isLeaf: true, },
            ]
          },
          {
            value: 'A0320', label: '家禽饲养', children: [
              { value: 'A0321', label: '鸡的饲养', isLeaf: true, },
              { value: 'A0322', label: '鸭的饲养', isLeaf: true, },
              { value: 'A0323', label: '鹅的饲养', isLeaf: true, },
              { value: 'A0329', label: '其他家禽饲养', isLeaf: true, },
            ]
          },
          { value: 'A0330', label: '狩猎和捕捉动物', isLeaf: true, },
          {
            value: 'A0390', label: '其他畜牧业', children: [
              { value: 'A0391', label: '兔的饲养', isLeaf: true, },
              { value: 'A0392', label: '蜜蜂饲养', isLeaf: true, },
              { value: 'A0399', label: '其他未列明畜牧业', isLeaf: true, },
            ]
          },

        ]
      },
      {
        value: 'A0400', label: '渔业', children: [
          {
            value: 'A0410', label: '水产养殖', children: [
              { value: 'A0411', label: '海水养殖', isLeaf: true, },
              { value: 'A0412', label: '内陆养殖', isLeaf: true, },
            ]
          },
          {
            value: 'A0420', label: '水产捕捞', children: [
              { value: 'A0421', label: '海水捕捞', isLeaf: true, },
              { value: 'A0422', label: '内陆捕捞', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'A0500', label: '农、林、牧、渔专业及辅助性活动', children: [
          {
            value: 'A0510', label: '农业专业及辅助性活动', children: [
              { value: 'A0511', label: '种子种苗培育活动', isLeaf: true, },
              { value: 'A0512', label: '农业机械活动', isLeaf: true, },
              { value: 'A0513', label: '灌溉活动', isLeaf: true, },
              { value: 'A0514', label: '农产品初加工活动', isLeaf: true, },
              { value: 'A0515', label: '农作物病虫害防治活动', isLeaf: true, },
              { value: 'A0519', label: '其他农业专业及辅助性活动', isLeaf: true, },
            ]
          },
          {
            value: 'A0520', label: '林业专业及辅助性活动', children: [
              { value: 'A0521', label: '林业有害生物防治活动', isLeaf: true, },
              { value: 'A0522', label: '森林防火活动', isLeaf: true, },
              { value: 'A0523', label: '林产品初级加工活动', isLeaf: true, },
              { value: 'A0529', label: '其他林业专业及辅助性活动', isLeaf: true, },
            ]
          },
          {
            value: 'A0530', label: '畜牧专业及辅助性活动', children: [
              { value: 'A0531', label: '畜牧良种繁殖活动', isLeaf: true, },
              { value: 'A0532', label: '畜禽粪污处理活动', isLeaf: true, },
              { value: 'A0539', label: '其他畜牧专业及辅助性活动', isLeaf: true, },
            ]
          },
          {
            value: 'A0540', label: '渔业专业及辅助性活动', children: [
              { value: 'A0541', label: '鱼苗及鱼种场活动', isLeaf: true, },
              { value: 'A0549', label: '其他渔业专业及辅助性活动', isLeaf: true, },
            ]
          },
        ]
      },
    ]
  },
  {
    value: 'B0000', label: '采矿业', children: [
      {
        value: 'B0600', label: '煤炭开采和洗选业', children: [
          { value: 'B0610', label: '烟煤和无烟煤开采洗选', isLeaf: true, },
          { value: 'B0620', label: '褐煤开采洗选', isLeaf: true, },
          { value: 'B0690', label: '其他煤炭采选', isLeaf: true, },
        ]
      },
      {
        value: 'B0700', label: '石油和天然气开采业', children: [
          {
            value: 'B0710', label: '石油开采', children: [
              { value: 'B0711', label: '陆地石油开采', isLeaf: true, },
              { value: 'B0712', label: '海洋石油开采', isLeaf: true, },
            ]
          },
          {
            value: 'B0720', label: '天然气开采', children: [
              { value: 'B0721', label: '陆地天然气开采', isLeaf: true, },
              { value: 'B0722', label: '海洋天然气及可燃冰开采', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'B0800', label: '黑色金属矿采选业', children: [
          { value: 'B0810', label: '铁矿采选', isLeaf: true, },
          { value: 'B0820', label: '锰矿、铬矿采选', isLeaf: true, },
          { value: 'B0890', label: '其他黑色金属矿采选', isLeaf: true, },
        ]
      },
      {
        value: 'B0900', label: '有色金属矿采选业', children: [
          {
            value: 'B0910', label: '常用有色金属矿采选', children: [
              { value: 'B0911', label: '铜矿采选', isLeaf: true, },
              { value: 'B0912', label: '铅锌矿采选', isLeaf: true, },
              { value: 'B0913', label: '镍钴矿采选', isLeaf: true, },
              { value: 'B0914', label: '锡矿采选', isLeaf: true, },
              { value: 'B0915', label: '锑矿采选', isLeaf: true, },
              { value: 'B0916', label: '铝矿采选', isLeaf: true, },
              { value: 'B0917', label: '镁矿采选', isLeaf: true, },
              { value: 'B0919', label: '其他常用有色金属矿采选', isLeaf: true, },
            ]
          },
          {
            value: 'B0920', label: '贵金属矿采选', children: [
              { value: 'B0921', label: '金矿采选', isLeaf: true, },
              { value: 'B0922', label: '银矿采选', isLeaf: true, },
              { value: 'B0929', label: '其他贵金属矿采选', isLeaf: true, },
            ]
          },
          {
            value: 'B0930', label: '稀有稀土金属矿采选', children: [
              { value: 'B0931', label: '钨钼矿采选', isLeaf: true, },
              { value: 'B0932', label: '稀土金属矿采选', isLeaf: true, },
              { value: 'B0933', label: '放射性金属矿采选', isLeaf: true, },
              { value: 'B0939', label: '其他稀有金属矿采选', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'B1000', label: '非金属矿采选业', children: [
          {
            value: 'B1010', label: '土砂石开采', children: [
              { value: 'B1011', label: '石灰石、石膏开采', isLeaf: true, },
              { value: 'B1012', label: '建筑装饰用石开采', isLeaf: true, },
              { value: 'B1013', label: '耐火土石开采', isLeaf: true, },
              { value: 'B1019', label: '粘土及其他土砂石开采', isLeaf: true, },
            ]
          },
          { value: 'B1020', label: '化学矿开采', isLeaf: true, },
          { value: 'B1030', label: '采盐', isLeaf: true, },
          {
            value: 'B1090', label: '石棉及其他非金属矿采选', children: [
              { value: 'B1091', label: '石棉、云母矿采选', isLeaf: true, },
              { value: 'B1092', label: '石墨、滑石采选', isLeaf: true, },
              { value: 'B1093', label: '宝石、玉石采选', isLeaf: true, },
              { value: 'B1099', label: '其他未列明非金属矿采选', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'B1100', label: '开采专业及辅助性活动', children: [
          { value: 'B1110', label: '煤炭开采和洗选专业及辅助性活动', isLeaf: true, },
          { value: 'B1120', label: '石油和天然气开采专业及辅助性活动', isLeaf: true, },
          { value: 'B1190', label: '其他开采专业及辅助性活动', isLeaf: true, },
        ]
      },
      {
        value: 'B1200', label: '其他采矿业', children: [
          { value: 'B1200', label: '其他采矿业', isLeaf: true, }
        ]
      },
    ]
  },
  {
    value: 'C0000', label: '制造业', children: [
      {
        value: 'C1300', label: '农副食品加工业', children: [
          {
            value: 'C1310', label: '谷物磨制', children: [
              { value: 'C1311', label: '稻谷加工', isLeaf: true },
              { value: 'C1312', label: '小麦加工', isLeaf: true },
              { value: 'C1313', label: '玉米加工', isLeaf: true },
              { value: 'C1314', label: '杂粮加工', isLeaf: true },
              { value: 'C1319', label: '其他谷物磨制', isLeaf: true },
            ]
          },
          {
            value: 'C1320', label: '饲料加工', children: [
              { value: 'C1321', label: '宠物饲料加工', isLeaf: true },
              { value: 'C1329', label: '其他饲料加工', isLeaf: true },
            ]
          },
          {
            value: 'C1330', label: '植物油加工', children: [
              { value: 'C1331', label: '食用植物油加工', isLeaf: true },
              { value: 'C1332', label: '非食用植物油加工', isLeaf: true },
            ]
          },
          { value: 'C1340', label: '制糖业', isLeaf: true },
          {
            value: 'C1350', label: '屠宰及肉类加工', children: [
              { value: 'C1351', label: '牲畜屠宰', isLeaf: true },
              { value: 'C1352', label: '禽类屠宰', isLeaf: true },
              { value: 'C1353', label: '肉制品及副产品加工', isLeaf: true },
            ]
          },
          {
            value: 'C1360', label: '水产品加工', children: [
              { value: 'C1361', label: '水产品冷冻加工', isLeaf: true },
              { value: 'C1362', label: '鱼糜制品及水产品干腌制加工', isLeaf: true },
              { value: 'C1363', label: '鱼油提取及制品制造', isLeaf: true },
              { value: 'C1369', label: '其他水产品加工', isLeaf: true },
            ]
          },
          {
            value: 'C1370', label: '蔬菜、菌类、水果和坚果加工', children: [
              { value: 'C1371', label: '蔬菜加工', isLeaf: true },
              { value: 'C1372', label: '食用菌加工', isLeaf: true },
              { value: 'C1373', label: '水果和坚果加工', isLeaf: true },
            ]
          },
          {
            value: 'C1390', label: '其他农副食品加工', children: [
              { value: 'C1391', label: '淀粉及淀粉制品制造', isLeaf: true },
              { value: 'C1392', label: '豆制品制造', isLeaf: true },
              { value: 'C1393', label: '蛋品加工', isLeaf: true },
              { value: 'C1399', label: '其他未列明农副食品加工', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C1400', label: '食品制造业', children: [
          {
            value: 'C1410', label: '焙烤食品制造', children: [
              { value: 'C1411', label: '糕点、面包制造', isLeaf: true, },
              { value: 'C1419', label: '饼干及其他焙烤食品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1420', label: '糖果、巧克力及蜜饯制造', children: [
              { value: 'C1421', label: '糖果、巧克力制造', isLeaf: true, },
              { value: 'C1422', label: '蜜饯制作', isLeaf: true, },
            ]
          },
          {
            value: 'C1430', label: '方便食品制造', children: [
              { value: 'C1431', label: '米、面制品制造', isLeaf: true, },
              { value: 'C1432', label: '速冻食品制造', isLeaf: true, },
              { value: 'C1433', label: '方便面制造', isLeaf: true, },
              { value: 'C1439', label: '其他方便食品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1440', label: '乳制品制造', children: [
              { value: 'C1441', label: '液体乳制造', isLeaf: true, },
              { value: 'C1442', label: '乳粉制造', isLeaf: true, },
              { value: 'C1449', label: '其他乳制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1450', label: '罐头食品制造', children: [
              { value: 'C1451', label: '肉、禽类罐头制造', isLeaf: true, },
              { value: 'C1452', label: '水产品罐头制造', isLeaf: true, },
              { value: 'C1453', label: '蔬菜、水果罐头制造', isLeaf: true, },
              { value: 'C1459', label: '其他罐头食品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1460', label: '调味品、发酵制品制造', children: [
              { value: 'C1461', label: '味精制造', isLeaf: true, },
              { value: 'C1462', label: '酱油、食醋及类似制品制造', isLeaf: true, },
              { value: 'C1469', label: '其他调味品、发酵制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1490', label: '其他食品制造', children: [
              { value: 'C1491', label: '营养食品制造', isLeaf: true, },
              { value: 'C1492', label: '保健食品制造', isLeaf: true, },
              { value: 'C1493', label: '冷冻饮品及食用冰制造', isLeaf: true, },
              { value: 'C1494', label: '盐加工', isLeaf: true, },
              { value: 'C1495', label: '食品及饲料添加剂制造', isLeaf: true, },
              { value: 'C1499', label: '其他未列明食品制造', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'C1500', label: '酒、饮料及精制茶制造业', children: [
          {
            value: 'C1510', label: '酒的制造', children: [
              { value: 'C1511', label: '酒精制造', isLeaf: true, },
              { value: 'C1512', label: '白酒制造', isLeaf: true, },
              { value: 'C1513', label: '啤酒制造', isLeaf: true, },
              { value: 'C1514', label: '黄酒制造', isLeaf: true, },
              { value: 'C1515', label: '葡萄酒制造', isLeaf: true, },
              { value: 'C1519', label: '其他酒制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1520', label: '饮料制造', children: [
              { value: 'C1521', label: '碳酸饮料制造', isLeaf: true, },
              { value: 'C1522', label: '瓶（罐）装饮用水制造', isLeaf: true, },
              { value: 'C1523', label: '果菜汁及果菜汁饮料制造', isLeaf: true, },
              { value: 'C1524', label: '含乳饮料和植物蛋白饮料制造', isLeaf: true, },
              { value: 'C1525', label: '固体饮料制造', isLeaf: true, },
              { value: 'C1529', label: '茶饮料及其他饮料制造', isLeaf: true, },
            ]
          },
          { value: 'C1530', label: '精制茶加工', isLeaf: true, },
        ]
      },
      {
        value: 'C1600', label: '烟草制品业', children: [
          { value: 'C1610', label: '烟叶复烤', isLeaf: true, },
          { value: 'C1620', label: '卷烟制造', isLeaf: true, },
          { value: 'C1690', label: '其他烟草制品制造', isLeaf: true, },
        ]
      },
      {
        value: 'C1700', label: '纺织业', children: [
          {
            value: 'C1710', label: '棉纺织及印染精加工', children: [
              { value: 'C1711', label: '棉纺纱加工', isLeaf: true, },
              { value: 'C1712', label: '棉织造加工', isLeaf: true, },
              { value: 'C1713', label: '棉印染精加工', isLeaf: true, },
            ]
          },
          {
            value: 'C1720', label: '毛纺织及染整精加工', children: [
              { value: 'C1721', label: '毛条和毛纱线加工', isLeaf: true, },
              { value: 'C1722', label: '毛织造加工', isLeaf: true, },
              { value: 'C1723', label: '毛染整精加工', isLeaf: true, },
            ]
          },
          {
            value: 'C1730', label: '麻纺织及染整精加工', children: [
              { value: 'C1731', label: '麻纤维纺前加工和纺纱', isLeaf: true, },
              { value: 'C1732', label: '麻织造加工', isLeaf: true, },
              { value: 'C1733', label: '麻染整精加工', isLeaf: true, },
            ]
          },
          {
            value: 'C1740', label: '丝绢纺织及印染精加工', children: [
              { value: 'C1741', label: '缫丝加工', isLeaf: true, },
              { value: 'C1742', label: '绢纺和丝织加工', isLeaf: true, },
              { value: 'C1743', label: '丝印染精加工', isLeaf: true, },
            ]
          },
          {
            value: 'C1750', label: '化纤织造及印染精加工', children: [
              { value: 'C1751', label: '化纤织造加工', isLeaf: true, },
              { value: 'C1752', label: '化纤织物染整精加工', isLeaf: true, },
            ]
          },
          {
            value: 'C1760', label: '针织或钩针编织物及其制品制造', children: [
              { value: 'C1761', label: '针织或钩针编织物织造', isLeaf: true, },
              { value: 'C1762', label: '针织或钩针编织物印染精加工', isLeaf: true, },
              { value: 'C1763', label: '针织或钩针编织品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1770', label: '家用纺织制成品制造', children: [
              { value: 'C1771', label: '床上用品制造', isLeaf: true, },
              { value: 'C1772', label: '毛巾类制品制造', isLeaf: true, },
              { value: 'C1773', label: '窗帘、布艺类产品制造', isLeaf: true, },
              { value: 'C1779', label: '其他家用纺织制成品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1780', label: '产业用纺织制成品制造', children: [
              { value: 'C1781', label: '非织造布制造', isLeaf: true, },
              { value: 'C1782', label: '绳、索、缆制造', isLeaf: true, },
              { value: 'C1783', label: '纺织带和帘子布制造', isLeaf: true, },
              { value: 'C1784', label: '篷、帆布制造', isLeaf: true, },
              { value: 'C1789', label: '其他产业用纺织制成品制造', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'C1800', label: '纺织服装、服饰业', children: [
          {
            value: 'C1810', label: '机织服装制造', children: [
              { value: 'C1811', label: '运动机织服装制造', isLeaf: true, },
              { value: 'C1819', label: '其他机织服装制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1820', label: '针织或钩针编织服装制造', children: [
              { value: 'C1821', label: '运动休闲针织服装制造', isLeaf: true, },
              { value: 'C1829', label: '其他针织或钩针编织服装制造', isLeaf: true, },
            ]
          },
          { value: 'C1830', label: '服饰制造', isLeaf: true, },
        ]
      },
      {
        value: 'C1900', label: '皮革、毛皮、羽毛及其制品和制鞋业', children: [
          { value: 'C1910', label: '皮革鞣制加工', isLeaf: true, },
          {
            value: 'C1920', label: '皮革制品制造', children: [
              { value: 'C1921', label: '皮革服装制造', isLeaf: true, },
              { value: 'C1922', label: '皮箱、包(袋)制造', isLeaf: true, },
              { value: 'C1923', label: '皮手套及皮装饰制品制造', isLeaf: true, },
              { value: 'C1929', label: '其他皮革制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C1930', label: '毛皮鞣制及制品加工', children: [
              { value: 'C1931', label: '毛皮鞣制加工', isLeaf: true, },
              { value: 'C1932', label: '毛皮服装加工', isLeaf: true, },
              { value: 'C1939', label: '其他毛皮制品加工', isLeaf: true, },
            ]
          },
          {
            value: 'C1940', label: '羽毛(绒)加工及制品制造', children: [
              { value: 'C1941', label: '羽毛(绒)加工', isLeaf: true, },
              { value: 'C1942', label: '羽毛(绒)制品加工', isLeaf: true, },
            ]
          },
          {
            value: 'C1950', label: '制鞋业', children: [
              { value: 'C1951', label: '纺织面料鞋制造', isLeaf: true, },
              { value: 'C1952', label: '皮鞋制造', isLeaf: true, },
              { value: 'C1953', label: '塑料鞋制造', isLeaf: true, },
              { value: 'C1954', label: '橡胶鞋制造', isLeaf: true, },
              { value: 'C1959', label: '其他制鞋业', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'C2000', label: '木材加工和木、竹、藤、棕、草制品业', children: [
          {
            value: 'C2010', label: '木材加工', children: [
              { value: 'C2011', label: '锯材加工', isLeaf: true, },
              { value: 'C2012', label: '木片加工', isLeaf: true, },
              { value: 'C2013', label: '单板加工', isLeaf: true, },
              { value: 'C2019', label: '其他木材加工', isLeaf: true, },
            ]
          },
          {
            value: 'C2020', label: '人造板制造', children: [
              { value: 'C2021', label: '胶合板制造', isLeaf: true, },
              { value: 'C2022', label: '纤维板制造', isLeaf: true, },
              { value: 'C2023', label: '刨花板制造', isLeaf: true, },
              { value: 'C2029', label: '其他人造板制造', isLeaf: true, },
            ]
          },
          {
            value: 'C2030', label: '木制品制造', children: [
              { value: 'C2031', label: '建筑用木料及木材组件加工', isLeaf: true, },
              { value: 'C2032', label: '木门窗制造', isLeaf: true, },
              { value: 'C2033', label: '木楼梯制造', isLeaf: true, },
              { value: 'C2034', label: '木地板制造', isLeaf: true, },
              { value: 'C2035', label: '木制容器制造', isLeaf: true, },
              { value: 'C2039', label: '软木制品及其他木制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C2040', label: '竹、藤、棕、草制品制造', children: [
              { value: 'C2041', label: '竹制品制造', isLeaf: true, },
              { value: 'C2042', label: '藤制品制造', isLeaf: true, },
              { value: 'C2043', label: '棕制品制造', isLeaf: true, },
              { value: 'C2049', label: '草及其他制品制造', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'C2100', label: '家具制造业', children: [
          { value: 'C2110', label: '木质家具制造', isLeaf: true, },
          { value: 'C2120', label: '竹、藤家具制造', isLeaf: true, },
          { value: 'C2130', label: '金属家具制造', isLeaf: true, },
          { value: 'C2140', label: '塑料家具制造', isLeaf: true, },
          { value: 'C2190', label: '其他家具制造', isLeaf: true, },
        ]
      },
      {
        value: 'C2200', label: '造纸和纸制品业', children: [
          {
            value: 'C2210', label: '纸浆制造', children: [
              { value: 'C2211', label: '木竹浆制造', isLeaf: true },
              { value: 'C2212', label: '非木竹浆制造', isLeaf: true },
            ]
          },
          {
            value: 'C2220', label: '造纸', children: [
              { value: 'C2221', label: '机制纸及纸板制造', isLeaf: true },
              { value: 'C2222', label: '手工纸制造', isLeaf: true },
              { value: 'C2223', label: '加工纸制造', isLeaf: true },
            ]
          },
          {
            value: 'C2230', label: '纸制品制造', children: [
              { value: 'C2231', label: '纸和纸板容器制造', isLeaf: true },
              { value: 'C2239', label: '其他纸制品制造', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C2300', label: '印刷和记录媒介复制业', children: [
          {
            value: 'C2310', label: '印刷', children: [
              { value: 'C2311', label: '书、报刊印刷', isLeaf: true },
              { value: 'C2312', label: '本册印制', isLeaf: true },
              { value: 'C2319', label: '包装装潢及其他印刷', isLeaf: true },
            ]
          },
          { value: 'C2320', label: '装订及印刷相关服务', isLeaf: true },
          { value: 'C2330', label: '记录媒介复制', isLeaf: true },
        ]
      },
      {
        value: 'C2400', label: '文教、工美、体育和娱乐用品制造业', children: [
          {
            value: 'C2410', label: '文教办公用品制造', children: [
              { value: 'C2411', label: '文具制造', isLeaf: true },
              { value: 'C2412', label: '笔的制造', isLeaf: true },
              { value: 'C2413', label: '教学用模型及教具制造', isLeaf: true },
              { value: 'C2414', label: '墨水、墨汁制造', isLeaf: true },
              { value: 'C2419', label: '其他文教办公用品制造', isLeaf: true },
            ]
          },
          {
            value: 'C2420', label: '乐器制造', children: [
              { value: 'C2421', label: '中乐器制造', isLeaf: true },
              { value: 'C2422', label: '西乐器制造', isLeaf: true },
              { value: 'C2423', label: '电子乐器制造', isLeaf: true },
              { value: 'C2429', label: '其他乐器及零件制造', isLeaf: true },
            ]
          },
          {
            value: 'C2430', label: '工艺美术及礼仪用品制造', children: [
              { value: 'C2431', label: '雕塑工艺品制造', isLeaf: true },
              { value: 'C2432', label: '金属工艺品制造', isLeaf: true },
              { value: 'C2433', label: '漆器工艺品制造', isLeaf: true },
              { value: 'C2434', label: '花画工艺品制造', isLeaf: true },
              { value: 'C2435', label: '天然植物纤维编织工艺品制造', isLeaf: true },
              { value: 'C2436', label: '抽纱刺绣工艺品制造', isLeaf: true },
              { value: 'C2437', label: '地毯、挂毯制造', isLeaf: true },
              { value: 'C2438', label: '珠宝首饰及有关物品制造', isLeaf: true },
              { value: 'C2439', label: '其他工艺美术及礼仪用品制造', isLeaf: true },
            ]
          },
          {
            value: 'C2440', label: '体育用品制造', children: [
              { value: 'C2441', label: '球类制造', isLeaf: true },
              { value: 'C2442', label: '专项运动器材及配件制造', isLeaf: true },
              { value: 'C2443', label: '健身器材制造', isLeaf: true },
              { value: 'C2444', label: '运动防护用具制造', isLeaf: true },
              { value: 'C2449', label: '其他体育用品制造', isLeaf: true },
            ]
          },
          {
            value: 'C2450', label: '玩具制造', children: [
              { value: 'C2451', label: '电玩具制造', isLeaf: true },
              { value: 'C2452', label: '塑胶玩具制造', isLeaf: true },
              { value: 'C2453', label: '金属玩具制造', isLeaf: true },
              { value: 'C2454', label: '弹射玩具制造', isLeaf: true },
              { value: 'C2455', label: '娃娃玩具制造', isLeaf: true },
              { value: 'C2456', label: '儿童乘骑玩耍的童车类产品制造', isLeaf: true },
              { value: 'C2459', label: '其他玩具制造', isLeaf: true },
            ]
          },
          {
            value: 'C2460', label: '游艺器材及娱乐用品制造', children: [
              { value: 'C2461', label: '露天游乐场所游乐设备制造', isLeaf: true },
              { value: 'C2462', label: '游艺用品及室内游艺器材制造', isLeaf: true },
              { value: 'C2469', label: '其他娱乐用品制造', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C2500', label: '石油、煤炭及其他燃料加工业', children: [
          {
            value: 'C2510', label: '精炼石油产品制造', children: [
              { value: 'C2511', label: '原油加工及石油制品制造', isLeaf: true },
              { value: 'C2519', label: '其他原油制造', isLeaf: true },
            ]
          },
          {
            value: 'C2520', label: '煤炭加工', children: [
              { value: 'C2521', label: '炼焦', isLeaf: true },
              { value: 'C2522', label: '煤制合成气生产', isLeaf: true },
              { value: 'C2523', label: '煤制液体燃料生产', isLeaf: true },
              { value: 'C2524', label: '煤制品制造', isLeaf: true },
              { value: 'C2529', label: '其他煤炭加工', isLeaf: true },
            ]
          },
          { value: 'C2530', label: '核燃料加工', isLeaf: true },
          {
            value: 'C2540', label: '生物质燃料加工', children: [
              { value: 'C2541', label: '生物质液体燃料生产', isLeaf: true },
              { value: 'C2542', label: '生物质致密成型燃料加工', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C2600', label: '化学原料和化学制品制造业', children: [
          {
            value: 'C2610', label: '基础化学原料制造', children: [
              { value: 'C2611', label: '无机酸制造', isLeaf: true },
              { value: 'C2612', label: '无机碱制造', isLeaf: true },
              { value: 'C2613', label: '无机盐制造', isLeaf: true },
              { value: 'C2614', label: '有机化学原料制造', isLeaf: true },
              { value: 'C2619', label: '其他基础化学原料制造', isLeaf: true },
            ]
          },
          {
            value: 'C2620', label: '肥料制造', children: [
              { value: 'C2621', label: '氮肥制造', isLeaf: true },
              { value: 'C2622', label: '磷肥制造', isLeaf: true },
              { value: 'C2623', label: '钾肥制造', isLeaf: true },
              { value: 'C2624', label: '复混肥料制造', isLeaf: true },
              { value: 'C2625', label: '有机肥料及微生物肥料制造', isLeaf: true },
              { value: 'C2629', label: '其他肥料制造', isLeaf: true },
            ]
          },
          {
            value: 'C2630', label: '农药制造', children: [
              { value: 'C2631', label: '化学农药制造', isLeaf: true },
              { value: 'C2632', label: '生物化学农药及微生物农药制造', isLeaf: true },
            ]
          },
          {
            value: 'C2640', label: '涂料、油墨、颜料及类似产品制造', children: [
              { value: 'C2641', label: '涂料制造', isLeaf: true },
              { value: 'C2642', label: '油墨及类似产品制造', isLeaf: true },
              { value: 'C2643', label: '工业颜料制造', isLeaf: true },
              { value: 'C2644', label: '工艺美术颜料制造', isLeaf: true },
              { value: 'C2645', label: '染料制造', isLeaf: true },
              { value: 'C2646', label: '密封用填料及类似品制造', isLeaf: true },
            ]
          },
          {
            value: 'C2650', label: '合成材料制造', children: [
              { value: 'C2651', label: '初级形态塑料及合成树脂制造', isLeaf: true },
              { value: 'C2652', label: '合成橡胶制造', isLeaf: true },
              { value: 'C2653', label: '合成纤维单(聚合)体制造', isLeaf: true },
              { value: 'C2659', label: '其他合成材料制造', isLeaf: true },
            ]
          },
          {
            value: 'C2660', label: '专用化学产品制造', children: [
              { value: 'C2661', label: '化学试剂和助剂制造', isLeaf: true },
              { value: 'C2662', label: '专项化学用品制造', isLeaf: true },
              { value: 'C2663', label: '林产化学产品制造', isLeaf: true },
              { value: 'C2664', label: '文化用信息化学品制造', isLeaf: true },
              { value: 'C2665', label: '医学生产用信息化学品制造', isLeaf: true },
              { value: 'C2666', label: '环境污染处理专用药剂材料制造', isLeaf: true },
              { value: 'C2667', label: '动物胶制造', isLeaf: true },
              { value: 'C2669', label: '其他专用化学产品制造', isLeaf: true },
            ]
          },
          {
            value: 'C2670', label: '炸药、火工及焰火产品制造', children: [
              { value: 'C2671', label: '炸药及火工产品制造', isLeaf: true },
              { value: 'C2672', label: '焰火、鞭炮产品制造', isLeaf: true },
            ]
          },
          {
            value: 'C2680', label: '日用化学产品制造', children: [
              { value: 'C2681', label: '肥皂及洗涤剂制造', isLeaf: true },
              { value: 'C2682', label: '化妆品制造', isLeaf: true },
              { value: 'C2683', label: '口腔清洁用品制造', isLeaf: true },
              { value: 'C2684', label: '香料、香精制造', isLeaf: true },
              { value: 'C2689', label: '其他日用化学产品制造', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C2700', label: '医药制造业', children: [
          { value: 'C2710', label: '化学药品原料药制造', isLeaf: true },
          { value: 'C2720', label: '化学药品制剂制造', isLeaf: true },
          { value: 'C2730', label: '中药饮片加工', isLeaf: true },
          { value: 'C2740', label: '中成药生产', isLeaf: true },
          { value: 'C2750', label: '兽用药品制造', isLeaf: true },
          {
            value: 'C2760', label: '生物药品制品制造', children: [
              { value: 'C2761', label: '生物药品制造', isLeaf: true },
              { value: 'C2762', label: '基因工程药物和疫苗制造', isLeaf: true },
            ]
          },
          { value: 'C2770', label: '卫生材料及医药用品制造', isLeaf: true },
          { value: 'C2780', label: '药用辅料及包装材料', isLeaf: true },
        ]
      },
      {
        value: 'C2800', label: '化学纤维制造业', children: [
          {
            value: 'C2810', label: '纤维素纤维原料及纤维制造', children: [
              { value: 'C2811', label: '化纤浆粕制造', isLeaf: true },
              { value: 'C2812', label: '人造纤维（纤维素纤维）制造', isLeaf: true },
            ]
          },
          {
            value: 'C2820', label: '合成纤维制造', children: [
              { value: 'C2821', label: '锦纶纤维制造', isLeaf: true },
              { value: 'C2822', label: '涤纶纤维制造', isLeaf: true },
              { value: 'C2823', label: '腈纶纤维制造', isLeaf: true },
              { value: 'C2824', label: '维纶纤维制造', isLeaf: true },
              { value: 'C2825', label: '丙纶纤维制造', isLeaf: true },
              { value: 'C2826', label: '氨纶纤维制造', isLeaf: true },
              { value: 'C2829', label: '其他合成纤维制造', isLeaf: true },
            ]
          },
          {
            value: 'C2830', label: '生物基材料制造', children: [
              { value: 'C2831', label: '生物基化学纤维制造', isLeaf: true },
              { value: 'C2832', label: '生物基、淀粉基新材料制造', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C2900', label: '橡胶和塑料制品业', children: [
          {
            value: 'C2910', label: '橡胶制品业', children: [
              { value: 'C2911', label: '轮胎制造', isLeaf: true },
              { value: 'C2912', label: '橡胶板、管、带制造', isLeaf: true },
              { value: 'C2913', label: '橡胶零件制造', isLeaf: true },
              { value: 'C2914', label: '再生橡胶制造', isLeaf: true },
              { value: 'C2915', label: '日用及医用橡胶制品制造', isLeaf: true },
              { value: 'C2916', label: '运动场地用塑胶制造', isLeaf: true },
              { value: 'C2919', label: '其他橡胶制品制造', isLeaf: true },
            ]
          },
          {
            value: 'C2920', label: '塑料制品业', children: [
              { value: 'C2921', label: '塑料薄膜制造', isLeaf: true },
              { value: 'C2922', label: '塑料板、管、型材制造', isLeaf: true },
              { value: 'C2923', label: '塑料丝、绳及编织品制造', isLeaf: true },
              { value: 'C2924', label: '泡沫塑料制造', isLeaf: true },
              { value: 'C2925', label: '塑料人造革、合成革制造', isLeaf: true },
              { value: 'C2926', label: '塑料包装箱及容器制造', isLeaf: true },
              { value: 'C2927', label: '日用塑料制品制造', isLeaf: true },
              { value: 'C2928', label: '人造草坪制造', isLeaf: true },
              { value: 'C2929', label: '塑料零件及其他塑料制品制造', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C3000', label: '非金属矿物制品业', children: [
          {
            value: 'C3010', label: '水泥、石灰和石膏制造', children: [
              { value: 'C3011', label: '水泥制造', isLeaf: true, },
              { value: 'C3012', label: '石灰和石膏制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3020', label: '石膏、水泥制品及类似制品制造', children: [
              { value: 'C3021', label: '水泥制品制造', isLeaf: true, },
              { value: 'C3022', label: '砼结构构件制造', isLeaf: true, },
              { value: 'C3023', label: '石棉水泥制品制造', isLeaf: true, },
              { value: 'C3024', label: '轻质建筑材料制造', isLeaf: true, },
              { value: 'C3029', label: '其他水泥类似制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3030', label: '砖瓦、石材等建筑材料制造', children: [
              { value: 'C3031', label: '粘土砖瓦及建筑砌块制造', isLeaf: true, },
              { value: 'C3032', label: '建筑用石加工', isLeaf: true, },
              { value: 'C3033', label: '防水建筑材料制造', isLeaf: true, },
              { value: 'C3034', label: '隔热和隔音材料制造', isLeaf: true, },
              { value: 'C3039', label: '其他建筑材料制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3040', label: '玻璃制造', children: [
              { value: 'C3041', label: '平板玻璃制造', isLeaf: true, },
              { value: 'C3042', label: '特种玻璃制造', isLeaf: true, },
              { value: 'C3049', label: '其他玻璃制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3050', label: '玻璃制品制造', children: [
              { value: 'C3051', label: '技术玻璃制品制造', isLeaf: true, },
              { value: 'C3052', label: '光学玻璃制造', isLeaf: true, },
              { value: 'C3053', label: '玻璃仪器制造', isLeaf: true, },
              { value: 'C3054', label: '日用玻璃制品制造', isLeaf: true, },
              { value: 'C3055', label: '玻璃包装容器制造', isLeaf: true, },
              { value: 'C3056', label: '玻璃保温容器制造', isLeaf: true, },
              { value: 'C3057', label: '制镜及类似品加工', isLeaf: true, },
              { value: 'C3059', label: '其他玻璃制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3060', label: '玻璃纤维和玻璃纤维增强塑料制品制造', children: [
              { value: 'C3061', label: '玻璃纤维及制品制造', isLeaf: true, },
              { value: 'C3062', label: '玻璃纤维增强塑料制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3070', label: '陶瓷制品制造', children: [
              { value: 'C3071', label: '建筑陶瓷制品制造', isLeaf: true, },
              { value: 'C3072', label: '卫生陶瓷制品制造', isLeaf: true, },
              { value: 'C3073', label: '特种陶瓷制品制造', isLeaf: true, },
              { value: 'C3074', label: '日用陶瓷制品制造', isLeaf: true, },
              { value: 'C3075', label: '陈设艺术陶瓷制造', isLeaf: true, },
              { value: 'C3076', label: '园艺陶瓷制造', isLeaf: true, },
              { value: 'C3079', label: '其他陶瓷制品制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3080', label: '耐火材料制品制造', children: [
              { value: 'C3081', label: '石棉制品制造', isLeaf: true, },
              { value: 'C3082', label: '云母制品制造', isLeaf: true, },
              { value: 'C3089', label: '耐火陶瓷制品及其他耐火材料制造', isLeaf: true, },
            ]
          },
          {
            value: 'C3090', label: '石墨及其他非金属矿物制品制造', children: [
              { value: 'C3091', label: '石墨及碳素制品制造', isLeaf: true, },
              { value: 'C3099', label: '其他非金属矿物制品制造', isLeaf: true, },
            ]
          },
        ]
      },
      {
        value: 'C3100', label: '黑色金属冶炼和压延加工业', children: [
          { value: 'C3110', label: '炼铁', isLeaf: true },
          { value: 'C3120', label: '炼钢', isLeaf: true },
          { value: 'C3130', label: '钢压延加工', isLeaf: true },
          { value: 'C3140', label: '铁合金冶炼', isLeaf: true },
        ]
      },
      {
        value: 'C3200', label: '有色金属冶炼和压延加工业', children: [
          {
            value: 'C3210', label: '常用有色金属冶炼', children: [
              { value: 'C3211', label: '铜冶炼', isLeaf: true },
              { value: 'C3212', label: '铅锌冶炼', isLeaf: true },
              { value: 'C3213', label: '镍钴冶炼', isLeaf: true },
              { value: 'C3214', label: '锡冶炼', isLeaf: true },
              { value: 'C3215', label: '锑冶炼', isLeaf: true },
              { value: 'C3216', label: '铝冶炼', isLeaf: true },
              { value: 'C3217', label: '镁冶炼', isLeaf: true },
              { value: 'C3218', label: '硅冶炼', isLeaf: true },
              { value: 'C3219', label: '其他常用有色金属冶炼', isLeaf: true },
            ]
          },
          {
            value: 'C3220', label: '贵金属冶炼', children: [
              { value: 'C3221', label: '金冶炼', isLeaf: true },
              { value: 'C3222', label: '银冶炼', isLeaf: true },
              { value: 'C3229', label: '其他贵金属冶炼', isLeaf: true },
            ]
          },
          {
            value: 'C3230', label: '稀有稀土金属冶炼', children: [
              { value: 'C3231', label: '钨钼冶炼', isLeaf: true },
              { value: 'C3232', label: '稀土金属冶炼', isLeaf: true },
              { value: 'C3239', label: '其他稀有金属冶炼', isLeaf: true },
              { value: 'C3240', label: '有色金属合金制造', isLeaf: true },
            ]
          },
          {
            value: 'C3250', label: '有色金属压延加工', children: [
              { value: 'C3251', label: '铜压延加工', isLeaf: true },
              { value: 'C3252', label: '铝压延加工', isLeaf: true },
              { value: 'C3253', label: '贵金属压延加工', isLeaf: true },
              { value: 'C3254', label: '稀有稀土金属压延加工', isLeaf: true },
              { value: 'C3259', label: '其他有色金属压延加工', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C3300', label: '金属制品业', children: [
          {
            value: 'C3310', label: '结构性金属制品制造', children: [
              { value: 'C3311', label: '金属结构制造', isLeaf: true },
              { value: 'C3312', label: '金属门窗制造', isLeaf: true },
            ]
          },
          {
            value: 'C3320', label: '金属工具制造', children: [
              { value: 'C3321', label: '切削工具制造', isLeaf: true },
              { value: 'C3322', label: '手工具制造', isLeaf: true },
              { value: 'C3323', label: '农用及园林用金属工具制造', isLeaf: true },
              { value: 'C3324', label: '刀剪及类似日用金属工具制造', isLeaf: true },
              { value: 'C3329', label: '其他金属工具制造', isLeaf: true },
            ]
          },
          {
            value: 'C3330', label: '集装箱及金属包装容器制造', children: [
              { value: 'C3331', label: '集装箱制造', isLeaf: true },
              { value: 'C3332', label: '金属压力容器制造', isLeaf: true },
              { value: 'C3333', label: '金属包装容器及材料制造', isLeaf: true },
            ]
          },
          { value: 'C3340', label: '金属丝绳及其制品制造', isLeaf: true },
          {
            value: 'C3350', label: '建筑、安全用金属制品制造', children: [
              { value: 'C3351', label: '建筑、家具用金属配件制造', isLeaf: true },
              { value: 'C3352', label: '建筑装饰及水暖管道零件制造', isLeaf: true },
              { value: 'C3353', label: '安全、消防用金属制品制造', isLeaf: true },
              { value: 'C3359', label: '其他建筑、安全用金属制品制造', isLeaf: true },
            ]
          },
          { value: 'C3360', label: '金属表面处理及热处理加工', isLeaf: true },
          {
            value: 'C3370', label: '搪瓷制品制造', children: [
              { value: 'C3371', label: '生产专用搪瓷制品制造', isLeaf: true },
              { value: 'C3372', label: '建筑装饰搪瓷制品制造', isLeaf: true },
              { value: 'C3373', label: '搪瓷卫生洁具制造', isLeaf: true },
              { value: 'C3379', label: '搪瓷日用品及其他搪瓷制品制造', isLeaf: true },
            ]
          },
          {
            value: 'C3380', label: '金属制日用品制造', children: [
              { value: 'C3381', label: '金属制厨房用器具制造', isLeaf: true },
              { value: 'C3382', label: '金属制餐具和器皿制造', isLeaf: true },
              { value: 'C3383', label: '金属制卫生器具制造', isLeaf: true },
              { value: 'C3389', label: '其他金属制日用品制造', isLeaf: true },
            ]
          },
          {
            value: 'C3390', label: '其他金属制品制造', children: [
              { value: 'C3391', label: '黑色金属铸造', isLeaf: true },
              { value: 'C3392', label: '有色金属铸造', isLeaf: true },
              { value: 'C3393', label: '锻件及粉末冶金制品制造', isLeaf: true },
              { value: 'C3394', label: '交通及公共管理用金属标牌制造', isLeaf: true },
              { value: 'C3399', label: '其他未列明金属制品制造', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C3400', label: '通用设备制造业', children: [
          {
            value: 'C3410', label: '锅炉及原动设备制造', children: [
              { value: 'C3411', label: '锅炉及辅助设备制造', isLeaf: true },
              { value: 'C3412', label: '内燃机及配件制造', isLeaf: true },
              { value: 'C3413', label: '汽轮机及辅机制造', isLeaf: true },
              { value: 'C3414', label: '水轮机及辅机制造', isLeaf: true },
              { value: 'C3415', label: '风能原动设备制造', isLeaf: true },
              { value: 'C3419', label: '其他原动设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3420', label: '金属加工机械制造', children: [
              { value: 'C3421', label: '金属切削机床制造', isLeaf: true },
              { value: 'C3422', label: '金属成形机床制造', isLeaf: true },
              { value: 'C3423', label: '铸造机械制造', isLeaf: true },
              { value: 'C3424', label: '金属切割及焊接设备制造', isLeaf: true },
              { value: 'C3425', label: '机床功能部件及附件制造', isLeaf: true },
              { value: 'C3429', label: '其他金属加工机械制造', isLeaf: true },
            ]
          },
          {
            value: 'C3430', label: '物料搬运设备制造', children: [
              { value: 'C3431', label: '轻小型起重设备制造', isLeaf: true },
              { value: 'C3432', label: '生产专用起重机制造', isLeaf: true },
              { value: 'C3433', label: '生产专用车辆制造', isLeaf: true },
              { value: 'C3434', label: '连续搬运设备制造', isLeaf: true },
              { value: 'C3435', label: '电梯、自动扶梯及升降机制造', isLeaf: true },
              { value: 'C3436', label: '客运索道制造', isLeaf: true },
              { value: 'C3437', label: '机械式停车设备制造', isLeaf: true },
              { value: 'C3439', label: '其他物料搬运设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3440', label: '泵、阀门、压缩机及类似机械制造', children: [
              { value: 'C3441', label: '泵及真空设备制造', isLeaf: true },
              { value: 'C3442', label: '气体压缩机械制造', isLeaf: true },
              { value: 'C3443', label: '阀门和旋塞制造', isLeaf: true },
              { value: 'C3444', label: '液压动力机械及元件制造', isLeaf: true },
              { value: 'C3445', label: '液力动力机械元件制造', isLeaf: true },
              { value: 'C3446', label: '气压动力机械及元件制造', isLeaf: true },
            ]
          },
          {
            value: 'C3450', label: '轴承、齿轮和传动部件制造', children: [
              { value: 'C3451', label: '滚动轴承制造', isLeaf: true },
              { value: 'C3452', label: '滑动轴承制造', isLeaf: true },
              { value: 'C3453', label: '齿轮及齿轮减、变速箱制造', isLeaf: true },
              { value: 'C3459', label: '其他传动部件制造', isLeaf: true },
            ]
          },
          {
            value: 'C3460', label: '烘炉、风机、包装等设备制造', children: [
              { value: 'C3461', label: '烘炉、熔炉及电炉制造', isLeaf: true },
              { value: 'C3462', label: '风机、风扇制造', isLeaf: true },
              { value: 'C3463', label: '气体、液体分离及纯净设备制造', isLeaf: true },
              { value: 'C3464', label: '制冷、空调设备制造', isLeaf: true },
              { value: 'C3465', label: '风动和电动工具制造', isLeaf: true },
              { value: 'C3466', label: '喷枪及类似器具制造', isLeaf: true },
              { value: 'C3467', label: '包装专用设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3470', label: '文化、办公用机械制造', children: [
              { value: 'C3471', label: '电影机械制造', isLeaf: true },
              { value: 'C3472', label: '幻灯及投影设备制造', isLeaf: true },
              { value: 'C3473', label: '照相机及器材制造', isLeaf: true },
              { value: 'C3474', label: '复印和胶印设备制造', isLeaf: true },
              { value: 'C3475', label: '计算器及货币专用设备制造', isLeaf: true },
              { value: 'C3479', label: '其他文化、办公用机械制造', isLeaf: true },
            ]
          },
          {
            value: 'C3480', label: '通用零部件制造', children: [
              { value: 'C3481', label: '金属密封件制造', isLeaf: true },
              { value: 'C3482', label: '紧固件制造', isLeaf: true },
              { value: 'C3483', label: '弹簧制造', isLeaf: true },
              { value: 'C3484', label: '机械零部件加工', isLeaf: true },
              { value: 'C3489', label: '其他通用零部件制造', isLeaf: true },
            ]
          },
          {
            value: 'C3490', label: '其他通用设备制造', children: [
              { value: 'C3491', label: '工业机器人制造', isLeaf: true },
              { value: 'C3492', label: '特殊作业机器人制造', isLeaf: true },
              { value: 'C3493', label: '增材制造装备制造', isLeaf: true },
              { value: 'C3499', label: '其他未列明通用设备制造业', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C3500', label: '专用设备制造业', children: [
          {
            value: 'C3510', label: '采矿、冶金、建筑专用设备制造', children: [
              { value: 'C3511', label: '矿山机械制造', isLeaf: true },
              { value: 'C3512', label: '石油钻采专用设备制造', isLeaf: true },
              { value: 'C3513', label: '深海石油钻探设备制造', isLeaf: true },
              { value: 'C3514', label: '建筑工程用机械制造', isLeaf: true },
              { value: 'C3515', label: '建筑材料生产专用机械制造', isLeaf: true },
              { value: 'C3516', label: '冶金专用设备制造', isLeaf: true },
              { value: 'C3517', label: '隧道施工专用机械制造', isLeaf: true },
            ]
          },
          {
            value: 'C3520', label: '化工、木材、非金属加工专用设备制造', children: [
              { value: 'C3521', label: '炼油、化工生产专用设备制造', isLeaf: true },
              { value: 'C3522', label: '橡胶加工专用设备制造', isLeaf: true },
              { value: 'C3523', label: '塑料加工专用设备制造', isLeaf: true },
              { value: 'C3524', label: '木竹材加工机械制造', isLeaf: true },
              { value: 'C3525', label: '模具制造', isLeaf: true },
              { value: 'C3529', label: '其他非金属加工专用设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3530', label: '食品、饮料、烟草及饲料生产专用设备制造', children: [
              { value: 'C3531', label: '食品、酒、饮料及茶生产专用设备制造', isLeaf: true },
              { value: 'C3532', label: '农副食品加工专用设备制造', isLeaf: true },
              { value: 'C3533', label: '烟草生产专用设备制造', isLeaf: true },
              { value: 'C3534', label: '饲料生产专用设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3540', label: '印刷、制药、日化及日用品生产专用设备制造', children: [
              { value: 'C3541', label: '制浆和造纸专用设备制造', isLeaf: true },
              { value: 'C3542', label: '印刷专用设备制造', isLeaf: true },
              { value: 'C3543', label: '日用化工专用设备制造', isLeaf: true },
              { value: 'C3544', label: '制药专用设备制造', isLeaf: true },
              { value: 'C3545', label: '照明器具生产专用设备制造', isLeaf: true },
              { value: 'C3546', label: '玻璃、陶瓷和搪瓷制品生产专用设备制造', isLeaf: true },
              { value: 'C3549', label: '其他日用品生产专用设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3550', label: '纺织、服装和皮革加工专用设备制造', children: [
              { value: 'C3551', label: '纺织专用设备制造', isLeaf: true },
              { value: 'C3552', label: '皮革、毛皮及其制品加工专用设备制造', isLeaf: true },
              { value: 'C3553', label: '缝制机械制造', isLeaf: true },
              { value: 'C3554', label: '洗涤机械制造', isLeaf: true },
            ]
          },
          {
            value: 'C3560', label: '电子和电工机械专用设备制造', children: [
              { value: 'C3561', label: '电工机械专用设备制造', isLeaf: true },
              { value: 'C3562', label: '半导体器件专用设备制造', isLeaf: true },
              { value: 'C3563', label: '电子元器件与机电组件设备制造', isLeaf: true },
              { value: 'C3569', label: '其他电子专用设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3570', label: '农、林、牧、渔专用机械制造', children: [
              { value: 'C3571', label: '拖拉机制造', isLeaf: true },
              { value: 'C3572', label: '机械化农业及园艺机具制造', isLeaf: true },
              { value: 'C3573', label: '营林及木竹采伐机械制造', isLeaf: true },
              { value: 'C3574', label: '畜牧机械制造', isLeaf: true },
              { value: 'C3575', label: '渔业机械制造', isLeaf: true },
              { value: 'C3576', label: '农林牧渔机械配件制造', isLeaf: true },
              { value: 'C3577', label: '棉花加工机械制造', isLeaf: true },
              { value: 'C3579', label: '其他农、林、牧、渔业机械制造', isLeaf: true },
            ]
          },
          {
            value: 'C3580', label: '医疗仪器设备及器械制造', children: [
              { value: 'C3581', label: '医疗诊断、监护及治疗设备制造', isLeaf: true },
              { value: 'C3582', label: '口腔科用设备及器具制造', isLeaf: true },
              { value: 'C3583', label: '医疗实验室及医用消毒设备和器具制造', isLeaf: true },
              { value: 'C3584', label: '医疗、外科及兽医用器械制造', isLeaf: true },
              { value: 'C3585', label: '机械治疗及病房护理设备制造', isLeaf: true },
              { value: 'C3586', label: '康复辅具制造', isLeaf: true },
              { value: 'C3587', label: '眼镜制造', isLeaf: true },
              { value: 'C3589', label: '其他医疗设备及器械制造', isLeaf: true },
            ]
          },
          {
            value: 'C3590', label: '环保、邮政、社会公共服务及其他专用设备制造', children: [
              { value: 'C3591', label: '环境保护专用设备制造', isLeaf: true },
              { value: 'C3592', label: '地质勘查专用设备制造', isLeaf: true },
              { value: 'C3593', label: '邮政专用机械及器材制造', isLeaf: true },
              { value: 'C3594', label: '商业、饮食、服务专用设备制造', isLeaf: true },
              { value: 'C3595', label: '社会公共安全设备及器材制造', isLeaf: true },
              { value: 'C3596', label: '交通安全、管制及类似专用设备制造', isLeaf: true },
              { value: 'C3597', label: '水资源专用机械制造', isLeaf: true },
              { value: 'C3599', label: '其他专用设备制造', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'C3600', label: '汽车制造业', children: [
          {
            value: 'C3610', label: '汽车整车制造', children: [
              { value: 'C3611', label: '汽柴油车整车制造', isLeaf: true },
              { value: 'C3612', label: '新能源车整车制造', isLeaf: true },
            ]
          },
          { value: 'C3620', label: '汽车用发动机制造', isLeaf: true },
          { value: 'C3630', label: '改装汽车制造', isLeaf: true },
          { value: 'C3640', label: '低速汽车制造', isLeaf: true },
          { value: 'C3650', label: '电车制造', isLeaf: true },
          { value: 'C3660', label: '汽车车身、挂车制造', isLeaf: true },
          { value: 'C3670', label: '汽车零部件及配件制造', isLeaf: true },
        ]
      },
      {
        value: 'C3700', label: '铁路、船舶、航空航天和其他运输设备制造业', children: [
          {
            value: 'C3710', label: '铁路运输设备制造', children: [
              { value: 'C3711', label: '高铁车组制造', isLeaf: true },
              { value: 'C3712', label: '铁路机车车辆制造', isLeaf: true },
              { value: 'C3713', label: '窄轨机车车辆制造', isLeaf: true },
              { value: 'C3714', label: '高铁设备、配件制造', isLeaf: true },
              { value: 'C3715', label: '铁路机车车辆配件制造', isLeaf: true },
              { value: 'C3716', label: '铁路专用设备及器材、配件制造', isLeaf: true },
              { value: 'C3719', label: '其他铁路运输设备制造', isLeaf: true },
            ]
          },
          { value: 'C3720', label: '城市轨道交通设备制造', isLeaf: true },
          {
            value: 'C3730', label: '船舶及相关装置制造', children: [
              { value: 'C3731', label: '金属船舶制造', isLeaf: true },
              { value: 'C3732', label: '非金属船舶制造', isLeaf: true },
              { value: 'C3733', label: '娱乐船和运动船制造', isLeaf: true },
              { value: 'C3734', label: '船用配套设备制造', isLeaf: true },
              { value: 'C3735', label: '船舶改装', isLeaf: true },
              { value: 'C3736', label: '船舶拆除', isLeaf: true },
              { value: 'C3737', label: '海洋工程装备制造', isLeaf: true },
              { value: 'C3739', label: '航标器材及其他相关装置制造', isLeaf: true },
            ]
          },
          {
            value: 'C3740', label: '航空、航天器及设备制造', children: [
              { value: 'C3741', label: '飞机制造', isLeaf: true },
              { value: 'C3742', label: '航天器及运载火箭制造', isLeaf: true },
              { value: 'C3743', label: '航天相关设备制造', isLeaf: true },
              { value: 'C3744', label: '航空相关设备制造', isLeaf: true },
              { value: 'C3749', label: '其他航空航天器制造', isLeaf: true },
            ]
          },
          {
            value: 'C3750', label: '摩托车制造', children: [
              { value: 'C3751', label: '摩托车整车制造', isLeaf: true },
              { value: 'C3752', label: '摩托车零部件及配件制造', isLeaf: true },
            ]
          },
          {
            value: 'C3760', label: '自行车和残疾人座车制造', children: [
              { value: 'C3761', label: '自行车制造', isLeaf: true },
              { value: 'C3762', label: '残疾人座车制造', isLeaf: true },
            ]
          },
          { value: 'C3770', label: '助动车制造', isLeaf: true },
          { value: 'C3780', label: '非公路休闲车及零配件制造', isLeaf: true },
          {
            value: 'C3790', label: '潜水救捞及其他未列明运输设备制造', children: [
              { value: 'C3791', label: '潜水装备制造', isLeaf: true },
              { value: 'C3792', label: '水下救捞装备制造', isLeaf: true },
              { value: 'C3799', label: '其他未列明运输设备制造', isLeaf: true },
            ]
          },

        ]
      },
      {
        value: 'C3800', label: '电气机械和器材制造业', children: [
          {
            value: 'C3810', label: '电机制造', children: [
              { value: 'C3811', label: '发电机及发电机组制造', isLeaf: true },
              { value: 'C3812', label: '电动机制造', isLeaf: true },
              { value: 'C3813', label: '微特电机及组件制造', isLeaf: true },
              { value: 'C3819', label: '其他电机制造', isLeaf: true },
            ]
          },
          {
            value: 'C3820', label: '输配电及控制设备制造', children: [
              { value: 'C3821', label: '变压器、整流器和电感器制造', isLeaf: true },
              { value: 'C3822', label: '电容器及其配套设备制造', isLeaf: true },
              { value: 'C3823', label: '配电开关控制设备制造', isLeaf: true },
              { value: 'C3824', label: '电力电子元器件制造', isLeaf: true },
              { value: 'C3825', label: '光伏设备及元器件制造', isLeaf: true },
              { value: 'C3829', label: '其他输配电及控制设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3830', label: '电线、电缆、光缆及电工器材制造', children: [
              { value: 'C3831', label: '电线、电缆制造', isLeaf: true },
              { value: 'C3832', label: '光纤制造', isLeaf: true },
              { value: 'C3833', label: '光缆制造', isLeaf: true },
              { value: 'C3834', label: '绝缘制品制造', isLeaf: true },
              { value: 'C3839', label: '其他电工器材制造', isLeaf: true },
            ]
          },
          {
            value: 'C3840', label: '电池制造', children: [
              { value: 'C3841', label: '锂离子电池制造', isLeaf: true },
              { value: 'C3842', label: '镍氢电池制造', isLeaf: true },
              { value: 'C3843', label: '铅蓄电池制造', isLeaf: true },
              { value: 'C3844', label: '锌锰电池制造', isLeaf: true },
              { value: 'C3849', label: '其他电池制造', isLeaf: true },
            ]
          },
          {
            value: 'C3850', label: '家用电力器具制造', children: [
              { value: 'C3851', label: '家用制冷电器具制造', isLeaf: true },
              { value: 'C3852', label: '家用空气调节器制造', isLeaf: true },
              { value: 'C3853', label: '家用通风电器具制造', isLeaf: true },
              { value: 'C3854', label: '家用厨房电器具制造', isLeaf: true },
              { value: 'C3855', label: '家用清洁卫生电器具制造', isLeaf: true },
              { value: 'C3856', label: '家用美容、保健护理电器具制造', isLeaf: true },
              { value: 'C3857', label: '家用电力器具专用配件制造', isLeaf: true },
              { value: 'C3859', label: '其他家用电力器具制造', isLeaf: true },
            ]
          },
          {
            value: 'C3860', label: '非电力家用器具制造', children: [
              { value: 'C3861', label: '燃气及类似能源家用器具制造', isLeaf: true },
              { value: 'C3862', label: '太阳能器具制造', isLeaf: true },
              { value: 'C3869', label: '其他非电力家用器具制造', isLeaf: true },
            ]
          },
          {
            value: 'C3870', label: '照明器具制造', children: [
              { value: 'C3871', label: '电光源制造', isLeaf: true },
              { value: 'C3872', label: '照明灯具制造', isLeaf: true },
              { value: 'C3873', label: '舞台及场地用灯制造', isLeaf: true },
              { value: 'C3874', label: '智能照明器具制造', isLeaf: true },
              { value: 'C3879', label: '灯用电器附件及其他照明器具制造', isLeaf: true },
            ]
          },
          {
            value: 'C3890', label: '其他电气机械及器材制造', children: [
              { value: 'C3891', label: '电气信号设备装置制造', isLeaf: true },
              { value: 'C3899', label: '其他未列明电气机械及器材制造', isLeaf: true },
            ]
          },

        ]
      },
      {
        value: 'C3900', label: '计算机、通信和其他电子设备制造业', children: [
          {
            value: 'C3910', label: '计算机制造', children: [
              { value: 'C3911', label: '计算机整机制造', isLeaf: true },
              { value: 'C3912', label: '计算机零部件制造', isLeaf: true },
              { value: 'C3913', label: '计算机外围设备制造', isLeaf: true },
              { value: 'C3914', label: '工业控制计算机及系统制造', isLeaf: true },
              { value: 'C3915', label: '信息安全设备制造', isLeaf: true },
              { value: 'C3919', label: '其他计算机制造', isLeaf: true },
            ]
          },
          {
            value: 'C3920', label: '通信设备制造', children: [
              { value: 'C3921', label: '通信系统设备制造', isLeaf: true },
              { value: 'C3922', label: '通信终端设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3930', label: '广播电视设备制造', children: [
              { value: 'C3931', label: '广播电视节目制作及发射设备制造', isLeaf: true },
              { value: 'C3932', label: '广播电视接收设备制造', isLeaf: true },
              { value: 'C3933', label: '广播电视专用配件制造', isLeaf: true },
              { value: 'C3934', label: '专业音响设备制造', isLeaf: true },
              { value: 'C3939', label: '应用电视设备及其他广播电视设备制造', isLeaf: true },
            ]
          },
          { value: 'C3940', label: '雷达及配套设备制造', isLeaf: true },
          {
            value: 'C3950', label: '视听设备制造', children: [
              { value: 'C3951', label: '电视机制造', isLeaf: true },
              { value: 'C3952', label: '音响设备制造', isLeaf: true },
              { value: 'C3953', label: '影视录放设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3960', label: '智能消费设备制造', children: [
              { value: 'C3961', label: '可穿戴智能设备制造', isLeaf: true },
              { value: 'C3962', label: '智能车载设备制造', isLeaf: true },
              { value: 'C3963', label: '智能无人飞行器制造', isLeaf: true },
              { value: 'C3964', label: '服务消费机器人制造', isLeaf: true },
              { value: 'C3969', label: '其他智能消费设备制造', isLeaf: true },
            ]
          },
          {
            value: 'C3970', label: '电子器件制造', children: [
              { value: 'C3971', label: '电子真空器件制造', isLeaf: true },
              { value: 'C3972', label: '半导体分立器件制造', isLeaf: true },
              { value: 'C3973', label: '集成电路制造', isLeaf: true },
              { value: 'C3974', label: '显示器件制造', isLeaf: true },
              { value: 'C3975', label: '半导体照明器件制造', isLeaf: true },
              { value: 'C3976', label: '光电子器件制造', isLeaf: true },
              { value: 'C3979', label: '其他电子器件制造', isLeaf: true },
            ]
          },
          {
            value: 'C3980', label: '电子元件及电子专用材料制造', children: [
              { value: 'C3981', label: '电阻电容电感元件制造', isLeaf: true },
              { value: 'C3982', label: '电子电路制造', isLeaf: true },
              { value: 'C3983', label: '敏感元件及传感器制造', isLeaf: true },
              { value: 'C3984', label: '电声器件及零件制造', isLeaf: true },
              { value: 'C3985', label: '电子专用材料制造', isLeaf: true },
              { value: 'C3989', label: '其他电子元件制造', isLeaf: true },
            ]
          },
          { value: 'C3990', label: '其他电子设备制造', isLeaf: true },
        ]
      },
      {
        value: 'C4000', label: '仪器仪表制造业', children: [
          {
            value: 'C4010', label: '通用仪器仪表制造', children: [
              { value: 'C4011', label: '工业自动控制系统装置制造', isLeaf: true },
              { value: 'C4012', label: '电工仪器仪表制造', isLeaf: true },
              { value: 'C4013', label: '绘图、计算及测量仪器制造', isLeaf: true },
              { value: 'C4014', label: '实验分析仪器制造', isLeaf: true },
              { value: 'C4015', label: '试验机制造', isLeaf: true },
              { value: 'C4016', label: '供应用仪器仪表制造', isLeaf: true },
              { value: 'C4019', label: '其他通用仪器制造', isLeaf: true },
            ]
          },
          {
            value: 'C4020', label: '专用仪器仪表制造', children: [
              { value: 'C4021', label: '环境监测专用仪器仪表制造', isLeaf: true },
              { value: 'C4022', label: '运输设备及生产用计数仪表制造', isLeaf: true },
              { value: 'C4023', label: '导航、测绘、气象及海洋专用仪器制造', isLeaf: true },
              { value: 'C4024', label: '农林牧渔专用仪器仪表制造', isLeaf: true },
              { value: 'C4025', label: '地质勘探和地震专用仪器制造', isLeaf: true },
              { value: 'C4026', label: '教学专用仪器制造', isLeaf: true },
              { value: 'C4027', label: '核子及核辐射测量仪器制造', isLeaf: true },
              { value: 'C4028', label: '电子测量仪器制造', isLeaf: true },
              { value: 'C4029', label: '其他专用仪器制造', isLeaf: true },
            ]
          },
          { value: 'C4030', label: '钟表与计时仪器制造', isLeaf: true },
          { value: 'C4040', label: '光学仪器制造', isLeaf: true },
          { value: 'C4050', label: '衡器制造', isLeaf: true },
          { value: 'C4090', label: '其他仪器仪表制造业', isLeaf: true },
        ]
      },
      {
        value: 'C4100', label: '其他制造业', children: [
          {
            value: 'C4110', label: '日用杂品制造', children: [
              { value: 'C4111', label: '鬃毛加工、制刷及清扫工具制造', isLeaf: true },
              { value: 'C4119', label: '其他日用杂品制造', isLeaf: true },
            ]
          },
          { value: 'C4120', label: '核辐射加工', isLeaf: true },
          { value: 'C4190', label: '其他未列明制造业', isLeaf: true },
        ]
      },
      {
        value: 'C4200', label: '废弃资源综合利用业', children: [
          { value: 'C4210', label: '金属废料和碎屑加工处理', isLeaf: true },
          { value: 'C4220', label: '非金属废料和碎屑加工处理', isLeaf: true },
        ]
      },
      {
        value: 'C4300', label: '金属制品、机械和设备修理业', children: [
          { value: 'C4310', label: '金属制品修理', isLeaf: true },
          { value: 'C4320', label: '通用设备修理', isLeaf: true },
          { value: 'C4330', label: '专用设备修理', isLeaf: true },
          {
            value: 'C4340', label: '铁路、船舶、航空航天等运输设备修理', children: [
              { value: 'C4341', label: '铁路运输设备修理', isLeaf: true },
              { value: 'C4342', label: '船舶修理', isLeaf: true },
              { value: 'C4343', label: '航空航天器修理', isLeaf: true },
              { value: 'C4349', label: '其他运输设备修理', isLeaf: true },
            ]
          },
          { value: 'C4350', label: '电气设备修理', isLeaf: true },
          { value: 'C4360', label: '仪器仪表修理', isLeaf: true },
          { value: 'C4390', label: '其他机械和设备修理业', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'D0000', label: '电力、热力、燃气及水生产和供应业', children: [
      {
        value: 'D4400', label: '电力、热力生产和供应业', children: [
          {
            value: 'D4410', label: '电力生产', children: [
              { value: 'D4411', label: '火力发电', isLeaf: true },
              { value: 'D4412', label: '热电联产', isLeaf: true },
              { value: 'D4413', label: '水力发电', isLeaf: true },
              { value: 'D4414', label: '核力发电', isLeaf: true },
              { value: 'D4415', label: '风力发电', isLeaf: true },
              { value: 'D4416', label: '太阳能发电', isLeaf: true },
              { value: 'D4417', label: '生物质能发电', isLeaf: true },
              { value: 'D4419', label: '其他电力生产', isLeaf: true },
            ]
          },
          { value: 'D4420', label: '电力供应', isLeaf: true },
          { value: 'D4430', label: '热力生产和供应', isLeaf: true },
        ]
      },
      {
        value: 'D4500', label: '燃气生产和供应业', children: [
          {
            value: 'D4510', label: '燃气生产和供应业', children: [
              { value: 'D4511', label: '天然气生产和供应业', isLeaf: true },
              { value: 'D4512', label: '液化石油气生产和供应业', isLeaf: true },
              { value: 'D4513', label: '煤气生产和供应业', isLeaf: true },
            ]
          },
          { value: 'D4520', label: '生物质燃气生产和供应业', isLeaf: true },
        ]
      },
      {
        value: 'D4600', label: '水的生产和供应业', children: [
          { value: 'D4610', label: '自来水生产和供应', isLeaf: true },
          { value: 'D4620', label: '污水处理及其再生利用', isLeaf: true },
          { value: 'D4630', label: '海水淡化处理', isLeaf: true },
          { value: 'D4690', label: '其他水的处理、利用与分配', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'E0000', label: '建筑业', children: [
      {
        value: 'E4700', label: '房屋建筑业', children: [
          { value: 'E4710', label: '住宅房屋建筑', isLeaf: true },
          { value: 'E4720', label: '体育场馆建筑', isLeaf: true },
          { value: 'E4790', label: '其他房屋建筑业', isLeaf: true },
        ]
      },
      {
        value: 'E4800', label: '土木工程建筑业', children: [
          {
            value: 'E4810', label: '铁路、道路、隧道和桥梁工程建筑', children: [
              { value: 'E4811', label: '铁路工程建筑', isLeaf: true },
              { value: 'E4812', label: '公路工程建筑', isLeaf: true },
              { value: 'E4813', label: '市政道路工程建筑', isLeaf: true },
              { value: 'E4814', label: '城市轨道交通工程建筑', isLeaf: true },
              { value: 'E4819', label: '其他道路、隧道和桥梁工程建筑', isLeaf: true },
            ]
          },
          {
            value: 'E4820', label: '水利和水运工程建筑', children: [
              { value: 'E4821', label: '水源及供水设施工程建筑', isLeaf: true },
              { value: 'E4822', label: '河湖治理及防洪设施工程建筑', isLeaf: true },
              { value: 'E4823', label: '港口及航运设施工程建筑', isLeaf: true },
            ]
          },
          {
            value: 'E4830', label: '海洋工程建筑', children: [
              { value: 'E4831', label: '海洋油气资源开发利用工程建筑', isLeaf: true },
              { value: 'E4832', label: '海洋能源开发利用工程建筑', isLeaf: true },
              { value: 'E4833', label: '海底隧道工程建筑', isLeaf: true },
              { value: 'E4834', label: '海底设施铺设工程建筑', isLeaf: true },
              { value: 'E4839', label: '其他海洋工程建筑', isLeaf: true },
            ]
          },
          { value: 'E4840', label: '工矿工程建筑', isLeaf: true },
          {
            value: 'E4850', label: '架线和管道工程建筑', children: [
              { value: 'E4851', label: '架线及设备工程建筑', isLeaf: true },
              { value: 'E4852', label: '管道工程建筑', isLeaf: true },
              { value: 'E4853', label: '地下综合管廊工程建筑', isLeaf: true },
            ]
          },
          {
            value: 'E4860', label: '节能环保工程施工', children: [
              { value: 'E4861', label: '节能工程施工', isLeaf: true },
              { value: 'E4862', label: '环保工程施工', isLeaf: true },
              { value: 'E4863', label: '生态保护工程施工', isLeaf: true },
            ]
          },
          {
            value: 'E4870', label: '电力工程施工', children: [
              { value: 'E4871', label: '火力发电工程施工', isLeaf: true },
              { value: 'E4872', label: '水力发电工程施工', isLeaf: true },
              { value: 'E4873', label: '核电工程施工', isLeaf: true },
              { value: 'E4874', label: '风能发电工程施工', isLeaf: true },
              { value: 'E4875', label: '太阳能发电工程施工', isLeaf: true },
              { value: 'E4879', label: '其他电力工程施工', isLeaf: true },
            ]
          },
          {
            value: 'E4890', label: '其他土木工程建筑', children: [
              { value: 'E4891', label: '园林绿化工程施工', isLeaf: true },
              { value: 'E4892', label: '体育场地设施工程施工', isLeaf: true },
              { value: 'E4893', label: '游乐设施工程施工', isLeaf: true },
              { value: 'E4899', label: '其他土木工程建筑施工', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'E4900', label: '建筑安装业', children: [
          { value: 'E4910', label: '电气安装', isLeaf: true },
          { value: 'E4920', label: '管道和设备安装', isLeaf: true },
          {
            value: 'E4990', label: '其他建筑安装业', children: [
              { value: 'E4991', label: '体育场地设施安装', isLeaf: true },
              { value: 'E4999', label: '其他建筑安装', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'E5000', label: '建筑装饰、装修和其他建筑业', children: [
          {
            value: 'E5010', label: '建筑装饰和装修业', children: [
              { value: 'E5011', label: '公共建筑装饰和装修', isLeaf: true },
              { value: 'E5012', label: '住宅装饰和装修', isLeaf: true },
              { value: 'E5013', label: '建筑幕墙装饰和装修', isLeaf: true },
            ]
          },
          {
            value: 'E5020', label: '建筑物拆除和场地准备活动', children: [
              { value: 'E5021', label: '建筑物拆除活动', isLeaf: true },
              { value: 'E5022', label: '场地准备活动', isLeaf: true },
            ]
          },
          { value: 'E5030', label: '提供施工设备服务', isLeaf: true },
          { value: 'E5090', label: '其他未列明建筑业', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'F0000', label: '批发和零售业', children: [
      {
        value: 'F5100', label: '批发业', children: [
          {
            value: 'F5110', label: '农、林、牧、渔产品批发', children: [
              { value: 'F5111', label: '谷物、豆及薯类批发', isLeaf: true },
              { value: 'F5112', label: '种子批发', isLeaf: true },
              { value: 'F5113', label: '畜牧渔业饲料批发', isLeaf: true },
              { value: 'F5114', label: '棉、麻批发', isLeaf: true },
              { value: 'F5115', label: '林业产品批发', isLeaf: true },
              { value: 'F5116', label: '牲畜批发', isLeaf: true },
              { value: 'F5117', label: '渔业产品批发', isLeaf: true },
              { value: 'F5119', label: '其他农牧产品批发', isLeaf: true },
            ]
          },
          {
            value: 'F5120', label: '食品、饮料及烟草制品批发', children: [
              { value: 'F5121', label: '米、面制品及食用油批发', isLeaf: true },
              { value: 'F5122', label: '糕点、糖果及糖批发', isLeaf: true },
              { value: 'F5123', label: '果品、蔬菜批发', isLeaf: true },
              { value: 'F5124', label: '肉、禽、蛋、奶及水产品批发', isLeaf: true },
              { value: 'F5125', label: '盐及调味品批发', isLeaf: true },
              { value: 'F5126', label: '营养和保健品批发', isLeaf: true },
              { value: 'F5127', label: '酒、饮料及茶叶批发', isLeaf: true },
              { value: 'F5128', label: '烟草制品批发', isLeaf: true },
              { value: 'F5129', label: '其他食品批发', isLeaf: true },
            ]
          },
          {
            value: 'F5130', label: '纺织、服装及家庭用品批发', children: [
              { value: 'F5131', label: '纺织品、针织品及原料批发', isLeaf: true },
              { value: 'F5132', label: '服装批发', isLeaf: true },
              { value: 'F5133', label: '鞋帽批发', isLeaf: true },
              { value: 'F5134', label: '化妆品及卫生用品批发', isLeaf: true },
              { value: 'F5135', label: '厨具卫具及日用杂品批发', isLeaf: true },
              { value: 'F5136', label: '灯具、装饰物品批发', isLeaf: true },
              { value: 'F5137', label: '家用视听设备批发', isLeaf: true },
              { value: 'F5138', label: '日用家电批发', isLeaf: true },
              { value: 'F5139', label: '其他家庭用品批发', isLeaf: true },
            ]
          },
          {
            value: 'F5140', label: '文化、体育用品及器材批发', children: [
              { value: 'F5141', label: '文具用品批发', isLeaf: true },
              { value: 'F5142', label: '体育用品及器材批发', isLeaf: true },
              { value: 'F5143', label: '图书批发', isLeaf: true },
              { value: 'F5144', label: '报刊批发', isLeaf: true },
              { value: 'F5145', label: '音像制品、电子和数字出版物批发', isLeaf: true },
              { value: 'F5146', label: '首饰、工艺品及收藏品批发', isLeaf: true },
              { value: 'F5147', label: '乐器批发', isLeaf: true },
              { value: 'F5149', label: '其他文化用品批发', isLeaf: true },
            ]
          },
          {
            value: 'F5150', label: '医药及医疗器材批发', children: [
              { value: 'F5151', label: '西药批发', isLeaf: true },
              { value: 'F5152', label: '中药批发', isLeaf: true },
              { value: 'F5153', label: '动物用药品批发', isLeaf: true },
              { value: 'F5154', label: '医疗用品及器材批发', isLeaf: true },
            ]
          },
          {
            value: 'F5160', label: '矿产品、建材及化工产品批发', children: [
              { value: 'F5161', label: '煤炭及制品批发', isLeaf: true },
              { value: 'F5162', label: '石油及制品批发', isLeaf: true },
              { value: 'F5163', label: '非金属矿及制品批发', isLeaf: true },
              { value: 'F5164', label: '金属及金属矿批发', isLeaf: true },
              { value: 'F5165', label: '建材批发', isLeaf: true },
              { value: 'F5166', label: '化肥批发', isLeaf: true },
              { value: 'F5167', label: '农药批发', isLeaf: true },
              { value: 'F5168', label: '农用薄膜批发', isLeaf: true },
              { value: 'F5169', label: '其他化工产品批发', isLeaf: true },
            ]
          },
          {
            value: 'F5170', label: '机械设备、五金产品及电子产品批发', children: [
              { value: 'F5171', label: '农业机械批发', isLeaf: true },
              { value: 'F5172', label: '汽车及零配件批发', isLeaf: true },
              { value: 'F5173', label: '摩托车及零配件批发', isLeaf: true },
              { value: 'F5174', label: '五金产品批发', isLeaf: true },
              { value: 'F5175', label: '电气设备批发', isLeaf: true },
              { value: 'F5176', label: '计算机、软件及辅助设备批发', isLeaf: true },
              { value: 'F5177', label: '通讯设备批发', isLeaf: true },
              { value: 'F5178', label: '广播影视设备批发', isLeaf: true },
              { value: 'F5179', label: '其他机械设备及电子产品批发', isLeaf: true },
            ]
          },
          {
            value: 'F5180', label: '贸易经纪与代理', children: [
              { value: 'F5181', label: '贸易代理', isLeaf: true },
              { value: 'F5182', label: '一般物品拍卖', isLeaf: true },
              { value: 'F5183', label: '艺术品、收藏品拍卖', isLeaf: true },
              { value: 'F5184', label: '艺术品代理', isLeaf: true },
              { value: 'F5189', label: '其他贸易经纪与代理', isLeaf: true },
            ]
          },
          {
            value: 'F5190', label: '其他批发业', children: [
              { value: 'F5191', label: '再生物资回收与批发', isLeaf: true },
              { value: 'F5192', label: '宠物食品用品批发', isLeaf: true },
              { value: 'F5193', label: '互联网批发', isLeaf: true },
              { value: 'F5199', label: '其他未列明批发业', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'F5200', label: '零售业', children: [
          {
            value: 'F5210', label: '综合零售', children: [
              { value: 'F5211', label: '百货零售', isLeaf: true },
              { value: 'F5212', label: '超级市场零售', isLeaf: true },
              { value: 'F5213', label: '便利店零售', isLeaf: true },
              { value: 'F5219', label: '其他综合零售', isLeaf: true },
            ]
          },
          {
            value: 'F5220', label: '食品、饮料及烟草制品专门零售', children: [
              { value: 'F5221', label: '粮油零售', isLeaf: true },
              { value: 'F5222', label: '糕点、面包零售', isLeaf: true },
              { value: 'F5223', label: '果品、蔬菜零售', isLeaf: true },
              { value: 'F5224', label: '肉、禽、蛋、奶及水产品零售', isLeaf: true },
              { value: 'F5225', label: '营养和保健品零售', isLeaf: true },
              { value: 'F5226', label: '酒、饮料及茶叶零售', isLeaf: true },
              { value: 'F5227', label: '烟草制品零售', isLeaf: true },
              { value: 'F5229', label: '其他食品零售', isLeaf: true },
            ]
          },
          {
            value: 'F5230', label: '纺织、服装及日用品专门零售', children: [
              { value: 'F5231', label: '纺织品及针织品零售', isLeaf: true },
              { value: 'F5232', label: '服装零售', isLeaf: true },
              { value: 'F5233', label: '鞋帽零售', isLeaf: true },
              { value: 'F5234', label: '化妆品及卫生用品零售', isLeaf: true },
              { value: 'F5235', label: '厨具卫具及日用杂品零售', isLeaf: true },
              { value: 'F5236', label: '钟表、眼镜零售', isLeaf: true },
              { value: 'F5237', label: '箱包零售', isLeaf: true },
              { value: 'F5238', label: '自行车等代步设备零售', isLeaf: true },
              { value: 'F5239', label: '其他日用品零售', isLeaf: true },
            ]
          },
          {
            value: 'F5240', label: '文化、体育用品及器材专门零售', children: [
              { value: 'F5241', label: '文具用品零售', isLeaf: true },
              { value: 'F5242', label: '体育用品及器材零售', isLeaf: true },
              { value: 'F5243', label: '图书、报刊零售', isLeaf: true },
              { value: 'F5244', label: '音像制品、电子和数字出版物零售', isLeaf: true },
              { value: 'F5245', label: '珠宝首饰零售', isLeaf: true },
              { value: 'F5246', label: '工艺美术品及收藏品零售', isLeaf: true },
              { value: 'F5247', label: '乐器零售', isLeaf: true },
              { value: 'F5248', label: '照相器材零售', isLeaf: true },
              { value: 'F5249', label: '其他文化用品零售', isLeaf: true },
            ]
          },
          {
            value: 'F5250', label: '医药及医疗器材专门零售', children: [
              { value: 'F5251', label: '西药零售', isLeaf: true },
              { value: 'F5252', label: '中药零售', isLeaf: true },
              { value: 'F5253', label: '动物用药品零售', isLeaf: true },
              { value: 'F5254', label: '医疗用品及器材零售', isLeaf: true },
              { value: 'F5255', label: '保健辅助治疗器材零售', isLeaf: true },
            ]
          },
          {
            value: 'F5260', label: '汽车、摩托车、零配件和燃料及其他动力销售', children: [
              { value: 'F5261', label: '汽车新车零售', isLeaf: true },
              { value: 'F5262', label: '汽车旧车零售', isLeaf: true },
              { value: 'F5263', label: '汽车零配件零售', isLeaf: true },
              { value: 'F5264', label: '摩托车及零配件零售', isLeaf: true },
              { value: 'F5265', label: '机动车燃油零售', isLeaf: true },
              { value: 'F5266', label: '机动车燃气零售', isLeaf: true },
              { value: 'F5267', label: '机动车充电销售', isLeaf: true },
            ]
          },
          {
            value: 'F5270', label: '家用电器及电子产品专门零售', children: [
              { value: 'F5271', label: '家用视听设备零售', isLeaf: true },
              { value: 'F5272', label: '日用家电零售', isLeaf: true },
              { value: 'F5273', label: '计算机、软件及辅助设备零售', isLeaf: true },
              { value: 'F5274', label: '通信设备零售', isLeaf: true },
              { value: 'F5279', label: '其他电子产品零售', isLeaf: true },
            ]
          },
          {
            value: 'F5280', label: '五金、家具及室内装饰材料专门零售', children: [
              { value: 'F5281', label: '五金零售', isLeaf: true },
              { value: 'F5282', label: '灯具零售', isLeaf: true },
              { value: 'F5283', label: '家具零售', isLeaf: true },
              { value: 'F5284', label: '涂料零售', isLeaf: true },
              { value: 'F5285', label: '卫生洁具零售', isLeaf: true },
              { value: 'F5286', label: '木质装饰材料零售', isLeaf: true },
              { value: 'F5287', label: '陶瓷、石材装饰材料零售', isLeaf: true },
              { value: 'F5289', label: '其他室内装饰材料零售', isLeaf: true },
            ]
          },
          {
            value: 'F5290', label: '货摊、无店铺及其他零售业', children: [
              { value: 'F5291', label: '流动货摊零售', isLeaf: true },
              { value: 'F5292', label: '互联网零售', isLeaf: true },
              { value: 'F5293', label: '邮购及电视、电话零售', isLeaf: true },
              { value: 'F5294', label: '自动售货机零售', isLeaf: true },
              { value: 'F5295', label: '旧货零售', isLeaf: true },
              { value: 'F5296', label: '生活用燃料零售', isLeaf: true },
              { value: 'F5297', label: '宠物食品用品零售', isLeaf: true },
              { value: 'F5299', label: '其他未列明零售业', isLeaf: true },
            ]
          },
        ]
      },
    ]
  },
  {
    value: 'G0000', label: '交通运输、仓储和邮政业', children: [
      {
        value: 'G5300', label: '铁路运输业', children: [
          {
            value: 'G5310', label: '铁路旅客运输', children: [
              { value: 'G5311', label: '高速铁路旅客运输', isLeaf: true },
              { value: 'G5312', label: '城际铁路旅客运输', isLeaf: true },
              { value: 'G5313', label: '普通铁路旅客运输', isLeaf: true },
            ]
          },
          { value: 'G5320', label: '铁路货物运输', isLeaf: true },
          {
            value: 'G5330', label: '铁路运输辅助活动', children: [
              { value: 'G5331', label: '客运火车站', isLeaf: true },
              { value: 'G5332', label: '货运火车站（场）', isLeaf: true },
              { value: 'G5333', label: '铁路运输维护活动', isLeaf: true },
              { value: 'G5339', label: '其他铁路运输辅助活动', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'G5400', label: '道路运输业', children: [
          {
            value: 'G5410', label: '城市公共交通运输', children: [
              { value: 'G5411', label: '公共电汽车客运', isLeaf: true },
              { value: 'G5412', label: '城市轨道交通', isLeaf: true },
              { value: 'G5413', label: '出租车客运', isLeaf: true },
              { value: 'G5414', label: '公共自行车服务', isLeaf: true },
              { value: 'G5419', label: '其他城市公共交通运输', isLeaf: true },
            ]
          },
          {
            value: 'G5420', label: '公路旅客运输', children: [
              { value: 'G5421', label: '长途客运', isLeaf: true },
              { value: 'G5422', label: '旅游客运', isLeaf: true },
              { value: 'G5429', label: '其他公路客运', isLeaf: true },
            ]
          },
          {
            value: 'G5430', label: '道路货物运输', children: [
              { value: 'G5431', label: '普通货物道路运输', isLeaf: true },
              { value: 'G5432', label: '冷藏车道路运输', isLeaf: true },
              { value: 'G5433', label: '集装箱道路运输', isLeaf: true },
              { value: 'G5434', label: '大型货物道路运输', isLeaf: true },
              { value: 'G5435', label: '危险货物道路运输', isLeaf: true },
              { value: 'G5436', label: '邮件包裹道路运输', isLeaf: true },
              { value: 'G5437', label: '城市配送', isLeaf: true },
              { value: 'G5438', label: '搬家运输', isLeaf: true },
              { value: 'G5439', label: '其他道路货物运输', isLeaf: true },
            ]
          },
          {
            value: 'G5440', label: '道路运输辅助活动', children: [
              { value: 'G5441', label: '客运汽车站', isLeaf: true },
              { value: 'G5442', label: '货运枢纽（站）', isLeaf: true },
              { value: 'G5443', label: '公路管理与养护', isLeaf: true },
              { value: 'G5449', label: '其他道路运输辅助活动', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'G5500', label: '水上运输业', children: [
          {
            value: 'G5510', label: '水上旅客运输', children: [
              { value: 'G5511', label: '海上旅客运输', isLeaf: true },
              { value: 'G5512', label: '内河旅客运输', isLeaf: true },
              { value: 'G5513', label: '客运轮渡运输', isLeaf: true },
            ]
          },
          {
            value: 'G5520', label: '水上货物运输', children: [
              { value: 'G5521', label: '远洋货物运输', isLeaf: true },
              { value: 'G5522', label: '沿海货物运输', isLeaf: true },
              { value: 'G5523', label: '内河货物运输', isLeaf: true },
            ]
          },
          {
            value: 'G5530', label: '水上运输辅助活动', children: [
              { value: 'G5531', label: '客运港口', isLeaf: true },
              { value: 'G5532', label: '货运港口', isLeaf: true },
              { value: 'G5539', label: '其他水上运输辅助活动', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'G5600', label: '航空运输业', children: [
          {
            value: 'G5610', label: '航空客货运输', children: [
              { value: 'G5611', label: '航空旅客运输', isLeaf: true },
              { value: 'G5612', label: '航空货物运输', isLeaf: true },
            ]
          },
          {
            value: 'G5620', label: '通用航空服务', children: [
              { value: 'G5621', label: '通用航空生产服务', isLeaf: true },
              { value: 'G5622', label: '观光游览航空服务', isLeaf: true },
              { value: 'G5623', label: '体育航空运动服务', isLeaf: true },
              { value: 'G5629', label: '其他通用航空服务', isLeaf: true },
            ]
          },
          {
            value: 'G5630', label: '航空运输辅助活动', children: [
              { value: 'G5631', label: '机场', isLeaf: true },
              { value: 'G5632', label: '空中交通管理', isLeaf: true },
              { value: 'G5639', label: '其他航空运输辅助活动', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'G5700', label: '管道运输业', children: [
          { value: 'G5710', label: '海底管道运输', isLeaf: true },
          { value: 'G5720', label: '陆地管道运输', isLeaf: true },
        ]
      },
      {
        value: 'G5800', label: '多式联运和运输代理业', children: [
          { value: 'G5810', label: '多式联运', isLeaf: true },
          {
            value: 'G5820', label: '运输代理业', children: [
              { value: 'G5821', label: '货物运输代理', isLeaf: true },
              { value: 'G5822', label: '旅客票务代理', isLeaf: true },
              { value: 'G5829', label: '其他运输代理业', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'G5900', label: '装卸搬运和仓储业', children: [
          { value: 'G5910', label: '装卸搬运', isLeaf: true },
          { value: 'G5920', label: '通用仓储', isLeaf: true },
          { value: 'G5930', label: '低温仓储', isLeaf: true },
          {
            value: 'G5940', label: '危险品仓储', children: [
              { value: 'G5941', label: '油气仓储', isLeaf: true },
              { value: 'G5942', label: '危险化学品仓储', isLeaf: true },
              { value: 'G5949', label: '其他危险品仓储', isLeaf: true },
            ]
          },
          {
            value: 'G5950', label: '谷物、棉花等农产品仓储', children: [
              { value: 'G5951', label: '谷物仓储', isLeaf: true },
              { value: 'G5952', label: '棉花仓储', isLeaf: true },
              { value: 'G5959', label: '其他农产品仓储', isLeaf: true },
            ]
          },
          { value: 'G5960', label: '中药材仓储', isLeaf: true },
          { value: 'G5990', label: '其他仓储业', isLeaf: true },
        ]
      },
      {
        value: 'G6000', label: '邮政业', children: [
          { value: 'G6010', label: '邮政基本服务', isLeaf: true },
          { value: 'G6020', label: '快递服务', isLeaf: true },
          { value: 'G6090', label: '其他寄递服务', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'H0000', label: '住宿和餐饮业', children: [
      {
        value: 'H6100', label: '住宿业', children: [
          { value: 'H6110', label: '旅游饭店', isLeaf: true },
          {
            value: 'H6120', label: '一般旅馆', children: [
              { value: 'H6121', label: '经济型连锁酒店', isLeaf: true },
              { value: 'H6129', label: '其他一般旅馆', isLeaf: true },
            ]
          },
          { value: 'H6130', label: '民宿服务', isLeaf: true },
          { value: 'H6140', label: '露营地服务', isLeaf: true },
          { value: 'H6190', label: '其他住宿业', isLeaf: true },
        ]
      },
      {
        value: 'H6200', label: '餐饮业', children: [
          { value: 'H6210', label: '正餐服务', isLeaf: true },
          { value: 'H6220', label: '快餐服务', isLeaf: true },
          {
            value: 'H6230', label: '饮料及冷饮服务', children: [
              { value: 'H6231', label: '茶馆服务', isLeaf: true },
              { value: 'H6232', label: '咖啡馆服务', isLeaf: true },
              { value: 'H6233', label: '酒吧服务', isLeaf: true },
              { value: 'H6239', label: '其他饮料及冷饮服务', isLeaf: true },
            ]
          },
          {
            value: 'H6240', label: '餐饮配送及外卖送餐服务', children: [
              { value: 'H6241', label: '餐饮配送服务', isLeaf: true },
              { value: 'H6242', label: '外卖送餐服务', isLeaf: true },
            ]
          },
          {
            value: 'H6290', label: '其他餐饮业', children: [
              { value: 'H6291', label: '小吃服务', isLeaf: true },
              { value: 'H6299', label: '其他未列明餐饮业', isLeaf: true },
            ]
          },
        ]
      },
    ]
  },
  {
    value: 'I0000', label: '信息传输、软件和信息技术服务业', children: [
      {
        value: 'I6300', label: '电信、广播电视和卫星传输服务', children: [
          {
            value: 'I6310', label: '电信', children: [
              { value: 'I6311', label: '固定电信服务', isLeaf: true },
              { value: 'I6312', label: '移动电信服务', isLeaf: true },
              { value: 'I6319', label: '其他电信服务', isLeaf: true },
            ]
          },
          {
            value: 'I6320', label: '广播电视传输服务', children: [
              { value: 'I6321', label: '有线广播电视传输服务', isLeaf: true },
              { value: 'I6322', label: '无线广播电视传输服务', isLeaf: true },
            ]
          },
          {
            value: 'I6330', label: '卫星传输服务', children: [
              { value: 'I6331', label: '广播电视卫星传输服务', isLeaf: true },
              { value: 'I6339', label: '其他卫星传输服务', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'I6400', label: '互联网和相关服务', children: [
          { value: 'I6410', label: '互联网接入及相关服务', isLeaf: true },
          {
            value: 'I6420', label: '互联网信息服务', children: [
              { value: 'I6421', label: '互联网搜索服务', isLeaf: true },
              { value: 'I6422', label: '互联网游戏服务', isLeaf: true },
              { value: 'I6429', label: '互联网其他信息服务', isLeaf: true },
            ]
          },
          {
            value: 'I6430', label: '互联网平台', children: [
              { value: 'I6431', label: '互联网生产服务平台', isLeaf: true },
              { value: 'I6432', label: '互联网生活服务平台', isLeaf: true },
              { value: 'I6433', label: '互联网科技创新平台', isLeaf: true },
              { value: 'I6434', label: '互联网公共服务平台', isLeaf: true },
              { value: 'I6439', label: '其他互联网平台', isLeaf: true },
            ]
          },
          { value: 'I6440', label: '互联网安全服务', isLeaf: true },
          { value: 'I6450', label: '互联网数据服务', isLeaf: true },
          { value: 'I6490', label: '其他互联网服务', isLeaf: true },
        ]
      },
      {
        value: 'I6500', label: '软件和信息技术服务业', children: [
          {
            value: 'I6510', label: '软件开发', children: [
              { value: 'I6511', label: '基础软件开发', isLeaf: true },
              { value: 'I6512', label: '支撑软件开发', isLeaf: true },
              { value: 'I6513', label: '应用软件开发', isLeaf: true },
              { value: 'I6519', label: '其他软件开发', isLeaf: true },
            ]
          },
          { value: 'I6520', label: '集成电路设计', isLeaf: true },
          {
            value: 'I6530', label: '信息系统集成和物联网技术服务', children: [
              { value: 'I6531', label: '信息系统集成服务', isLeaf: true },
              { value: 'I6532', label: '物联网技术服务', isLeaf: true },
            ]
          },
          { value: 'I6540', label: '运行维护服务', isLeaf: true },
          { value: 'I6550', label: '信息处理和存储支持服务', isLeaf: true },
          { value: 'I6560', label: '信息技术咨询服务', isLeaf: true },
          {
            value: 'I6570', label: '数字内容服务', children: [
              { value: 'I6571', label: '地理遥感信息服务', isLeaf: true },
              { value: 'I6572', label: '动漫、游戏数字内容服务', isLeaf: true },
              { value: 'I6579', label: '其他数字内容服务', isLeaf: true },
            ]
          },
          {
            value: 'I6590', label: '其他信息技术服务业', children: [
              { value: 'I6591', label: '呼叫中心', isLeaf: true },
              { value: 'I6599', label: '其他未列明信息技术服务业', isLeaf: true },
            ]
          },
        ]
      },
    ]
  },
  {
    value: 'J0000', label: '金融业', children: [
      {
        value: 'J6600', label: '货币金融服务', children: [
          { value: 'J6610', label: '中央银行服务', isLeaf: true },
          {
            value: 'J6620', label: '货币银行服务', children: [
              { value: 'J6621', label: '商业银行服务', isLeaf: true },
              { value: 'J6622', label: '政策性银行服务', isLeaf: true },
              { value: 'J6623', label: '信用合作社服务', isLeaf: true },
              { value: 'J6624', label: '农村资金互助社服务', isLeaf: true },
              { value: 'J6629', label: '其他货币银行服务', isLeaf: true },
            ]
          },
          {
            value: 'J6630', label: '非货币银行服务', children: [
              { value: 'J6631', label: '融资租赁服务', isLeaf: true },
              { value: 'J6632', label: '财务公司服务', isLeaf: true },
              { value: 'J6633', label: '典当', isLeaf: true },
              { value: 'J6634', label: '汽车金融公司服务', isLeaf: true },
              { value: 'J6635', label: '小额贷款公司服务', isLeaf: true },
              { value: 'J6636', label: '消费金融公司服务', isLeaf: true },
              { value: 'J6637', label: '网络借贷服务', isLeaf: true },
              { value: 'J6639', label: '其他非货币银行服务', isLeaf: true },
            ]
          },
          { value: 'J6640', label: '银行理财服务', isLeaf: true },
          { value: 'J6650', label: '银行监管服务', isLeaf: true },
        ]
      },
      {
        value: 'J6700', label: '资本市场服务', children: [
          {
            value: 'J6710', label: '证券市场服务', children: [
              { value: 'J6711', label: '证券市场管理服务', isLeaf: true },
              { value: 'J6712', label: '证券经纪交易服务', isLeaf: true },
            ]
          },
          { value: 'J6720', label: '公开募集证券投资基金', isLeaf: true },
          {
            value: 'J6730', label: '非公开募集证券投资基金', children: [
              { value: 'J6731', label: '创业投资基金', isLeaf: true },
              { value: 'J6732', label: '天使投资', isLeaf: true },
              { value: 'J6739', label: '其他非公开募集证券投资基金', isLeaf: true },
            ]
          },
          {
            value: 'J6740', label: '期货市场服务', children: [
              { value: 'J6741', label: '期货市场管理服务', isLeaf: true },
              { value: 'J6749', label: '其他期货市场服务', isLeaf: true },
            ]
          },
          { value: 'J6750', label: '证券期货监管服务', isLeaf: true },
          { value: 'J6760', label: '资本投资服务', isLeaf: true },
          { value: 'J6790', label: '其他资本市场服务', isLeaf: true },
        ]
      },
      {
        value: 'J6800', label: '保险业', children: [
          {
            value: 'J6810', label: '人身保险', children: [
              { value: 'J6811', label: '人寿保险', isLeaf: true },
              { value: 'J6812', label: '年金保险', isLeaf: true },
              { value: 'J6813', label: '健康保险', isLeaf: true },
              { value: 'J6814', label: '意外伤害保险', isLeaf: true },
            ]
          },
          { value: 'J6820', label: '财产保险', isLeaf: true },
          { value: 'J6830', label: '再保险', isLeaf: true },
          { value: 'J6840', label: '商业养老金', isLeaf: true },
          {
            value: 'J6850', label: '保险中介服务', children: [
              { value: 'J6851', label: '保险经纪服务', isLeaf: true },
              { value: 'J6852', label: '保险代理服务', isLeaf: true },
              { value: 'J6853', label: '保险公估服务', isLeaf: true },
            ]
          },
          { value: 'J6860', label: '保险资产管理', isLeaf: true },
          { value: 'J6870', label: '保险监管服务', isLeaf: true },
          { value: 'J6890', label: '其他保险活动', isLeaf: true },
        ]
      },
      {
        value: 'J6900', label: '其他金融业', children: [
          {
            value: 'J6910', label: '金融信托与管理服务', children: [
              { value: 'J6911', label: '信托公司', isLeaf: true },
              { value: 'J6919', label: '其他金融信托与管理服务', isLeaf: true },
            ]
          },
          { value: 'J6920', label: '控股公司服务', isLeaf: true },
          { value: 'J6930', label: '非金融机构支付服务', isLeaf: true },
          { value: 'J6940', label: '金融信息服务', isLeaf: true },
          { value: 'J6950', label: '金融资产管理公司', isLeaf: true },
          {
            value: 'J6990', label: '其他未列明金融业', children: [
              { value: 'J6991', label: '货币经纪公司服务', isLeaf: true },
              { value: 'J6999', label: '其他未包括金融业', isLeaf: true },
            ]
          },
        ]
      },
    ]
  },
  {
    value: 'K0000', label: '房地产业', children: [
      {
        value: 'K7000', label: '房地产业', children: [
          { value: 'K7010', label: '房地产开发经营', isLeaf: true },
          { value: 'K7020', label: '物业管理', isLeaf: true },
          { value: 'K7030', label: '房地产中介服务', isLeaf: true },
          { value: 'K7040', label: '房地产租赁经营', isLeaf: true },
          { value: 'K7090', label: '其他房地产业', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'L0000', label: '租赁和商务服务业', children: [
      {
        value: 'L7100', label: '租赁业', children: [
          {
            value: 'L7110', label: '机械设备经营租赁', children: [
              { value: 'L7111', label: '汽车租赁', isLeaf: true },
              { value: 'L7112', label: '农业机械经营租赁', isLeaf: true },
              { value: 'L7113', label: '建筑工程机械与设备经营租赁', isLeaf: true },
              { value: 'L7114', label: '计算机及通讯设备经营租赁', isLeaf: true },
              { value: 'L7115', label: '医疗设备经营租赁', isLeaf: true },
              { value: 'L7119', label: '其他机械与设备经营租赁', isLeaf: true },
            ]
          },
          {
            value: 'L7120', label: '文体设备和用品出租', children: [
              { value: 'L7121', label: '休闲娱乐用品设备出租', isLeaf: true },
              { value: 'L7122', label: '体育用品设备出租', isLeaf: true },
              { value: 'L7123', label: '文化用品设备出租', isLeaf: true },
              { value: 'L7124', label: '图书出租', isLeaf: true },
              { value: 'L7125', label: '音像制品出租', isLeaf: true },
              { value: 'L7129', label: '其他文体设备和用品出租', isLeaf: true },
            ]
          },
          { value: 'L7130', label: '日用品出租', isLeaf: true },
        ]
      },
      {
        value: 'L7200', label: '商务服务业', children: [
          {
            value: 'L7210', label: '组织管理服务', children: [
              { value: 'L7211', label: '企业总部管理', isLeaf: true },
              { value: 'L7212', label: '投资与资产管理', isLeaf: true },
              { value: 'L7213', label: '资源与产权交易服务', isLeaf: true },
              { value: 'L7214', label: '单位后勤管理服务', isLeaf: true },
              { value: 'L7215', label: '农村集体经济组织管理', isLeaf: true },
              { value: 'L7219', label: '其他组织管理服务', isLeaf: true },
            ]
          },
          {
            value: 'L7220', label: '综合管理服务', children: [
              { value: 'L7221', label: '园区管理服务', isLeaf: true },
              { value: 'L7222', label: '商业综合体管理服务', isLeaf: true },
              { value: 'L7223', label: '市场管理服务', isLeaf: true },
              { value: 'L7224', label: '供应链管理服务', isLeaf: true },
              { value: 'L7229', label: '其他综合管理服务', isLeaf: true },
            ]
          },
          {
            value: 'L7230', label: '法律服务', children: [
              { value: 'L7231', label: '律师及相关法律服务', isLeaf: true },
              { value: 'L7232', label: '公证服务', isLeaf: true },
              { value: 'L7239', label: '其他法律服务', isLeaf: true },
            ]
          },
          {
            value: 'L7240', label: '咨询与调查', children: [
              { value: 'L7241', label: '会计、审计及税务服务', isLeaf: true },
              { value: 'L7242', label: '市场调查', isLeaf: true },
              { value: 'L7243', label: '社会经济咨询', isLeaf: true },
              { value: 'L7244', label: '健康咨询', isLeaf: true },
              { value: 'L7245', label: '环保咨询', isLeaf: true },
              { value: 'L7246', label: '体育咨询', isLeaf: true },
              { value: 'L7249', label: '其他专业咨询与调查', isLeaf: true },
            ]
          },
          {
            value: 'L7250', label: '广告业', children: [
              { value: 'L7251', label: '互联网广告服务', isLeaf: true },
              { value: 'L7259', label: '其他广告服务', isLeaf: true },
            ]
          },
          {
            value: 'L7260', label: '人力资源服务', children: [
              { value: 'L7261', label: '公共就业服务', isLeaf: true },
              { value: 'L7262', label: '职业中介服务', isLeaf: true },
              { value: 'L7263', label: '劳务派遣服务', isLeaf: true },
              { value: 'L7264', label: '创业指导服务', isLeaf: true },
              { value: 'L7269', label: '其他人力资源服务', isLeaf: true },
            ]
          },
          {
            value: 'L7270', label: '安全保护服务', children: [
              { value: 'L7271', label: '安全服务', isLeaf: true },
              { value: 'L7272', label: '安全系统监控服务', isLeaf: true },
              { value: 'L7279', label: '其他安全保护服务', isLeaf: true },
            ]
          },
          {
            value: 'L7280', label: '会议、展览及相关服务', children: [
              { value: 'L7281', label: '科技会展服务', isLeaf: true },
              { value: 'L7282', label: '旅游会展服务', isLeaf: true },
              { value: 'L7283', label: '体育会展服务', isLeaf: true },
              { value: 'L7284', label: '文化会展服务', isLeaf: true },
              { value: 'L7289', label: '其他会议、展览及相关服务', isLeaf: true },
            ]
          },
          {
            value: 'L7290', label: '其他商务服务业', children: [
              { value: 'L7291', label: '旅行社及相关服务', isLeaf: true },
              { value: 'L7292', label: '包装服务', isLeaf: true },
              { value: 'L7293', label: '办公服务', isLeaf: true },
              { value: 'L7294', label: '翻译服务', isLeaf: true },
              { value: 'L7295', label: '信用服务', isLeaf: true },
              { value: 'L7296', label: '非融资担保服务', isLeaf: true },
              { value: 'L7297', label: '商务代理代办服务', isLeaf: true },
              { value: 'L7298', label: '票务代理服务', isLeaf: true },
              { value: 'L7299', label: '其他未列明商务服务业', isLeaf: true },
            ]
          },

        ]
      },
    ]
  },
  {
    value: 'M0000', label: '科学研究和技术服务业', children: [
      {
        value: 'M7300', label: '研究和试验发展', children: [
          { value: 'M7310', label: '自然科学研究和试验发展', isLeaf: true },
          { value: 'M7320', label: '工程和技术研究和试验发展', isLeaf: true },
          { value: 'M7330', label: '农业科学研究和试验发展', isLeaf: true },
          { value: 'M7340', label: '医学研究和试验发展', isLeaf: true },
          { value: 'M7350', label: '社会人文科学研究', isLeaf: true },
        ]
      },
      {
        value: 'M7400', label: '专业技术服务业', children: [
          { value: 'M7410', label: '气象服务', isLeaf: true },
          { value: 'M7420', label: '地震服务', isLeaf: true },
          {
            value: 'M7430', label: '海洋服务', children: [
              { value: 'M7431', label: '海洋气象服务', isLeaf: true },
              { value: 'M7432', label: '海洋环境服务', isLeaf: true },
              { value: 'M7439', label: '其他海洋服务', isLeaf: true },
            ]
          },
          {
            value: 'M7440', label: '测绘地理信息服务', children: [
              { value: 'M7441', label: '遥感测绘服务', isLeaf: true },
              { value: 'M7449', label: '其他测绘地理信息服务', isLeaf: true },
            ]
          },
          {
            value: 'M7450', label: '质检技术服务', children: [
              { value: 'M7451', label: '检验检疫服务', isLeaf: true },
              { value: 'M7452', label: '检测服务', isLeaf: true },
              { value: 'M7453', label: '计量服务', isLeaf: true },
              { value: 'M7454', label: '标准化服务', isLeaf: true },
              { value: 'M7455', label: '认证认可服务', isLeaf: true },
              { value: 'M7459', label: '其他质检技术服务', isLeaf: true },
            ]
          },
          {
            value: 'M7460', label: '环境与生态监测', children: [
              { value: 'M7461', label: '环境保护监测', isLeaf: true },
              { value: 'M7462', label: '生态资源监测', isLeaf: true },
              { value: 'M7463', label: '野生动物疫源疫病防控监测', isLeaf: true },
            ]
          },
          {
            value: 'M7470', label: '地质勘查', children: [
              { value: 'M7471', label: '能源矿产地质勘查', isLeaf: true },
              { value: 'M7472', label: '固体矿产地质勘查', isLeaf: true },
              { value: 'M7473', label: '水、二氧化碳等矿产地质勘查', isLeaf: true },
              { value: 'M7474', label: '基础地质勘查', isLeaf: true },
              { value: 'M7475', label: '地质勘查技术服务', isLeaf: true },
            ]
          },
          {
            value: 'M7480', label: '工程技术与设计服务', children: [
              { value: 'M7481', label: '工程管理服务', isLeaf: true },
              { value: 'M7482', label: '工程监理服务', isLeaf: true },
              { value: 'M7483', label: '工程勘察活动', isLeaf: true },
              { value: 'M7484', label: '工程设计活动', isLeaf: true },
              { value: 'M7485', label: '规划设计管理', isLeaf: true },
              { value: 'M7486', label: '土地规划服务', isLeaf: true },
            ]
          },
          {
            value: 'M7490', label: '工业与专业设计及其他专业技术服务', children: [
              { value: 'M7491', label: '工业设计服务', isLeaf: true },
              { value: 'M7492', label: '专业设计服务', isLeaf: true },
              { value: 'M7493', label: '兽医服务', isLeaf: true },
              { value: 'M7499', label: '其他未列明专业技术服务业', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'M7500', label: '科技推广和应用服务', children: [
          {
            value: 'M7510', label: '技术推广服务', children: [
              { value: 'M7511', label: '农林牧渔技术推广服务', isLeaf: true },
              { value: 'M7512', label: '生物技术推广服务', isLeaf: true },
              { value: 'M7513', label: '新材料技术推广服务', isLeaf: true },
              { value: 'M7514', label: '节能技术推广服务', isLeaf: true },
              { value: 'M7515', label: '新能源技术推广服务', isLeaf: true },
              { value: 'M7516', label: '环保技术推广服务', isLeaf: true },
              { value: 'M7517', label: '三维（3D)打印技术推广服务', isLeaf: true },
              { value: 'M7519', label: '其他技术推广服务', isLeaf: true },
            ]
          },
          { value: 'M7520', label: '知识产权服务', isLeaf: true },
          { value: 'M7530', label: '科技中介服务', isLeaf: true },
          { value: 'M7540', label: '创业空间服务', isLeaf: true },
          { value: 'M7590', label: '其他科技推广服务业', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'N0000', label: '水利、环境和公共设施管理业', children: [
      {
        value: 'N7600', label: '水利管理业', children: [
          { value: 'N7610', label: '防洪除涝设施管理', isLeaf: true },
          { value: 'N7620', label: '水资源管理', isLeaf: true },
          { value: 'N7630', label: '天然水收集与分配', isLeaf: true },
          { value: 'N7640', label: '水文服务', isLeaf: true },
          { value: 'N7690', label: '其他水利管理业', isLeaf: true },
        ]
      },
      {
        value: 'N7700', label: '生态保护和环境治理业', children: [
          {
            value: 'N7710', label: '生态保护', children: [
              { value: 'N7711', label: '自然生态系统保护管理', isLeaf: true },
              { value: 'N7712', label: '自然遗迹保护管理', isLeaf: true },
              { value: 'N7713', label: '野生动物保护', isLeaf: true },
              { value: 'N7714', label: '野生植物保护', isLeaf: true },
              { value: 'N7715', label: '动物园、水族馆管理服务', isLeaf: true },
              { value: 'N7716', label: '植物园管理服务', isLeaf: true },
              { value: 'N7719', label: '其他自然保护', isLeaf: true },
            ]
          },
          {
            value: 'N7720', label: '环境治理业', children: [
              { value: 'N7721', label: '水污染治理', isLeaf: true },
              { value: 'N7722', label: '大气污染治理', isLeaf: true },
              { value: 'N7723', label: '固体废物治理', isLeaf: true },
              { value: 'N7724', label: '危险废物治理', isLeaf: true },
              { value: 'N7725', label: '放射性废物治理', isLeaf: true },
              { value: 'N7726', label: '土壤污染治理与修复服务', isLeaf: true },
              { value: 'N7727', label: '噪声与振动控制服务', isLeaf: true },
              { value: 'N7729', label: '其他污染治理', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'N7800', label: '公共设施管理业', children: [
          { value: 'N7810', label: '市政设施管理', isLeaf: true },
          { value: 'N7820', label: '环境卫生管理', isLeaf: true },
          { value: 'N7830', label: '城乡市容管理', isLeaf: true },
          { value: 'N7840', label: '绿化管理', isLeaf: true },
          { value: 'N7850', label: '城市公园管理', isLeaf: true },
          {
            value: 'N7860', label: '游览景区管理', children: [
              { value: 'N7861', label: '名胜风景区管理', isLeaf: true },
              { value: 'N7862', label: '森林公园管理', isLeaf: true },
            ]
          },
          { value: 'N7869', label: '其他游览景区管理', isLeaf: true },
        ]
      },
      {
        value: 'N7900', label: '土地管理业', children: [
          { value: 'N7910', label: '土地整治服务', isLeaf: true },
          { value: 'N7920', label: '土地调查评估服务', isLeaf: true },
          { value: 'N7930', label: '土地登记服务', isLeaf: true },
          { value: 'N7940', label: '土地登记代理服务', isLeaf: true },
          { value: 'N7990', label: '其他土地管理服务', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'O0000', label: '居民服务、修理和其他服务业', children: [
      {
        value: 'O8000', label: '居民服务业', children: [
          { value: 'O8010', label: '家庭服务', isLeaf: true },
          { value: 'O8020', label: '托儿所服务', isLeaf: true },
          { value: 'O8030', label: '洗染服务', isLeaf: true },
          { value: 'O8040', label: '理发及美容服务', isLeaf: true },
          {
            value: 'O8050', label: '洗浴和保健养生服务', children: [
              { value: 'O8051', label: '洗浴服务', isLeaf: true },
              { value: 'O8052', label: '足浴服务', isLeaf: true },
              { value: 'O8053', label: '养生保健服务', isLeaf: true },
            ]
          },
          { value: 'O8060', label: '摄影扩印服务', isLeaf: true },
          { value: 'O8070', label: '婚姻服务', isLeaf: true },
          { value: 'O8080', label: '殡葬服务', isLeaf: true },
          { value: 'O8090', label: '其他居民服务业', isLeaf: true },
        ]
      },
      {
        value: 'O8100', label: '机动车、电子产品和日用产品修理业', children: [
          {
            value: 'O8110', label: '汽车、摩托车等修理与维护', children: [
              { value: 'O8111', label: '汽车修理与维护', isLeaf: true },
              { value: 'O8112', label: '大型车辆装备修理与维护', isLeaf: true },
              { value: 'O8113', label: '摩托车修理与维护', isLeaf: true },
              { value: 'O8114', label: '助动车等修理与维护', isLeaf: true },
            ]
          },
          {
            value: 'O8120', label: '计算机和办公设备维修', children: [
              { value: 'O8121', label: '计算机和辅助设备修理', isLeaf: true },
              { value: 'O8122', label: '通讯设备修理', isLeaf: true },
              { value: 'O8129', label: '其他办公设备维修', isLeaf: true },
            ]
          },
          {
            value: 'O8130', label: '家用电器修理', children: [
              { value: 'O8131', label: '家用电子产品修理', isLeaf: true },
              { value: 'O8132', label: '日用电器修理', isLeaf: true },
            ]
          },
          {
            value: 'O8190', label: '其他日用产品修理业', children: [
              { value: 'O8191', label: '自行车修理', isLeaf: true },
              { value: 'O8192', label: '鞋和皮革修理', isLeaf: true },
              { value: 'O8193', label: '家具和相关物品修理', isLeaf: true },
              { value: 'O8199', label: '其他未列明日用产品修理业', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'O8200', label: '其他服务业', children: [
          {
            value: 'O8210', label: '清洁服务', children: [
              { value: 'O8211', label: '建筑物清洁服务', isLeaf: true },
              { value: 'O8219', label: '其他清洁服务', isLeaf: true },
            ]
          },
          {
            value: 'O8220', label: '宠物服务', children: [
              { value: 'O8221', label: '宠物饲养', isLeaf: true },
              { value: 'O8222', label: '宠物医院服务', isLeaf: true },
              { value: 'O8223', label: '宠物美容服务', isLeaf: true },
              { value: 'O8224', label: '宠物寄托收养服务', isLeaf: true },
              { value: 'O8229', label: '其他宠物服务', isLeaf: true },
            ]
          },
          { value: 'O8290', label: '其他未列明服务业', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'P0000', label: '教育', children: [
      {
        value: 'P8300', label: '教育', children: [
          { value: 'P8310', label: '学前教育', isLeaf: true },
          {
            value: 'P8320', label: '初等教育', children: [
              { value: 'P8321', label: '普通小学教育', isLeaf: true },
              { value: 'P8322', label: '成人小学教育', isLeaf: true },
            ]
          },
          {
            value: 'P8330', label: '中等教育', children: [
              { value: 'P8331', label: '普通初中教育', isLeaf: true },
              { value: 'P8332', label: '职业初中教育', isLeaf: true },
              { value: 'P8333', label: '成人初中教育', isLeaf: true },
              { value: 'P8334', label: '普通高中教育', isLeaf: true },
              { value: 'P8335', label: '成人高中教育', isLeaf: true },
              { value: 'P8336', label: '中等职业学校教育', isLeaf: true },
            ]
          },
          {
            value: 'P8340', label: '高等教育', children: [
              { value: 'P8341', label: '普通高等教育', isLeaf: true },
              { value: 'P8342', label: '成人高等教育', isLeaf: true },
              { value: 'P8350', label: '特殊教育', isLeaf: true },
            ]
          },
          {
            value: 'P8390', label: '技能培训、教育辅助及其他教育', children: [
              { value: 'P8391', label: '职业技能培训', isLeaf: true },
              { value: 'P8392', label: '体校及体育培训', isLeaf: true },
              { value: 'P8393', label: '文化艺术培训', isLeaf: true },
              { value: 'P8394', label: '教育辅助服务', isLeaf: true },
              { value: 'P8399', label: '其他未列明教育', isLeaf: true },
            ]
          },
        ]
      },
    ]
  },
  {
    value: 'Q0000', label: '卫生和社会工作', children: [
      {
        value: 'Q8400', label: '卫生', children: [
          {
            value: 'Q8410', label: '医院', children: [
              { value: 'Q8411', label: '综合医院', isLeaf: true },
              { value: 'Q8412', label: '中医医院', isLeaf: true },
              { value: 'Q8413', label: '中西医结合医院', isLeaf: true },
              { value: 'Q8414', label: '民族医院', isLeaf: true },
              { value: 'Q8415', label: '专科医院', isLeaf: true },
              { value: 'Q8416', label: '疗养院', isLeaf: true },
            ]
          },
          {
            value: 'Q8420', label: '基层医疗卫生服务', children: [
              { value: 'Q8421', label: '社区卫生服务中心（站）', isLeaf: true },
              { value: 'Q8422', label: '街道卫生院', isLeaf: true },
              { value: 'Q8423', label: '乡镇卫生院', isLeaf: true },
              { value: 'Q8424', label: '村卫生室', isLeaf: true },
              { value: 'Q8425', label: '门诊部（所）', isLeaf: true },
            ]
          },
          {
            value: 'Q8430', label: '专业公共卫生服务', children: [
              { value: 'Q8431', label: '疾病预防控制中心', isLeaf: true },
              { value: 'Q8432', label: '专科疾病防治院（所、站)', isLeaf: true },
              { value: 'Q8433', label: '妇幼保健院（所、站）', isLeaf: true },
              { value: 'Q8434', label: '急救中心（站）服务', isLeaf: true },
              { value: 'Q8435', label: '采供血机构服务', isLeaf: true },
              { value: 'Q8436', label: '计划生育技术服务活动', isLeaf: true },
            ]
          },
          {
            value: 'Q8490', label: '其他卫生活动', children: [
              { value: 'Q8491', label: '健康体检服务', isLeaf: true },
              { value: 'Q8492', label: '临床检验服务', isLeaf: true },
              { value: 'Q8499', label: '其他未列明卫生服务', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'Q8500', label: '社会工作', children: [
          {
            value: 'Q8510', label: '提供住宿社会工作', children: [
              { value: 'Q8511', label: '干部休养所', isLeaf: true },
              { value: 'Q8512', label: '护理机构服务', isLeaf: true },
              { value: 'Q8513', label: '精神康复服务', isLeaf: true },
              { value: 'Q8514', label: '老年人、残疾人养护服务', isLeaf: true },
              { value: 'Q8515', label: '临终关怀服务', isLeaf: true },
              { value: 'Q8516', label: '孤残儿童收养和庇护服务', isLeaf: true },
              { value: 'Q8519', label: '其他提供住宿社会救助', isLeaf: true },
            ]
          },
          {
            value: 'Q8520', label: '不提供住宿社会工作', children: [
              { value: 'Q8521', label: '社会看护与帮助服务', isLeaf: true },
              { value: 'Q8522', label: '康复辅具适配服务', isLeaf: true },
              { value: 'Q8529', label: '其他不提供住宿社会工作', isLeaf: true },
            ]
          },
        ]
      },
    ]
  },
  {
    value: 'R0000', label: '文化、体育和娱乐业', children: [
      {
        value: 'R8600', label: '新闻和出版业', children: [
          { value: 'R8610', label: '新闻业', isLeaf: true },
          {
            value: 'R8620', label: '出版业', children: [
              { value: 'R8621', label: '图书出版', isLeaf: true },
              { value: 'R8622', label: '报纸出版', isLeaf: true },
              { value: 'R8623', label: '期刊出版', isLeaf: true },
              { value: 'R8624', label: '音像制品出版', isLeaf: true },
              { value: 'R8625', label: '电子出版物出版', isLeaf: true },
              { value: 'R8626', label: '数字出版', isLeaf: true },
              { value: 'R8629', label: '其他出版业', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'R8700', label: '广播、电视、电影和影视录音制作业', children: [
          { value: 'R8710', label: '广播', isLeaf: true },
          { value: 'R8720', label: '电视', isLeaf: true },
          { value: 'R8730', label: '影视节目制作', isLeaf: true },
          { value: 'R8740', label: '广播电视集成播控', isLeaf: true },
          { value: 'R8750', label: '电影和广播电视节目发行', isLeaf: true },
          { value: 'R8760', label: '电影放映', isLeaf: true },
          { value: 'R8770', label: '录音制作', isLeaf: true },
        ]
      },
      {
        value: 'R8800', label: '文化艺术业', children: [
          { value: 'R8810', label: '文艺创作与表演', isLeaf: true },
          { value: 'R8820', label: '艺术表演场馆', isLeaf: true },
          {
            value: 'R8830', label: '图书馆与档案馆', children: [
              { value: 'R8831', label: '图书馆', isLeaf: true },
              { value: 'R8832', label: '档案馆', isLeaf: true },
            ]
          },
          { value: 'R8840', label: '文物及非物质文化遗产保护', isLeaf: true },
          { value: 'R8850', label: '博物馆', isLeaf: true },
          { value: 'R8860', label: '烈士陵园、纪念馆', isLeaf: true },
          { value: 'R8870', label: '群众文体活动', isLeaf: true },
          { value: 'R8890', label: '其他文化艺术业', isLeaf: true },
        ]
      },
      {
        value: 'R8900', label: '体育', children: [
          {
            value: 'R8910', label: '体育组织', children: [
              { value: 'R8911', label: '体育竞赛组织', isLeaf: true },
              { value: 'R8912', label: '体育保障组织', isLeaf: true },
              { value: 'R8919', label: '其他体育组织', isLeaf: true },
            ]
          },
          {
            value: 'R8920', label: '体育场地设施管理', children: [
              { value: 'R8921', label: '体育场馆管理', isLeaf: true },
              { value: 'R8929', label: '其他体育场地设施管理', isLeaf: true },
            ]
          },
          { value: 'R8930', label: '健身休闲活动', isLeaf: true },
          {
            value: 'R8990', label: '其他体育', children: [
              { value: 'R8991', label: '体育中介代理服务', isLeaf: true },
              { value: 'R8992', label: '体育健康服务', isLeaf: true },
              { value: 'R8999', label: '其他未列明体育', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'R9000', label: '娱乐业', children: [
          {
            value: 'R9010', label: '室内娱乐活动', children: [
              { value: 'R9011', label: '歌舞厅娱乐活动', isLeaf: true },
              { value: 'R9012', label: '电子游艺厅娱乐活动', isLeaf: true },
              { value: 'R9013', label: '网吧活动', isLeaf: true },
              { value: 'R9019', label: '其他室内娱乐活动', isLeaf: true },
            ]
          },
          { value: 'R9020', label: '游乐园', isLeaf: true },
          { value: 'R9030', label: '休闲观光活动', isLeaf: true },
          {
            value: 'R9040', label: '彩票活动', children: [
              { value: 'R9041', label: '体育彩票服务', isLeaf: true },
              { value: 'R9042', label: '福利彩票服务', isLeaf: true },
              { value: 'R9049', label: '其他彩票服务', isLeaf: true },
            ]
          },
          {
            value: 'R9050', label: '文化娱乐体育活动和经纪代理服务', children: [
              { value: 'R9051', label: '文化活动服务', isLeaf: true },
              { value: 'R9052', label: '体育表演服务', isLeaf: true },
              { value: 'R9053', label: '文化娱乐经纪人', isLeaf: true },
              { value: 'R9054', label: '体育经纪人', isLeaf: true },
              { value: 'R9059', label: '其他文化艺术经纪代理', isLeaf: true },
            ]
          },
          { value: 'R9090', label: '其他娱乐业', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'S0000', label: '公共管理、社会保障和社会组织', children: [
      { value: 'S9100', label: '中国共产党机关', isLeaf: true },
      {
        value: 'S9200', label: '国家机构', children: [
          { value: 'S9210', label: '国家权力机构', isLeaf: true },
          {
            value: 'S9220', label: '国家行政机构', children: [
              { value: 'S9221', label: '综合事务管理机构', isLeaf: true },
              { value: 'S9222', label: '对外事务管理机构', isLeaf: true },
              { value: 'S9223', label: '公共安全管理机构', isLeaf: true },
              { value: 'S9224', label: '社会事务管理机构', isLeaf: true },
              { value: 'S9225', label: '经济事务管理机构', isLeaf: true },
              { value: 'S9226', label: '行政监督检查机构', isLeaf: true },
            ]
          },
          {
            value: 'S9230', label: '人民法院和人民检察院', children: [
              { value: 'S9231', label: '人民法院', isLeaf: true },
              { value: 'S9232', label: '人民检察院', isLeaf: true },
            ]
          },
          {
            value: 'S9290', label: '其他国家机构', children: [
              { value: 'S9291', label: '消防管理机构', isLeaf: true },
              { value: 'S9299', label: '其他未列明国家机构', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'S9300', label: '人民政协、民主党派', children: [
          { value: 'S9310', label: '人民政协', isLeaf: true },
          { value: 'S9320', label: '民主党派', isLeaf: true },
        ]
      },
      {
        value: 'S9400', label: '社会保障', children: [
          {
            value: 'S9410', label: '基本保险', children: [
              { value: 'S9411', label: '基本养老保险', isLeaf: true },
              { value: 'S9412', label: '基本医疗保险', isLeaf: true },
              { value: 'S9413', label: '失业保险', isLeaf: true },
              { value: 'S9414', label: '工伤保险', isLeaf: true },
              { value: 'S9415', label: '生育保险', isLeaf: true },
              { value: 'S9419', label: '其他基本保险', isLeaf: true },
            ]
          },
          { value: 'S9420', label: '补充保险', isLeaf: true },
          { value: 'S9490', label: '其他社会保障', isLeaf: true },
        ]
      },
      {
        value: 'S9500', label: '群众团体、社会团体和其他成员组织', children: [
          {
            value: 'S9510', label: '群众团体', children: [
              { value: 'S9511', label: '工会', isLeaf: true },
              { value: 'S9512', label: '妇联', isLeaf: true },
              { value: 'S9513', label: '共青团', isLeaf: true },
              { value: 'S9519', label: '其他群众团体', isLeaf: true },
            ]
          },
          {
            value: 'S9520', label: '社会团体', children: [
              { value: 'S9521', label: '专业性团体', isLeaf: true },
              { value: 'S9522', label: '行业性团体', isLeaf: true },
              { value: 'S9529', label: '其他社会团体', isLeaf: true },
            ]
          },
          { value: 'S9530', label: '基金会', isLeaf: true },
          {
            value: 'S9540', label: '宗教组织', children: [
              { value: 'S9541', label: '宗教团体服务', isLeaf: true },
              { value: 'S9542', label: '宗教活动场所服务', isLeaf: true },
            ]
          },
        ]
      },
      {
        value: 'S9600', label: '基层群众自治组织及其他组织', children: [
          { value: 'S9610', label: '社区居民自治组织', isLeaf: true },
          { value: 'S9620', label: '村民自治组织', isLeaf: true },
        ]
      },
    ]
  },
  {
    value: 'T0000', label: '国际组织', children: [
      {
        value: 'T9700', label: '国际组织', isLeaf: true
      },
    ]
  },
  { value: '9900', label: '个人', isLeaf: true },
];

/** 股东性质 */
export const ShareholderTypes: SelectItemsModel[] = [
  { label: '直接或间接拥有25%以上股份的控股股东-自然人', value: 1 },
  { label: '直接或间接拥有25%以上股份的控股股东-企业', value: 2 },
  { label: '通过人事、财务控制等方式对公司进行控制的自然人', value: 3 },
];

/** 股东证件类型 */
export const ShareholderCarsTypes: SelectItemsModel[] = [
  { label: '身份证', value: 10100 },
  { label: '临时身份证', value: 10200 },
  { label: '护照', value: 10400 },
  { label: '港澳居民来往内地通行证', value: 11100 },
  { label: '台湾居民来往大陆通行证', value: 11300 },
];

/** 对公账号开户银行 */
export const AcctBank: SelectItemsModel[] = [
  { label: '安徽省农村信用社', value: 402361018886 },
  { label: '鞍山银行', value: 313223007007 },
  { label: '奥地利奥合国际银行北京分行', value: 641100010016 },
  { label: '澳大利亚和新西兰银行(中国)', value: 761290013606 },
  { label: '澳大利亚西太平洋银行', value: 762290000019 },
  { label: '包商银行', value: 313192000013 },
  { label: '保定银行', value: 313134000011 },
  { label: '北京农商行', value: 402100000018 },
  { label: '北京银行', value: 313100000013 },
  { label: '本溪市商业银行', value: 313225000017 },
  { label: '比利时联合银行上海分行', value: 651290000015 },
  { label: '渤海银行', value: 318110000014 },
  { label: '沧州银行', value: 313143005157 },
  { label: '朝阳银行', value: 313234001089 },
  { label: '成都农商银行', value: 314651000000 },
  { label: '成都银行', value: 313651099999 },
  { label: '承德银行', value: 313141052422 },
  { label: '创兴银行汕头分行', value: 507586000014 },
  { label: '达州市商业银行', value: 313675090019 },
  { label: '大华银行（中国）', value: 622290000016 },
  { label: '大连银行', value: 313222080002 },
  { label: '大同银行', value: 313162055820 },
  { label: '大新银行（中国）', value: 513584000007 },
  { label: '大众银行（香港）深圳分行', value: 508584000017 },
  { label: '丹东银行清算中心', value: 313226009000 },
  { label: '德国北德意志州银行上海分行', value: 716290000018 },
  { label: '德国商业银行上海分行', value: 713290000014 },
  { label: '德阳银行', value: 313658000014 },
  { label: '德意志银行（中国）', value: 712100000011 },
  { label: '德州银行', value: 313468000015 },
  { label: '第一商业银行上海分行', value: 525290094215 },
  { label: '东方汇理银行（中国）上海分行', value: 694290000013 },
  { label: '东莞农商行', value: 402602000018 },
  { label: '东莞银行', value: 313602088017 },
  { label: '东亚银行（中国）', value: 502290000006 },
  { label: '东营银行', value: 313455000018 },
  { label: '鄂尔多斯银行', value: 313205057830 },
  { label: '法国巴黎银行（中国）', value: 782290000018 },
  { label: '法国外贸银行', value: 695290000018 },
  { label: '法国兴业银行(中国)', value: 691100000011 },
  { label: '福建海峡银行', value: 313391080007 },
  { label: '福建省农村信用社', value: 402391000068 },
  { label: '抚顺银行', value: 313224000015 },
  { label: '阜新银行', value: 313229000008 },
  { label: '富邦华一银行', value: 787290000019 },
  { label: '富滇银行', value: 313731010015 },
  { label: '甘肃银行', value: 313821050016 },
  { label: '赣州银行', value: 313428076517 },
  { label: '广东华兴银行', value: 313586000006 },
  { label: '广东南粤银行', value: 313591001001 },
  { label: '广东省农村信用社', value: 402581090008 },
  { label: '广东顺德农商行', value: 314588000016 },
  { label: '广发银行', value: 306581000003 },
  { label: '广西北部湾银行', value: 313611001018 },
  { label: '广西壮族自治区农村信用社', value: 402611099974 },
  { label: '广州农商行', value: 314581000011 },
  { label: '广州银行', value: 313581003284 },
  { label: '贵阳银行', value: 313701098010 },
  { label: '贵州省农村信用社联合社', value: 402701002999 },
  { label: '贵州银行', value: 313701099012 },
  { label: '桂林银行', value: 313617000018 },
  { label: '国家开发银行总行', value: 201100000017 },
  { label: '国民银行（中国）', value: 598100000016 },
  { label: '国泰世华商业银行上海分行', value: 523290000011 },
  { label: '哈尔滨银行', value: 313261000018 },
  { label: '哈密市商业银行', value: 313884000016 },
  { label: '海口联合农商行', value: 314641000014 },
  { label: '海南省农村信用社', value: 402641000014 },
  { label: '海南银行', value: 313641099995 },
  { label: '邯郸银行', value: 313127000013 },
  { label: '韩国产业银行', value: 594290000014 },
  { label: '韩亚银行(中国)', value: 597100000014 },
  { label: '汉口银行', value: 313521000011 },
  { label: '杭州银行', value: 313331000014 },
  { label: '河北省农村信用社', value: 402121000009 },
  { label: '河北银行', value: 313121006888 },
  { label: '河南省农村信用社', value: 402491000026 },
  { label: '荷兰安智银行上海分行', value: 662290000010 },
  { label: '荷兰合作银行上海分行', value: 776290000010 },
  { label: '黑龙江省农村信用社', value: 402261000004 },
  { label: '恒丰银行', value: 315456000105 },
  { label: '恒生银行(中国)上海分行', value: 504290005116 },
  { label: '衡水银行', value: 313148053964 },
  { label: '葫芦岛银行', value: 313227600018 },
  { label: '湖北省农村信用社', value: 402521000032 },
  { label: '湖北银行', value: 313521006000 },
  { label: '湖南省农村信用社', value: 402551080008 },
  { label: '湖州银行', value: 313336071575 },
  { label: '花旗银行(中国)', value: 531290088881 },
  { label: '华美银行(中国)', value: 775290000018 },
  { label: '华侨银行(中国)', value: 621290000011 },
  { label: '华融湘江银行', value: 313551070008 },
  { label: '华夏银行', value: 304100040000 },
  { label: '徽商银行', value: 319361000013 },
  { label: '汇丰银行(中国)上海分行', value: 501290000012 },
  { label: '吉林省农村信用社', value: 402241000015 },
  { label: '吉林银行', value: 313241066661 },
  { label: '集友银行福州分行', value: 506391000019 },
  { label: '济宁银行', value: 313461000012 },
  { label: '加拿大丰业银行广州分行', value: 751581000013 },
  { label: '嘉兴银行', value: 313335081005 },
  { label: '江苏常熟农商行', value: 314305506621 },
  { label: '江苏江南农商行', value: 314304099999 },
  { label: '江苏江阴农商行', value: 314302200018 },
  { label: '江苏省农村信用社', value: 402301099998 },
  { label: '江苏银行', value: 313301099999 },
  { label: '江苏长江商业银行', value: 313312300018 },
  { label: '江西省农村信用社', value: 402421099990 },
  { label: '江西银行', value: 313421087506 },
  { label: '交通银行', value: 301290000007 },
  { label: '焦作中旅银行', value: 313501080608 },
  { label: '金华银行', value: 313338009688 },
  { label: '锦州银行', value: 313227000012 },
  { label: '晋城银行', value: 313168000003 },
  { label: '晋商银行', value: 313161000017 },
  { label: '晋中银行', value: 313175000011 },
  { label: '九江银行', value: 313424076706 },
  { label: '库尔勒市商业银行', value: 313888000013 },
  { label: '昆仑银行', value: 313882000012 },
  { label: '昆山农商行', value: 314305206650 },
  { label: '莱商银行', value: 313463400019 },
  { label: '兰州银行', value: 313821001016 },
  { label: '廊坊银行', value: 313146000019 },
  { label: '乐山市商业银行', value: 313665092924 },
  { label: '凉山州商业银行', value: 313684093748 },
  { label: '辽宁省农村信用社', value: 402221010013 },
  { label: '辽阳银行', value: 313231000013 },
  { label: '临商银行', value: 313473070018 },
  { label: '柳州银行', value: 313614000012 },
  { label: '龙江银行', value: 313261099913 },
  { label: '泸州市商业银行', value: 313657092617 },
  { label: '洛阳银行', value: 313493080539 },
  { label: '马来西亚马来亚银行上海分行', value: 611290000010 },
  { label: '美国建东银行厦门分行', value: 534393000015 },
  { label: '美国银行', value: 532290010011 },
  { label: '蒙特利尔银行（中国）广州分行', value: 752581012131 },
  { label: '绵阳市商业银行', value: 313659000016 },
  { label: '摩根大通银行(中国)', value: 533100000009 },
  { label: '摩根士丹利国际银行（中国）', value: 771585000010 },
  { label: '南充市商业银行', value: 313673093259 },
  { label: '南京银行', value: 313301008887 },
  { label: '南洋商业银行（中国）', value: 503290000007 },
  { label: '内蒙古银行', value: 313191000011 },
  { label: '内蒙古自治区农村信用社', value: 402191009992 },
  { label: '宁波通商银行', value: 313332090019 },
  { label: '宁波银行', value: 313332082914 },
  { label: '鄞州银行', value: 402332010004 },
  { label: '宁夏黄河农商行', value: 402871099996 },
  { label: '宁夏银行', value: 313871000007 },
  { label: '攀枝花市商业银行', value: 313656000019 },
  { label: '盘谷银行(中国)', value: 631290000002 },
  { label: '盘锦市商业银行', value: 313232000015 },
  { label: '平安银行', value: 307584007998 },
  { label: '平顶山银行', value: 313495081900 },
  { label: '齐鲁银行', value: 313451000019 },
  { label: '齐商银行', value: 313453001017 },
  { label: '企业银行（中国）', value: 596110000013 },
  { label: '秦皇岛银行', value: 313126001022 },
  { label: '青岛银行', value: 313452060150 },
  { label: '青海省农村信用社', value: 402851000016 },
  { label: '青海银行', value: 313851000018 },
  { label: '曲靖市商业银行', value: 313736000019 },
  { label: '泉州银行', value: 313397075189 },
  { label: '日本三井住友信托银行上海分行', value: 566290000011 },
  { label: '日本山口银行青岛分行', value: 565452000012 },
  { label: '日照银行', value: 313473200011 },
  { label: '瑞典北欧斯安银行上海分行', value: 682290000002 },
  { label: '瑞典商业银行上海分行', value: 681290000016 },
  { label: '瑞典银行上海分行', value: 683290000012 },
  { label: '瑞士信贷银行上海分行', value: 741290032613 },
  { label: '瑞士银行(中国)', value: 742100000016 },
  { label: '瑞穗银行(中国)', value: 564290000010 },
  { label: '三井住友银行(中国)', value: 563290000018 },
  { label: '三菱东京日联银行(中国)上海分行', value: 561290000015 },
  { label: '厦门国际银行', value: 781393010011 },
  { label: '厦门银行', value: 313393080005 },
  { label: '山东省农村信用社', value: 402451000010 },
  { label: '山西省农村信用社', value: 402161002352 },
  { label: '陕西省农村信用社', value: 402791000010 },
  { label: '上海华瑞银行', value: 323290000016 },
  { label: '上海农商银行', value: 322290000011 },
  { label: '上海浦东发展银行', value: 310290000013 },
  { label: '上海银行', value: 325290000012 },
  { label: '上饶银行', value: 313433076801 },
  { label: '绍兴银行', value: 313337009004 },
  { label: '深圳农商行', value: 402584009991 },
  { label: '深圳前海微众银行', value: 323584000888 },
  { label: '盛京银行', value: 313221030008 },
  { label: '石嘴山银行', value: 313872097457 },
  { label: '首都银行', value: 616301000015 },
  { label: '四川省农村信用社', value: 402651020006 },
  { label: '苏格兰皇家银行（中国）', value: 661290000018 },
  { label: '苏州银行', value: 313305066661 },
  { label: '遂宁市商业银行', value: 313662000015 },
  { label: '台州银行', value: 313345001665 },
  { label: '太仓农商行', value: 314305106644 },
  { label: '泰安银行', value: 313463000993 },
  { label: '唐山银行', value: 313124000018 },
  { label: '天津滨海农商行', value: 314110000011 },
  { label: '天津农商行', value: 317110010019 },
  { label: '天津银行', value: 313110000017 },
  { label: '铁岭银行', value: 313233000017 },
  { label: '威海市商业银行', value: 313465000010 },
  { label: '潍坊银行', value: 313458000013 },
  { label: '温州民商银行', value: 323333000013 },
  { label: '温州银行', value: 313333007331 },
  { label: '乌海银行', value: 313193057846 },
  { label: '乌鲁木齐银行', value: 313881000002 },
  { label: '无锡农商行', value: 314302066666 },
  { label: '吴江农商行', value: 314305400015 },
  { label: '武汉农商行', value: 402521090019 },
  { label: '西安银行', value: 313791000015 },
  { label: '西藏银行', value: 313770000016 },
  { label: '新韩银行(中国)', value: 595100000007 },
  { label: '新疆汇和银行', value: 313898100016 },
  { label: '新疆维吾尔自治区农村信用社', value: 402881061690 },
  { label: '星展银行(中国)上海分行', value: 623290000019 },
  { label: '邢台银行', value: 313131000016 },
  { label: '兴业银行', value: 309391000011 },
  { label: '雅安市商业银行', value: 313677000010 },
  { label: '烟台银行', value: 313456000108 },
  { label: '阳泉市商业银行', value: 313163000004 },
  { label: '宜宾市商业银行', value: 313671000017 },
  { label: '意大利联合圣保罗银行上海分行', value: 732290000013 },
  { label: '意大利裕信银行上海分行', value: 731290088889 },
  { label: '英国巴克莱银行上海分行', value: 673290000016 },
  { label: '营口沿海银行', value: 313228060009 },
  { label: '营口银行', value: 313228000276 },
  { label: '永亨银行(中国)深圳分行', value: 510584000016 },
  { label: '永隆银行深圳分行', value: 512584050103 },
  { label: '友利银行(中国)', value: 593100000020 },
  { label: '云南红塔银行', value: 313741095715 },
  { label: '云南省农村信用社', value: 402731057238 },
  { label: '枣庄银行', value: 313454000016 },
  { label: '渣打银行上海分行', value: 671290000017 },
  { label: '张家港农商行', value: 314305670002 },
  { label: '张家口银行', value: 313138000019 },
  { label: '长安银行', value: 313791030003 },
  { label: '长沙银行', value: 313551088886 },
  { label: '长治银行', value: 313164000006 },
  { label: '招商银行', value: 308584000013 },
  { label: '浙江稠州商业银行', value: 313338707013 },
  { label: '浙江民泰商业银行', value: 313345400010 },
  { label: '浙江省农村信用社', value: 402331000007 },
  { label: '浙江泰隆商业银行', value: 313345010019 },
  { label: '浙江网商银行', value: 323331000001 },
  { label: '浙商银行', value: 316331000018 },
  { label: '郑州银行', value: 313491000232 },
  { label: '中德住房储蓄银行', value: 717110000010 },
  { label: '中国工商银行', value: 102100099996 },
  { label: '中国光大银行', value: 303100000006 },
  { label: '中国建设银行', value: 105100000017 },
  { label: '中国进出口银行', value: 202100000003 },
  { label: '中国民生银行', value: 305100000013 },
  { label: '中国农业发展银行', value: 203100000019 },
  { label: '中国农业银行', value: 103100000026 },
  { label: '中国银行总行', value: 104100000004 },
  { label: '中国邮政储蓄银行总行', value: 403100000004 },
  { label: '中信银行总行管理部', value: 302100011000 },
  { label: '中原银行', value: 313491099996 },
  { label: '重庆农商行', value: 314653000011 },
  { label: '重庆三峡银行', value: 321667090019 },
  { label: '重庆银行', value: 313653000013 },
  { label: '珠海华润银行', value: 313585000990 },
  { label: '自贡市商业银行', value: 313655091983 },

];

/** 受益所有人性质 */
export const EarningOwnerType: SelectItemsModel[] = [
  { label: '直接或间接拥有超过25%公司股权或者表决权的自然人', value: 1 },
  { label: '通过人事、财务等其他方式对公司进行控制的自然人', value: 2 },
  { label: '高级管理人员', value: 3 },
  { label: '普通合伙人或者合伙事务执行人', value: 4 },
  { label: '其它', value: 5 },
];

/** 办理类型 */
export const AppApplyType: SelectItemsModel[] = [
  { label: '企业授权经办人办理', value: 2 },
  { label: '法人亲办', value: 1 },
];

/** 平台审核资料状态 */
export const CheckStatus: SelectItemsModel[] = [
  { label: '未审核', value: -1 },
  { label: '通过', value: 1 },
  { label: '不通过', value: 0 },
];

/** 开户状态 */
export const OpenAccountStatus: SelectItemsModel[] = [
  /** 未定义 */
  { label: '', value: 0 },
  /** 已发起提单但未开户的企业为待开户状态 */
  { label: '待开户', value: 1 },
  /** 供应商提交普惠开户申请后的状态 */
  { label: '待平台审核', value: 2 },
  /** 初审发起资料补正流程后供应商未重新补正资料提交之前的状态 */
  { label: '待补正资料', value: 4 },
  /** 平台复核提交后的状态 */
  { label: '待上银审核', value: 5 },
  /** 上海银行复核不通过退回到平台审核的状态 */
  { label: '待平台审核-上银退回', value: 6 },
  /** 已完成 */
  { label: '已完成', value: 8 },
];

/** 供应商对公账户激活状态 */
export const AccountActiveStatus: SelectItemsModel[] = [
  /** 审核还未通过 */
  { label: '未通过', value: 0 },
  /** 待激活 */
  { label: '待激活', value: 1 },
  /** 已激活 */
  { label: '已激活', value: 2 },
];

/** 供应商对公账户激活状态对应类名 */
export const AccountActiveStatusClassName: SelectItemsModel[] = [
  /** 审核还未通过 */
  { label: 'btn-danger', value: 0 },
  /** 待激活 */
  { label: 'btn-warning', value: 1 },
  /** 已激活 */
  { label: 'btn-success', value: 2 },
];

/** 上海银行普惠开户审核状态枚举 */
export const ShPuhuiCheckTypes: SelectItemsModel[] = [
  /** 未定义 */
  { label: '贵司暂未申请开通普惠记账簿，点击下面按钮即可申请', value: 0 },
  /** 已发起提单但未开户的企业为待开户状态 */
  { label: '贵司暂未申请开通普惠记账簿，点击下面按钮即可申请', value: 1 },
  /** 供应商提交普惠开户申请后的状态 */
  { label: '开户申请正在审核中，请耐心等待审核结果', value: 2 },
  /** 初审提交后的状态 */
  { label: '开户申请正在审核中，请耐心等待审核结果', value: 3 },
  /** 初审发起资料补正流程后供应商未重新补正资料提交之前的状态 */
  { label: '审核结果已出，请前往【待办列表】查看审核结果详情', value: 4 },
  /** 平台复核提交后的状态 */
  { label: '开户申请正在审核中，请耐心等待审核结果', value: 5 },
  /** 上海银行复核不通过退回到初审的状态 */
  { label: '开户申请正在审核中，请耐心等待审核结果', value: 6 },
  /** 上海银行复核不通过后，初审提交至复核的状态 */
  { label: '开户申请正在审核中，请耐心等待审核结果', value: 7 },
  /** 已完成 */
  { label: '已完成', value: 8 },
];

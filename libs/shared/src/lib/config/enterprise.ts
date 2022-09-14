/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：EnterpriseData
 * @summary：平台联盟企业信息
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          说明         2019-05-28
 * **********************************************************************
 */

import {Observable, of} from 'rxjs';


export class EnterpriseData {
    static readonly enterprise = [
        {
            name: '深圳市怡亚通供应链股份有限公司',
            id: '100001',
            ref: 'http://www.eascs.com/',
            logo: 'assets/lr/img/logo-yiyatong.jpg',
            data: `
深圳市怡亚通供应链股份有限公司（简称“怡亚通”，股票代码：002183）作为正在推动中国流通商业变革的O2O供应链生态公司，专注于为各类企业、客户、增值服务商、商店以及它们的消费者提供有竞争力的供应链解决方案、生态产品和服务，并致力于构建一个无边界的共享共赢的商业世界，让生态圈所有参与者获得最经济、最大限度的成长。
目前，怡亚通有3万多名员工，网络遍布中国380个城市及全球10多个国家和地区，服务全世界100多家世界500强和2000多家国内外知名企业，覆盖近10亿消费人口。
2017年，怡亚通作为中国供应链领军企业，获评由中国企业联合会、中国企业家协会联合评选的“2017年中国企业500强”第261位、“2017年中国服务业企业500强”第101位，分别比2016年榜单排名提升69位、11位。怡亚通自2011年至2017年连续7年上榜财富中国500强，2017年以583亿元营业收入跃进至110位，是跃进速度最快的企业之一。
`
        },
        {
            name: '雅居乐集团控股有限公司',
            id: '100002',
            ref: 'https://www.agile.com.cn/',
            logo: 'assets/lr/img/logo-yajule.jpg',
            data: `
            雅居乐成立于1992年，是一家以地产为主，多元业务并行的综合性企业集团。一直以来，雅居乐始终关注人们对美好生活的追求，致力于成为优质生活服务商。
            经过27年的发展，雅居乐已形成地产、雅生活、环保、教育、建设、房管、资本投资和商业管理八大产业集团并行运营的格局。截止2018年12月31日，总资产规模超过人民币2300亿元，业务覆盖国内外100多个城市，员工人数超过24000人。
            雅居乐旗下拥有两家上市企业。雅居乐集团控股有限公司(股票代码HK3383)与雅居乐雅生活服务股份有限公司(股票代码HK3319)已分别于2005年和2018年在香港联交所主板上市。雅居乐2018年地产板块预售额为人民币1026.7亿，跻身千亿阵营。雅居乐现为恒生综合指数、恒生环球综合指数、恒生港股通指数系列、恒生高股息率指数、恒生中国内地地产指数、恒生增幅指数、恒生中国(香港上市)100指数，摩根士丹利中国指数及力宝专选中港地产指数的成份股。
            雅居乐的品牌理念是“一生乐活”。`
        },
        {
            name: '万科企业股份有限公司',
            id: '100017',
            ref: 'http://www.vanke.com/',
            logo: 'assets/lr/img/logo-vanke.jpg',
            data: `
            万科企业股份有限公司成立于1984年，经过三十余年的发展，已成为国内领先的城乡建设与生活服务商，公司业务聚焦全国经济最具活力的三大经济圈及中西部重点城市。
            2016年公司首次跻身《财富》“世界500强”，位列榜单第356位；2017年再度上榜，位列榜单第307位。
            2014年万科第四个十年发展规划，已经把“三好住宅供应商”的定位延展为“城市配套服务商”。2018年万科将这一定位进一步迭代升级为“城乡建设与生活服务商”，
            并具体细化为四个角色：美好生活场景师，实体经济生力军，创新探索试验田，和谐生态建设者。
            2017年，深圳地铁集团成为本集团第一大股东，始终支持万科的混合所有制结构，支持万科城市配套服务商战略和事业合伙人机制，支持万科管理团队按照既定战略目标，
            实施运营和管理，支持深化“轨道+物业”发展模式。
            万科始终坚持“为普通人盖好房子，盖有人用的房子”，坚持与城市同步发展、与客户同步发展的两条主线。万科将继续坚持为普通人提供好产品、好服务，通过自身的努力，
            为满足人民对美好生活的各方面需求，做出力所能及的贡献。公司核心业务包括住宅开发、物业服务、长租公寓。2018年，公司将自身定位进一步迭代升级为“城乡建设与生活服务商”，
            所搭建的生态体系已初具规模，在巩固住宅开发和物业服务固有优势的基础上，业务已延伸至商业开发和运营、物流仓储服务、租赁住宅、产业城镇、冰雪度假、养老、教育等领域，为更好的服务人民美好生活需要、实现可持续发展奠定了良好基础。
            `
        },
        {
            name: '龙光地产控股有限公司',
            id: '100003',
            ref: 'http://www.loganestate.com',
            logo: 'assets/lr/img/logo-longguang.jpg',
            data: `
            龙光地产控股有限公司（「龙光地产」或「集团」，股份代号：3380.HK）创立于1996年，于2013年在香港联合交易所主板上市，是中国一家以住宅开发为主的一体化物业发展商，其发展核心区域位于粤港澳大湾区，开发产品为主要针对首次置业人士及改善型置业人士的住宅物业项目。
`
        },
        {
            name: '国信证券股份有限公司',
            id: '100004',
            ref: 'http://www.guosen.com.cn/',
            logo: 'assets/lr/img/logo-guoxin.jpg',
            data: `
            国信证券股份有限公司（简称“国信证券”）前身是1994年6月30日成立的深圳国投证券有限公司。公司总部设在深圳，法定代表人何如。
            经过20多年的发展，国信证券已成长为全国性大型综合类证券公司：截至2018年9月底，注册资本82亿元；员工总数9589人；在全国119个城市和地区共设有53家分公司、164家营业部；拥有国信期货有限责任公司、国信弘盛创业投资有限公司、国信证券（香港）金融控股有限公司等3家全资子公司；50%参股鹏华基金管理有限公司。
            公司及子公司经营范围涵盖：证券经纪，证券投资咨询，与证券交易、证券投资活动有关的财务顾问，证券承销与保荐，证券自营，证券资产管理，融资融券，证券投资基金代销，金融产品代销，为期货公司提供中间介绍业务，证券投资基金托管业务和基金服务业务，股票期权做市，商品期货经纪，金融期货经纪，期货投资咨询、资产管理，受托管理股权投资基金，创业投资业务，代理其他创业投资企业等机构或个人的创业投资业务、创业投资咨询业务，为创业企业提供创业管理服务业务，参与设立创业投资企业与创业投资管理顾问机构，香港证券经纪业务、融资业务及资产管理业务等。
            2014年12月29日，公司首次向社会公开发行股票并在深圳证券交易所上市交易，证券代码“002736”。截至2018年9月底，公司总资产2058.73亿元，归属于上市公司股东净资产520.37亿元。国信证券近5年（2013-2017年）的净资产、净资本、营业收入、净利润等四项核心指标均进入行业前十。
            2018年前三季度，公司实现营业收入63.38亿元，归属于上市公司股东的净利润19.31亿元；公司主要经营指标持续保持行业前列。公司代理买卖证券业务净收入市场份额4.99%（不含席位租赁），行业排名第三；完成全行业首单央企H股“全流通”试点业务（中航科工）。公司完成股票承销家数12.5家，排名行业第九；承销金额226.58亿元，排名行业第七；公司债券承销总规模739.48亿元（按联主承销均分），行业排名靠前；企业债承销金额排名行业第七。
            展望未来，国信证券将继续弘扬“务实、专业、和谐、自律”的企业精神，始终秉持“创造价值、成就你我”的核心理念，开拓进取，不断创新，全力打造国际一流投资银行。
`
        },
        {
            name: '北京东方雨虹防水技术股份有限公司',
            id: '100005',
            ref: 'http://www.yuhong.com.cn/',
            logo: 'assets/lr/img/logo-earst.jpg',
            data: `
            东方雨虹，股票代码：002271，1995年进入建筑防水行业，二十余年来，东方雨虹为重大基础设施建设、工业建筑和民用、商用建筑提供高品质、完备的防水系统解决方案。在“产业报国、服务利民”的指导思想下，公司坚持“建筑建材系统服务商”之发展定位，构建以防水业务为核心的相关多元化产业集团，现已形成建筑防水、民用建材、节能保温、特种砂浆、建筑涂料、非织造布、建筑修缮七大业务板块。
`
        },
        {
            name: '中国建筑集团有限公司',
            id: '100006',
            ref: 'http://www.cscec.com.cn/',
            logo: 'assets/lr/img/logo-china.jpg',
            data: `
            中国建筑集团有限公司（简称中国建筑），正式组建于1982年，是我国专业化发展最久、市场化经营最早、一体化程度最高、全球规模最大的投资建设集团，也是我国建筑领域唯一一家由中央直接管理的国有重要骨干企业。
            中建集团主要以上市企业中国建筑股份有限公司（股票简称：中国建筑，股票代码601668.SH）为平台开展经营管理活动，拥有上市公司7家，二级控股子公司100余家。

`
        },
        {
            name: '交通银行股份有限公司',
            id: '100007',
            ref: 'http://www.bankcomm.com/',
            logo: 'assets/lr/img/logo-jiaobank.jpg',
            data: `
            交通银行始建于1908年，是中国历史最悠久的银行之一，也是近代中国的发钞行之一。1987年4月1日，重新组建后的交通银行正式对外营业，成为中国第一家全国性的国有股份制商业银行，总行设在上海。2005年6月交通银行在香港联合交易所挂牌上市，2007年5月在上海证券交易所挂牌上市。
            交通银行的发展战略是“走国际化综合化道路，建最佳财富管理银行”（简称“两化一行”战略），集团业务范围涵盖商业银行、证券、信托、金融租赁、基金管理、保险、离岸金融服务等。2018年末，交通银行境内分行机构238家，其中省分行30家，直属分行7家，省辖行201家，在全国239个地级和地级以上城市、163个县或县级市共设有3,241个营业网点；旗下非银子公司主要包括全资子公司交银金融租赁有限责任公司、中国交银保险有限公司、交银金融资产投资有限公司，控股子公司交银施罗德基金管理有限公司、交银国际信托有限公司、交银康联人寿保险有限公司、交银国际控股有限公司。此外，交通银行还是江苏常熟农村商业银行股份有限公司的第一大股东、西藏银行股份有限公司的并列第一大股东，战略入股海南银行股份有限公司，控股4家村镇银行。
            交通银行目前已在16个国家和地区设立了22家境外分（子）行及代表处，分别是香港分行及交通银行（香港）有限公司、纽约分行、东京分行、新加坡分行、首尔分行、法兰克福分行、澳门分行、胡志明市分行、旧金山分行、悉尼分行、台北分行、伦敦分行及交通银行（英国）有限公司、交通银行（卢森堡）有限公司及卢森堡分行、布里斯班分行、交通银行（卢森堡）有限公司巴黎分行、交通银行（卢森堡）有限公司罗马分行、交通银行（巴西）股份有限公司、墨尔本分行和多伦多代表处，境外营业网点共66个（不含代表处）
`
        },
        {
            name: '东莞市民兴电缆有限公司',
            id: '100008',
            ref: 'http://www.chinamxc.com/',
            logo: 'assets/lr/img/logo-minxing.jpg',
            data: `东莞市民兴电缆有限公司是专业生产电线电缆的大型现代化企业，成立于1988年10月1日，公司立足于中国经济脉络中最强劲、最活跃之珠三角腹地，拥有面积40000多平方米的生产基地。公司本着“务实、进取、精益、创新”的经营管理理念，重视人才、尊重人才，凝聚了一批具有现代化企业经营管理经验和运作能力的行业精英以及一批大学本科以上学历的专业营销队伍。近三十年来的专业生产经验造就了“追求卓越品质，选择民兴电缆”的良好顾客口碑。
            民兴电缆自成立以来，一贯坚持“高标准、严要求、快节奏、高效率”的营运风格，产品先后通过ISO9000质量体系认证、国家CCC认证、国际标准产品认证、BASEC标准认证、SAA澳大利亚标准认证，并荣获中国著名品牌、广东省名牌产品、广东省著名商标等一系列荣誉。民兴电缆一贯坚持“品质至坚，服务至诚”的理念，以一流的服务与广大用户建立并保持了长久良好的合作关系。我们诚邀社会各界新老朋友光临指导、加深了解、真诚合作。
`
        },
        {
            name: '金龙羽集团股份有限公司',
            id: '100009',
            ref: 'http://www.szjly.com',
            logo: 'assets/lr/img/logo-jinloyu.jpg',
            data: `
            金龙羽集团股份有限公司由金龙羽集团有限公司整体变更改制设立，其前身为深圳市金龙羽电缆实业发展有限公司，成立于1996年4月，位于深圳市龙岗区吉华街道吉华路288号，集团包括深圳和惠州两个生产基地，总占地面积33万平方米，是一家专业从事电线电缆的研发、生产、销售与服务的企业，产品注册商标为“金龙羽”。 2017年7月17日，公司在深圳证券交易所Ａ股成功上市（股票简称：金龙羽，股票代码：002882）。
`
        },
        {
            name: '中国农业银行股份有限公司',
            id: '100010',
            ref: 'http://www.abchina.com/cn/',
            logo: 'assets/lr/img/logo-chinabank.jpg',
            data: `
            本行的前身最早可追溯至1951年成立的农业合作银行。上世纪70年代末以来，本行相继经历了国家专业银行、国有独资商业银行和国有控股商业银行等不同发展阶段。2009 年1月，本行整体改制为股份有限公司。2010年7月，本行分别在上海证券交易所和香港联合交易所挂牌上市。
            　　本行是中国主要的综合性金融服务提供商之一，致力于建设经营特色明显、服务高效便捷、功能齐全协同、价值创造能力突出的国际一流商业银行集团。本行凭借全面的业务组合、庞大的分销网络和领先的技术平台，向广大客户提供各种公司银行和零售银行产品和服务，同时开展金融市场业务及资产管理业务，业务范围还涵盖投资银行、基金管理、金融租赁、人寿保险等领域。截至2016年末，本行总资产195,700.61亿元，发放贷款和垫款97,196.39亿元，吸收存款150,380.01亿元，资本充足率13.04%，全年实现净利润1,840.60亿元。
            　　截至2016年末，本行境内分支机构共计23,682个，包括总行本部、总行营业部、3个总行专营机构，37个一级（直属）分行，365个二级分行（含省区分行营业部），3,506个一级支行（含直辖市、直属分行营业部，二级分行营业部）、19,714个基层营业机构以及55个其他机构。境外分支机构包括10家境外分行和3家境外代表处。本行拥有14家主要控股子公司，其中境内9家，境外5家。
            　　2014年起，金融稳定理事会连续三年将本行纳入全球系统重要性银行名单。2016年，在美国《财富》杂志世界500强排名中，本行位列第29位；在英国《银行家》杂志全球银行1,000强排名中，以一级资本计，本行位列第5位。本行标准普尔发行人信用评级为A/A-1，惠誉长/短期发行人违约评级为A/F1。
`
        },
        {
            name: '中国邮政储蓄银行股份有限公司 ',
            id: '100011',
            ref: 'http://www.psbc.com',
            logo: 'assets/lr/img/logo-chinaemailbank.jpg',
            data: `
            中国邮政储蓄银行（以下简称“邮储银行”）是中国领先的大型零售商业银行，定位于服务“三农”、城乡居民和中小企业，致力于为中国经济转型中最具活力的客户群体提供服务。同时，邮储银行积极服务于大型客户并参与重大项目建设，为中国经济发展作出了重要贡献。
            邮储银行拥有近4万个营业网点，服务个人客户达5.87亿户，拥有优异的资产质量和显著的成长潜力。目前，邮储银行打造了包括网上银行、手机银行、自助银行、电话银行、微信银行等在内的全方位电子银行体系，形成了电子渠道与实体网络互联互通，线下实体银行与线上虚拟银行齐头并进的金融服务格局。2015年，邮储银行引入十家境内外战略投资者，进一步提升了综合实力。2016年，邮储银行在香港交易所主板成功上市，正式登陆国际资本市场，完成“股改—引战—上市”三步走改革目标。2017年，邮储银行成功发行境外优先股，进一步优化资本结构，拓宽资本补充渠道。
            在中国经济转型升级、金融改革纵深推进、信息技术蓬勃发展的大背景下，邮储银行将紧抓战略新机遇，充分发挥自身优势，不断丰富业务品种、拓宽服务渠道、提升服务能力，为广大客户提供更加全面、便捷的金融服务，致力于成为客户信赖、特色鲜明、稳健安全、创新驱动、价值卓越的一流大型零售银行。
`
        },
        {
            name: '招商银行股份有限公司',
            id: '100012',
            ref: 'http://www.cmbchina.com',
            logo: 'assets/lr/img/logo-zhaoshangbank.jpg',
            data: `
            招商银行1987年成立于中国改革开放的最前沿——深圳蛇口，是中国境内第一家完全由企业法人持股的股份制商业银行，也是国家从体制外推动银行业改革的第一家试点银行。
            招商银行诞生以来，开创了中国银行业的数十个第一：创新推出了具有里程碑意义的、境内第一个基于客户号管理的借记卡——“一卡通”;首个真正意义上的网上银行——“一网通”；第一张国际标准双币信用卡;首个面向高端客户的理财产品——“金葵花理财”；率先推出银行业首个智能投顾产品——“摩羯智投”,并在境内银行业率先推出了离岸业务、买方信贷、国内信用证业务、企业年金业务、现金管理业务、银关通业务、公司理财与网上承兑汇票业务等。
            成立32年来，招商银行始终坚持“因您而变”的经营服务理念，品牌知名度日益提升。在英国权威金融杂志《银行家》公布的全球银行1000强榜单中，招商银行按一级资本在2018年排名第20位，比2017年提高3个位次；而在全球银行品牌价值500强榜单上，招行已进入了全球10强，2019年位列第9位。在《财富》世界500强榜单中，招商银行连续7年入榜，2018年名列世界第213位。
            截至2018年年底，招商银行境内外分支机构逾1800家，在中国大陆的130余个城市设立了服务网点，拥有6家境外分行和3家境外代表处，员工7万余人。此外，招商银行还在境内全资拥有招银金融租赁有限公司，控股招商基金管理有限公司，持有招商信诺人寿保险有限公司50%股权、招联消费金融公司50%股权；在香港全资控股招商永隆银行有限公司和招银国际金融控股有限公司，是一家拥有商业银行、金融租赁、基金管理、人寿保险、境外投行等金融牌照的银行集团。
            近年来，招商银行紧密围绕打造“轻型银行”的转型目标，实现“质量、效益、规模”动态均衡发展，经营结构持续优化，数字化招行初具规模，国际化、综合化深入推进。2018年，招商银行资产规模稳步增长，核心盈利能力进一步增强，利润增速位居行业前列；不良贷款余额和不良贷款率“双降”，资产质量持续向好；资本充足率不断提升，实现良好的资本内生增长。2018年，招行的A股和H股PB继续位列境内主要上市银行榜首。
            着眼未来，招商银行深入推进创新驱动发展战略，加快建设金融科技银行，以科技敏捷带动业务敏捷。2018年，招行信息科技投入达65.02亿元，同比增长35.17%，并按上一年度营业收入的1%提取金融科技创新项目基金。下一步，招行将紧紧围绕客户需求，深度融合科技与业务，快速迭代、持续交付产品和服务，创造最佳客户体验，实现效率、成本、风险的最佳平衡。
`
        },
        {
            name: '中天建设集团有限公司',
            id: '100013',
            ref: 'http://zjzhongtian.com',
            logo: 'assets/lr/img/logo-zhontian.jpg',
            data: `
            “中天建设集团”在国内已形成以杭州、上海、北京、西安、武汉、广州、天津、成都、沈阳等中心城市为主的区域市场，经营地域覆盖国内二十几个省、市、自治区，海外业务已拓展到非洲、中东、南亚、东南亚等地，年竣工面积超2800万平方米。中天的设计板块由“中天设计”、“中怡设计”、“天怡设计”三家综合型设计院和多家专业型设计院组成，杭州、上海两座设计研发大楼先后投入使用。近几年来，中天建设通过调结构、促升级、控风险、求发展，向技术型、质量型、投融资结合型、总承包型和建筑工业化产品服务集成供应商转变。因实施卓越的绩效管理，“中天建设”被浙江省政府授予首届省政府质量奖。是中国建筑业协会副会长单位。2017年引入中国建设银行全资子公司建信资本管理公司，完成混合所有制改造。
`
        },
        {
            name: '金地（集团）股份有限公司',
            id: '100014',
            ref: 'http://www.gemdale.com/',
            logo: 'assets/lr/img/logo-jindi.jpg',
            data: `
            金地集团1988年初创于中国深圳，1993年开始经营房地产业务，2001年在上交所上市（600383.SH），是中国较早上市并实现全国化布局的房地产企业。目前业务包括住宅开发与销售、商用地产开发与销售及持有运营、房地产金融、物业服务与社区经营、以网球为核心的体育产业集群运营，开发及持有的住宅及商用地产项目覆盖中国7大区域，50座城市，并在美国覆盖东西海岸的6个不同城市和地区，拥有13个项目。
            金地集团以“科学筑家”为使命，30年来秉持“科学筑家，智美精工”的产品理念，为中国超过60万户家庭提供标准化、系列化的住宅与社区商业产品，是中国建设系统企业信誉AAA单位、房地产开发企业国家一级资质单位。基于多年来对客户价值观的深入研究，金地推出的 “褐石”、“名仕”、“格林”、“风华”、“未来”、“天境”、“世家”、“峯汇”、“社区商业”等9大系列标准化产品，满足不同消费价值观、不同家庭生命周期的客户需求；基于对客户生活方式的前瞻研究，金地推出"HOME+"、“360°健康家”、“Micro Climate 微气候智慧决策系统”、“五心精装家”、“Life智享家”等一系列通用标准化研发成果，高度契合客户的生活形态。
`
        },
        {
            name: '四川华西集团有限公司',
            id: '100015',
            ref: 'http://www.huashi.sc.cn/index.html',
            logo: 'assets/lr/img/logo-huaxi.jpg',
            data: `
            四川华西集团有限公司始建于1950年5月，由建工部一局、四川省人民政府建筑工程局、建工部西南管理局三大系统汇聚而成，前身为四川省建设厅、四川省建筑工程总公司、四川华西集团总公司。经过六十多年的发展演进，现已成为西部、全国乃至海外都具有重要影响力的大型国有建筑集团之一。
            集团拥有4个房屋建筑施工总承包特级资质企业，业务涉及工程承包、房地产开发、建材、对外投资、海外业务、科研设计、金融、周材租赁、医院等多个领域，市场遍及全国30多个行政区以及海外20多个国家和地区，年营业收入500亿元以上。拥有国家级实验室及博士后创新实践基地，有享受国务院特殊津贴专家、勘察设计大师、建造大师以及各类专业技术人员约2万人，科研、设计能力在业内具有突出优势。曾获“全国五一劳动奖状”、“全国先进施工企业”、“全国守合同，重信用”企业等众多荣誉称号。获得中国建筑领域最高奖——“鲁班奖”及“创鲁班工程特别荣誉奖”34项，中国土木工程詹天佑奖7项，国家优质工程奖35项，天府杯、白玉兰杯、金牛奖等工程质量奖千余项。现列“中国企业500强”第321位，“ENR中国承包商80强”第14位
`
        },
        {
            name: '中信证券股份有限公司 ',
            id: '100016',
            ref: 'http://www.cs.ecitic.com/newsite/',
            logo: 'assets/lr/img/logo-zhongxin.jpg',
            data: `
            中信证券股份有限公司成立于1995年10月，2003年在上海证券交易所挂牌上市交易，2011年
            在香港联合交易所挂牌上市交易。中信证券第一大股东为中国中信有限公司（系中国中信集团有
            限公司的控股子公司），现持股比例16.50%。
                  2018年，中信证券实现营业收入人民币372.21亿元，归属于母公司股东的净利润人民币
            93.90亿元。中信证券在国内市场积累了广泛的声誉和品牌优势，多年来获得亚洲货币
            、英国金融时报、福布斯、沪深证券交易所等境内外机构颁发的各类奖项。
`
        },
//         {
//             name: '旗丰集团',
//             id: '100001',
//             ref: 'http://www.eascs.com/',
//             logo: 'assets/lr/img/logo-qifen.jpg',
//             data: `
// 深圳市怡亚通供应链股份有限公司（简称“怡亚通”，股票代码：002183）作为正在推动中国流通商业变革的O2O供应链生态公司，专注于为各类企业、客户、增值服务商、商店以及它们的消费者提供有竞争力的供应链解决方案、生态产品和服务，并致力于构建一个无边界的共享共赢的商业世界，让生态圈所有参与者获得最经济、最大限度的成长。
// 目前，怡亚通有3万多名员工，网络遍布中国380个城市及全球10多个国家和地区，服务全世界100多家世界500强和2000多家国内外知名企业，覆盖近10亿消费人口。
// 2017年，怡亚通作为中国供应链领军企业，获评由中国企业联合会、中国企业家协会联合评选的“2017年中国企业500强”第261位、“2017年中国服务业企业500强”第101位，分别比2016年榜单排名提升69位、11位。怡亚通自2011年至2017年连续7年上榜财富中国500强，2017年以583亿元营业收入跃进至110位，是跃进速度最快的企业之一。
// `
//         },
        {
            name: '深圳齐心集团股份有限公司',
            id: '100018',
            ref: 'http://about.comix.com.cn/#home',
            logo: 'assets/lr/img/logo-qixin.jpg',
            data: `
            深圳齐心集团股份有限公司（以下简称“公司”）始创于1991年，2009年在深圳A股成功上市，公司主要业务为：办公物资研发、生产和销售；云视频办公服务。公司基于对企业办公移动化、智能化、平台化、社交化发展的趋势判断，秉持“夯实主业、打造平台、布局生态”的发展战略，致力于打造“硬件+软件+服务”的企业办公服务平台，满足企业级客户的一站式办公采购和服务需求。公司以“B2B办公物资+云视频”双轮驱动，通过持续叠加商品品类与服务，为客户提供多场景办公服务。
            1、B2B办公物资业务公司是国内B2B办公物资领域的领跑者，始终坚持以企业级客户需求为导向。基于对客户办公需求的深刻理解，顺应办公物资电商化、集中化、集成化采购发展趋势，公司建立了B2B企业办公服务平台（www.qx.com），通过B2B、O2O、LINK、API等多种聚合平台接入模式，提升集采效率和客户体验，有效降低综合办公成本，满足企业级客户的一站式办公采购和服务需求。围绕B2B办公物资服务，公司持续打造核心竞争力：在商品方面，围绕客户需求加强商品规划，不断丰富办公物资品类；在技术方面，进一步完善以OMS\COP\MDM等为中台、以SAP ERP系统、WMS智能仓储管理系统等为后台的一体化信息服务系统，通过优化数据运营平台，实现了上游供应商、公司运营管理、第三方服务与客户内部管理系统的有效衔接，提升办公物资采购电商化服务能力；在渠道方面，加快构建全国横纵一体化的服务网络；在供应链方面，提升客户订单履约能力和供应链整合能力，不断提升企业级集采服务交付能力。
            2、SaaS服务公司不断加强各业务的渠道共享和协同发展，自2015年始，公司将SaaS服务作为软件服务的重要发展方向，目前形成了以云视频、云计算服务为战略业务，以大数据营销等为创新业务的业务矩阵。子公司银澎云计算，拥有大并发、QOS稳定传输技术、视频增益音频降噪等80多项知识产权，依托云视频会议细分领域的领导品牌“齐心好视通”，完成从PC端、笔记本、Ipad端、手机端、电视端的跨终端、全平台、全场景覆盖，除了应用于企业级云视频移动会议办公需求外，还可广泛用于智慧党建、智慧教育、远程培训、远程医疗、远程招聘、应急指挥等丰富场景。未来，公司将以PaaS开放平台为基础，不断完善PaaS平台功能，通过PaaS+SaaS综合服务，持续深挖客户需求，巩固在云视频领域的领先地位。
`
        },
        {
            name: '中国光大银行股份有限公司',
            id: '100019',
            ref: 'http://www.cebbank.com/',
            logo: 'assets/lr/img/logo-guangda.jpg',
            data: `
            中国光大银行（CHINA EVERBRIGHT BANK、光大银行）成立于1992年8月，是经国务院批复并经中国人民银行批准设立的全国性股份制商业银行，总部设在北京。中国光大银行于2010年8月在上海证券交易所挂牌上市、2013年12月在香港联合交易所挂牌上市。 [1-2]
            截至2017年12月31日，中国光大银行已在境内设立分支机构1196 家，实现境内省级行政区域服务网络的全覆盖，机构网点辐射全国129个经济中心城市。加快国际化布局，香港分行、首尔分行、光银国际、光银欧洲、卢森堡分行相继开业运营，悉尼分行申请设立，社会责任日益彰显，持续多年支持“母亲水窖”公益活动在社会上产生较大影响；在英国《银行家》杂志2017年发布的“全球1000家大银行排行榜”中，中国光大银行位列第49位； [3]  在英国《银行家》杂志2018年发布的“全球1000家大银行排行榜”中位列第39位，排名较去年增长10位 [4]  。
`
        },
        {
            name: '华金证券股份有限公司',
            id: '100020',
            ref: 'http://www.huajinsc.cn/HJ_GW_001/gw_gyhj/gw_ljhh/index.html',
            logo: 'assets/lr/img/logo-huajin.jpg',
            data: `
            华金证券股份有限公司（以下简称“华金证券”或“公司”）前身是设立于2000年9月的上海久联证券经纪有限责任公司；2005年3月，由中国航天科工集团公司等单位实施重组并更名为航天证券有限责任公司；2014年3月，公司引进战投，并增资扩股，成为珠海金融投资控股集团有限公司旗下的重要成员企业。2014年12月，公司更名为华金证券有限责任公司。2016年12月，公司完成股份制改制，更名为“华金证券股份有限公司”。目前，公司注册资本为人民币34.5亿元。
            华金之名，有“放眼中华”、“风华正茂”之意，含“金融创新”、“点石成金”之喻，公司总部位于上海市浦东新区陆家嘴世纪金融广场，公司立足沪上金融制高点，以奋斗者为本，为成功者点赞，汇英才、融财富、聚正气，为上海金融创新驱动，转型发展贡献正能量。
            公司将依托珠海横琴区位、政策优势，联动港澳，面向全国，放眼全球，布局“三驾马车双平台”的战略发展方向，以“投行加投资”、“中小型金融/企业的特色资管”、“富裕客户财富管理”为三驾马车，自营与研究业务为双平台，致力于打造以业务协同管理平台和服务中型集团客户为核心特色的一流券商。
`
        },
        {
            name: '中山证券有限责任公司',
            id: '100021',
            ref: 'http://www.zszq.com/',
            logo: 'assets/lr/img/logo-zhongshan.jpg',
            data: `
            中山证券有限责任公司，成立于1992年，总部位于深圳，注册资本17亿元，是一家全牌照的综合类证券公司，拥有投资银行、零售业务、资产管理、固定收益、证券投资等完整业务体系。中山证券控股上海大陆期货有限公司、深圳锦弘和富投资管理有限公司；参股益民基金管理有限公司、世纪证券有限责任公司。
            一直以来，中山证券始终坚持以客户为中心，坚持“以奋斗者为本、以创造者为尊”的核心价值观，秉承“诚信、专业、协同、稳健”的经营理念，充分发挥综合金融服务优势，在服务实体经济、促进多层次资本市场稳健发展等方面贡献自身力量。
            公司经营范围：证券经纪；证券投资咨询；与证券交易、证券投资活动有关的财务顾问；证券承销与保荐；证券自营；证券资产管理；融资融券；证券投资基金代销；为期货公司提供中间介绍业务；代销金融产品。
`
        },
        {
            name: '华能贵诚信托有限公司',
            id: '100022',
            ref: 'https://www.hngtrust.com/Site/hngc/CN',
            logo: 'assets/lr/img/logo-huaneng.jpg',
            data: `
            华能贵诚信托有限公司（以下简称华能信托），是中国华能集团旗下的专业从事信托业务的非银行金融机构，公司注册资本金20亿元。
            华能信托建立了权责制衡、界面清晰的公司法人治理结构；组建了高素质、专业化的业务管理团队；具备雄厚的产品研发、创新实力；构建了覆盖公司各类业务的操作流程、经营层级及四级镶嵌式风控体系；搭建了涵盖公司业务开展、财务管理、监管对接等需求的信息系统功能模块和信息管理系统。
            华能信托除强化公司本部的功能建设外，分别在北京、上海、深圳、宁波等地建立业务联络处，现已形成以公司所在地市场为依托，以全国市场为支撑的业务发展格局。
            在2009年公司实现高起点、稳起步的基础上，经过三年坚持不懈的努力，公司各项工作迈上一个新的台阶，标志着华能贵诚在国内外经济形势复杂多变和信托市场竞争不断加剧的背景下，成功地解决了公司长期面临的生存问题，初步实现了从重组型公司向发展型公司的转变，为公司工作更好更快的发展创造了较好的条件。
        `
        },

//         {
//             name: '深圳市思贝克工业发展有限公司',
//             id: '100002',
//             ref: 'http://www.spek.com.cn/',
//             logo: 'assets/lr/img/spek.jpg',
//             data: `
// 深圳市思贝克工业发展有限公司成立于2012年3月，总部位于深圳市南山区大冲商务中心D座18楼，注册资本3,333万元。
// “思贝克O2O电子商务平台” 是以互联网创新为核心的工业品专业服务平台，以O2O运营模式联接上下游产业，为多个制造行业中的工业企业提供产品销售、采购与供应链金融服务。通过重塑工业品渠道价值，构建集专业工业品线上线下销售、供应链金融服务于一体的创新服务平台。
// 2017年，思贝克荣登中国互联网百强榜，获得“国家级电子商务示范企业”称号，供应链金融产品位列“中国在线供应链金融五十佳”。
// `
//         },
//         {
//             name: '深圳市联合利丰供应链管理有限公司',
//             id: '100003',
//             ref: 'http://www.ufscs.com/',
//             logo: 'assets/lr/img/unifor.jpg',
//             data: `
// 深圳市联合利丰供应链管理有限公司（以下简称“联合利丰”）成立于2010年12月29日，注册资本11764.706万元人民币。是一家主要向3C行业、医疗设备厂商、IDC数据存储服务商等客户提供集综合外贸服务、订单执行服务、商业保理服务和通路平台服务等高端制造供应链服务的公司。公司通过向客户提供通关商检、国内物流、国际物流、保税物流、VMI供应商库存管理、JIT配送、商务外包等物流供应链服务以及通过向客户提供采购融资与服务、分销融资与服务、订单融资与服务、制造管理与服务等订单执行服务，构筑一个向企业提供较为全面的一体化供应链服务平台。
// 联合利丰是广东省外贸综合服务试点企业、深圳市重点物流企业。公司拥有含6项专利的自主知识产权供应链服务平台信息系统，公司员工254人，旗下10个分子公司，自有办公面积超过4000m²。
// `
//         },
//         {
//             name: '深圳市大道晟供应链管理有限公司',
//             id: '100004',
//             ref: 'http://www.big-road.com/',
//             logo: 'assets/lr/img/big-road.jpg',
//             data: `
// 深圳市大道晟供应链管理有限公司（以下简称“公司”）成立于2009年，目前注册资本为1500万元，现有员工17人，本科学历以上15人。
// 公司专注于提供“大消费”领域的供应链管理服务，遵循人人是老板、人人控风险的理念，目前主要以“事业部”、“控股子公司”的模式进行操作。公司在专注“大消费”领域的同时，重点以“物联网”贯穿于农副产品的全程追踪，拟打造出“货真价实、绿色环保”的可溯源产品提供给广大消费者。目前，公司已拥有国内100强客户5家，国际500强客户2家。
// 公司本着以“专注、专心”为核心，以“诚实、诚信”为信条，以“双赢、多赢”为理念，以“为供应链上下游客户解决痛点”为目标，做到不求最大，但求最好；不求最快，但求稳健发展的可持续经营。
// 公司将以细分行业的专业供应链服务为主轴，向资本市场和未来持续迈进。
// `
//         },
//         {
//             name: '腾邦集团有限公司',
//             id: '100005',
//             ref: 'http://www.tempus.cn/',
//             logo: 'assets/lr/img/tempus.jpg',
//             data: `
// 腾邦集团创立于1998年，正稳健成长为全球瞩目的万亿级跨国集团，旗下拥有腾邦国际集团、腾邦旅游集团、腾邦资产集团、腾邦金控集团、腾邦投资集团、腾邦物流集团六大产业集团，深度布局大旅游、资产运营、行业金融、投资管理、全球商品贸易、全球价值链等现代服务全产业生态链；业务范围覆盖亚洲、美洲、欧洲、大洋洲、非洲及全球157个国家和地区，全球雇员3.6万人；连续多年雄踞中国500强、深圳100强榜单前席。腾邦旗下两家上市公司，腾邦国际（股票代码：300178.SZ）和腾邦控股（股票代码：06880.HK）分别进驻国内和国际资本市场。`
//         },
//         {
//             name: '深圳市创捷供应链有限公司',
//             id: '100006',
//             ref: 'http://www.strongjet.com.cn/',
//             logo: 'assets/lr/img/sjet.jpg',
//             data: `
// 深圳市创捷供应链有限公司（以下简称创捷供应链）成立于2007年，办公地点位于深圳市福田区深南大道1006号深圳国际创新中心A栋15楼，注册资金6428.5714万元。 公司拥有多名博士、硕士等行业内的专家，核心高层管理拥有行业至少8年以上的经验，大专学历以上专业人才占员工总数的80%以上。已由初期单一的进出口业务，发展成为一家集供应链管理、进出口贸易、电子设备器材购销、供应链系统研发于一体的综合性供应链运营商，主要业务涵盖了供应链执行服务、供应链集成服务及供应链方案服务三大内容，涉及的产品类型包括IT产品、通信类产品、平板显示、快速消费品、医疗器械、机电产品、新材料新能源、汽车零配件等。获得多项资质与荣誉：公司已获得海关总署认定的“海关AA企业”、深圳海关“客户协调员制度企业”、2008－2012深圳海关“十佳纳税大户”、2010年深圳市进出口纳税前十名、中行AAA信用客户、工行AA信用客户、建行AA信用客户、深圳市进出口诚信联盟——“诚信AAA企业”、深圳海关“高信用企业”、深圳市商检局“诚信企业”、2009－2012年中国银行深圳分行钻石客户、建设银行深圳分行钻石客户等多项资质与荣誉，是深圳供应链行业的佼佼者。`
//         },
//         {
//             name: '深圳市前海一帆珠宝云商有限公司',
//             id: '100007',
//             ref: 'https://www.goldstonebank.com/',
//             logo: 'assets/lr/img/yun.jpg',
//             data: `
// 深圳市前海一帆珠宝云商有限公司（简称“前海一帆云商”）总部位于深圳盐田国家珠宝文化创意产业基地，2015年9月成立，注册资本人民币2亿元。由深圳市粤豪珠宝有限公司（持股60%）、广东潮宏基实业股份有限公司（上市股票代码：002345，持股30%）与贺春雷先生（持股10%）共同投资成立。前海一帆云商专注于黄金珠宝行业，凭借核心团队在黄金珠宝行业产业链金融服务方面的丰富经验以及对珠宝产业多年的行业研究和独创的风控系统，势必打造一家在黄金珠宝行业内极具影响力的产业金融生态链平台公司。目前提供的业务主要有赊销业务、库存管理、增信服务、店铺托管等，截至到2017年8月累计提供金融产业服务达到20亿元。`
//         },
//         {
//             name: '阳光采购网',
//             id: '100008',
//             ref: 'https://www.fairpur.com/',
//             logo: 'assets/lr/img/fairpur.jpg',
//             data: `
// 阳光采购网（fairpur.com）是深圳市创捷科技有限公司旗下独立运营的B2B平台，成立于2015年9月，运营主体为深圳前海产业互联网股份有限公司，以“创新B2B交易平台，为中小企业提供高效金融科技服务”为使命，以“成为金融科技行业值得信赖的合作伙伴”为愿景，通过产业链集成，为中小微企业提供信息化与金融科技服务的B2B平台。
// 阳光采购网的商业模式赢得了资本市场的关注和信赖，引入的资本方包括“盈信投资集团”、“粤美特集团”、“金活医药集团”。
// 阳光采购网以金融科技服务为核心，依托大数据分析及SaaS应用，通过为中小企业提供丰富的业务场景和交易工具，让更多的社会资金进入实体经济，使得中小企业有生意可做，有生意能做；同时与行业领先企业、组织、实体市场展开合作，培育建设行业产融小生态，带动中小企业进一步发展，帮助企业以低成本实现全渠道营销、订单管理及订单融资，促进全行业生产力和利润率的双提升。
// `
//         },
//         {
//             name: '深圳市年富供应链有限公司',
//             id: '100009',
//             ref: 'http://www.erscs.com/',
//             logo: 'assets/lr/img/ever.jpg',
//             data: `
// 深圳市年富供应链有限公司成立于2008年7月，注册资本1.45亿人民币，公司总部设于深圳。年富作为国内领先的一体化供应链集成服务商，是广东省、深圳市外贸综合型服务企业、全国海关AEO高级认证企业（原全国海关AA类企业）、深圳海关客户协调员企业、深圳市重点物流企业、广东省支持大型骨干企业。公司旗下拥有联富供应链（前海）、贵州年富和郑州年富三家全资子公司，在深圳和香港设立运营中心，并在香港和福田保税区拥有自己的仓储配送基地。经过多年的发展，年富已逐步形成了其独特的专业供应链服务模式和服务优势。
// 年富根据价值创新、利益共享的经营理念，依托专业化团队的智慧、经验能力以及公司搭建的外贸综合服务平台，运用各种供应链服务、财务工具、风险管理和信息管理等技术手段，为客户量身定制融资金流、商流、物流和信息流于一体的供应链解决方案，专业承接企业非核心业务外包——商务外包、物流外包、结算外包、信息系统以及数据库处理外包。提供结算、票证、税务、汇兑等服务，以及商务、通关、商检、物流和信息等配套服务，确保客户外部交易和供应链运作过程的快捷、柔性、安全和可靠，从而达到帮助客户提高效率、降低成本、提升经营规模和整体效益的目的。
// 作为国内领先的外贸综合服务商，年富提供进出口代理、采购执行、分销执行、虚拟生产、VMI、供应链财务、等服务；涉及IT、电子、通讯、粮油、农产品、生鲜产品、酒类、化工、矿产能源、有色金属、医疗等行业。服务的1200多家客户和合作伙伴为世界500强、国内外知名采购商、制造商、分销商、第三方服务商、集成商和金融机构等。
// `
//         },
//         {
//             name: '信利康供应链',
//             id: '100010',
//             ref: 'http://www.xinlikang.com/',
//             logo: 'assets/lr/img/xin.jpg',
//             data: `
// 信利康供应链是国内领先的供应链管理解决方案服务商，公司致力于搭建商流，物流，资金流，信息流、技术流五流合一的供应链服务平台，为客户提供包括国际采购、
// 分销执行、VMI服务、虚拟生产、进出口通关、运输管理、仓储、配送、资金结算、信息管理等服务平台降低企业非核心业务的运营成本，优化企业服务水平与供应链运
// 作成本的平衡，提升企业核心竞争力。信利康始终秉承“诚信、务实、创新”的作风不断提升自己的服务品质，为客户提供卓越而完善的供应链解决方案，服务涉及的行
// 业包括电子数码、IT通讯、电脑周边、光电仪器等相关行业，信利康已经建立起强大的客户群，形成稳定的战略联盟，包括艾睿、安富利、大联大、富昌、西门子、宇
// 龙、科陆、拓邦、美的等世界500强及国内的知名电子相关企业。随着公司的不断发展，香港、北京、上海分公司相继成立，业绩量每年以60%的速度飞速增长，市场占
// 有率及品牌知名度也在稳健提高。信利康凭借一直以来“诚信经营”的理念获得业界、合作伙伴的高度认可，先后获得“海关部署AA类企业”、“广东省民营百强企业”、
// “深圳市便利直通车服务企业”、“福田区纳税百佳”、“深圳市知名品牌”、“深圳市重点物流企业”“深圳市企业文化优秀建设单位””“第三届福田区区长质量奖”等几十项殊荣。
// `
//         },
        // {
        //     name: '深圳市飞马国际供应链股份有限公司',
        //     id: '100011',
        //     ref: 'http://www.fmscm.com/',
        //     logo: 'assets/lr/img/fmscm.jpg',
        //     data: `
        //     深圳市飞马国际供应链股份有限公司成立于1998年。公司于2006年完成股份制改制，并于2008年在中国深圳证券交易所上市（股票代码：002210
        //     ；股票简称：飞马国际）。公司主营业务为供应链管理服务，包括综合供应链服务、煤炭供应链服务、塑化供应链服务和有色金属供应链服务。
        //     多年来公司通过不断强化和提升供应链技术与运作能力，为客户提供其核心业务以外的集商流、物流、资金流、信息流为一体的供应链外包方案与运营。
        //     并依托完善的网络布局、独特的供应链服务模式、优质的服务品质、功能强大的信息系统以及勤勉敬业的专业团队和不断创新的供应链产品，赢得了国内
        //     外客户的广泛赞誉。公司一直积极履行企业社会责任。在汶川地震、玉树地震及舟曲特大泥石流灾害等自然灾害发生后，公司均积极组织各平台、各部门
        //     进行募捐活动。2011年，公司肩负深圳人民的重托被选为深圳第26届世界大学生夏季运动会物流独家供应商，并出色完成了大运会各项物流保障任务,为
        //     大运会的精彩举办谱写了“不一样的精彩”乐章。公司获得的主要荣誉有：“深圳第26届世界大学生夏季运动会物流独家供应商”、“深圳市民营领军骨干企
        //     业”、“深圳市重点物流企业”、中国物流与采购联合会授予的“AAA级信用企业“、 中国海关总署授予的“AA类管理资质企业”、中国建设银行“总行级重点
        //     客户”和“2011 年度国际业务钻石客户”，深圳发展银行“战略合作伙伴”，中国工商银行“国际业务钻石客户”，获评“2009 年度中国物流百强第19 名”
        //     和“2008 年度中国国际货代物流百强第21名”，深圳市福田区政府认定的“纳税百佳民营企业”等。路漫求索，飞马腾飞。公司将继续秉承“诚信为本、
        //     技术引领、精益服务”的经营理念，坚持“尊重人、激励人、成就人”的员工管理思路，致力于客户供应链效率和效益最大的基本原则，将公司打造成为国
        //     际领先的技术型供应链服务商！
        //     `
        // },
        // {
        //     name: '深圳市朗华供应链服务有限公司',
        //     id: '100012',
        //     ref: 'http://www.cbscs.com/',
        //     logo: 'assets/lr/img/cbscs.jpg',
        //     data: `
        //         朗华成立于2006年，注册资金1亿元，下辖15家分、子及控股公司，拥有员工1000余名，资产数十亿元。企业立足微笑曲线左半边，服务实体经济与
        //         工业制造环节。业务辐射全国200多个大中城市及北美洲、南美洲、南亚、非洲等国家和地区。服务产业链上下游10000+家客户，提供包括跨境管理
        //         综合服务、精细化仓储、全球采购及销售、供应链金融、展示与交易、中欧班列等服务在内的一站式供应链服务。并在机电设备、电子通讯、医疗
        //         器械、智能硬件、机器人、高端消费品等领域拥有领先的服务优势。凭借先进的技术优势，朗华在跨境、仓储、物流、金融、电商等领域取得56项
        //         软件著作权和多项产品证书，通过海关AEO高级认证，多次蝉联中国民营企业500强，凭借创新经营获“中国供应链最佳创新企业”奖。建企以来，朗华
        //         累计营收超969亿元，累计纳税超190亿元（含海关关税和增值税），一般贸易进出口累计突破318亿美元，领航行业发展。朗华遵循“勤奋、包容、
        //         创新、分享”的价值观，奉行“努力赢得尊重，专业赢得信任”的蜜蜂精神与“百善孝为先，百事行为先”的“孝行”文化，为员工提供完善的的福利体系
        //         和发展通道；肩负社会责任，数年来为乡村建设、捐资助学、扶贫济困、公益宣传等公益慈善事业捐助达亿元。未来，朗华以“五横三纵”为发展战略，
        //         布局国际化战略“41111”工程，满足生产需求，降低流通成本，提升产品价值，致力于成为全球制造与消费综合服务商。
        //     `
        // },
        {
            name: '深圳市旗丰供应链服务有限公司',
            id: '100023',
            ref: 'http://www.firstflag.com.cn/',
            logo: 'assets/lr/img/logo-qifen.jpg',
            data: `
                旗丰集团是以供应链服务、供应链金融、供应链地产三大产业为核心的多元化跨领域经营的集团公司，旗下包括：深圳市旗丰供应链服务有限公司、
                深圳前海旗丰供应链管理有限公司、旗丰集团控股子公司马鞍山数字硅谷科技股份有限公司(股票代码835576)等数十家覆盖多个行业领域的子公司。
                旗丰集团以“成就中国企业旗扬四海、丰誉五洲”为使命，历经十几年的发展，已构建以物流、资金流、信息流、商流与增值流为载体，以生产型供应链服务、流通消费
                型供应链服务、产品整合型供应链服务、供应链金融服务、供应链产业园区服务为核心的综合型服务平台，成功进入电子、通讯、金融、食品、电商等行业，为众多世
                界500强及国内外知名企业提供解决方案与服务，服务网络遍布中国内地主要城市及香港、海外。深圳市旗丰供应链服务有限公司（以下简称旗丰供应链）成立于2004年，
                专注于为各类行业企业提供专业化供应链服务。公司分别在香港、深圳设立国际、国内运作中心，拥有170000平呎标准化国际仓库，并在国内20多个大中城市设有合作
                仓库，为客户提供国际物流、国际仓储服务以及海运、陆运、空运等全方位的物流服务。旗丰供应链已获海关AEO高级认证企业、深圳海关和国检局所评定的诚信单位、
                深圳A类纳税企业、深圳一类退税企业、深圳市重点物流企业、诚信AAA企业等五十多项各类荣誉。旗丰供应链目前主要客户包括乐视、龙旗、欣旺达、拓邦、科陆、
                新飞通、路必康、朵唯等跨国型大型企业及上市公司，与客户形成合作共赢的良好关系。
            `
        },
        // {
        //     name: '深圳市前海一帆珠宝云商有限公司',
        //     id: '100014',
        //     ref: 'https://www.yifan365.com/',
        //     logo: 'assets/lr/img/yifan.jpg',
        //     data: `
        //     深圳市前海一帆珠宝云商有限公司（简称“一帆云商”或“云商”）于2015年9月诞生，是在黄金珠宝批发龙头粤豪珠宝的引导下，由深圳市粤豪珠宝有限公司、
        //     广东潮宏基实业股份有限公司（股票代码：002345）、贺春雷先生联手投资创立的一家股份有限公司，公司注册资本为2亿元。一帆云商是以多条线立体
        //     式的服务网络沟通黄金珠宝行业内的多方，以云商为枢纽实现统一战略合作。一帆云商将资金端、大型零售品牌端、小型零售终端、加工源头等多方市场
        //     参与者金融需求信息进行统一的梳理与整合，作为桥梁沟通多方有无，协调生态圈内资源，实现“优质企业共发展，合力打造生态圈”的合作势头，
        //     推动黄金珠宝市场的进步与发展。
        //     `
        // },
        {
            name: '宝德科技集团股份有限公司',
            id: '100024',
            ref: 'http://www.powerleader.com.cn/index.php?lang=zh-CN',
            logo: 'assets/lr/img/logo-baode.jpg',
            data: `
            宝德科技集团是在香港上市，以服务器、云计算、大数据等为主营业务的综合性IT企业集团，是中国领先的IT解决方案和服务供应商。
            宝德是客户值得信赖的意见提供商及问题解决商。宝德拥有亚洲最大的服务器产业基地，多年稳居国产服务器销售前三强、亚太十强，其在中国率先添补高端服
            务器空白且是全国第一个安腾服务器技术输出商，自主研发的服务器多次刷新SPEC WEB世界记录。
            宝德是国家工信部CSIP云计算研究中心专家单位，参与中国云计算标准的制定，获“最佳国产云计算解决方案奖”等顶级认可，已形成涵盖MaaS、IaaS、PaaS、SaaS、
            CaaS五个层面的云计算整体解决方案服务能力，可为各个行业客户打造智慧的云计算基础架构平台。
            宝德拥有中国存储年度创新产品、国家重点新产品，宝德数据中心以软硬件一体化定制服务领先业内，宝德亦是中国大数据行业先行者之一，等等。
            宝德善于整合全球IT智慧不断提升本土服务。宝德和Intel是核心战略合作伙伴关系，有宝德Intel五大联合实验室、宝德-Intel联合培训中心等。亦有宝德-微软联合
            体验中心、宝德研究院、博士后创新实践基地等众多创新平台。
            宝德与华为、NEC、Infinova、海尔、腾讯、百度、阿里巴巴、工信部、北京大学、北京奥运会等全球数万客户成为亲密伙伴，携手成长、共创共赢。
            宝德构筑了以“市场洞察系统”为引擎、以“资源整合力”、“解决方案力”、“营销体验力”、“本土服务力”为四轮驱动的支撑体系，全面聚焦客户业务增长。
            其按需定制生产模式、亚直销销售模式、厂商一站式服务模式等均享誉业界。
            宝德是国家火炬计划重点高新技术企业、中国创新企业，曾获福布斯“中国潜力100”企业 、中国上市公司成长百强31位等。其子公司宝德网络2010年成为首家
            国内A股上市的网游公司(中青宝)。前国家主席、中共中央总书记胡锦涛在调研宝德时指出：“希望你们能坚持自主创新，生产出更多的好产品，为国家信息化发展多做贡献！”
            宝德聚焦于“创新数据智慧，促进业务增长”， 帮助企业成功、帮助人们提升工作效率和改善生活。
            以德为宝，相伴共生。
            `
        },
        {
            name: '广田建设工程有限公司',
            id: '100025',
            ref: 'http://www.gtjscn.com/',
            logo: 'assets/lr/img/logo-guangtian.jpg',
            data: `
                广田集团成立于1995年，是一家以建筑装饰设计与施工，绿色建材研发与生产为主体的专业化、综合性上市集团企业（股票代码：002482），
                是行业内资质种类最全、等级最高的领军企业，在华南地区位列第一。公司连续两年荣膺《财富》中国500强企业，是国家级高新技术企业、
                国家级守合同重信用企业。拥有安全技术防范系统设计、施工、维修壹级；机电设备安装工程专业承包壹级；建筑智能化工程设计与施工壹级；
                建筑幕墙专项工程设计甲级；建筑装饰专项工程设计甲级；金属门窗工程专业承包壹级；消防设施工程设计与施工壹级；城市园林绿化壹级；
                建筑幕墙工程专业承包壹级；建筑装修装饰施工专业承包壹级资质。
                时光无限，奋斗不止，广田建设以精细化管理为手段，努力打造工程科学化，细节专业化，管理现代化的建筑公司。深化改革，开拓创新，进一步整合公司资源，
                以持续、良好的安全施工回报社会的信任，以持续稳健的增长赢得业界的称赞。
            `
        },

        {
            name: '海王集团',
            id: '100026',
            ref: 'http://www.neptunus.com/',
            logo: 'assets/lr/img/logo-haiwang.jpg',
            data: `
            海王集团成立于1989年，是一家以医药工业和生物工程为核心的大型综合性企业集团。
            海王集团立足生物制药产业前沿，积极推动科技创新，在医药产业和生物工程产业等领域不断开拓，迅速成长。
            目前海王集团的总资产为80多亿，2007年销售额75多亿元，综合实力在全国医药企业中位居前列。
            海王拥有中国医药行业最具价值品牌，“海王”商标为中国驰名商标。2013年，在中国品牌价值研究院、中央国情调查委员会与焦点中国网联合主办的“中国品牌500强”排序发布活动中，
            海王以其鲜明的品牌定位、强大的品牌竞争力荣获“中国品牌500强”大奖，名列医药行业第一名。
            评定中，名列中国医药行业第一名。“海王”品牌价值269.19亿元人民币。海王，已成为国内健康产业领域具有广泛影响的知名品牌。海王拥有国内较高水平的医药产品研究开发体系、
            生产制造体系和市场营销体系，综合实力在中国医药产业界位居前列。
            海王将以市场为导向，以科技为龙头，以创新为灵魂，瞄准世界高新技术产业前沿，把握国际高新技术发展趋势，利用已有的资源优势，建立健全医药产业系统，使产品开发、
            生产和营销过程系统化、规范化、集约化，不断扩大企业规模，提高企业经济效益和资源效益，力争在不远的将来，成为一个国内领先、极具国际竞争意识与能力的技术创新型制药企业。
            `
        },
        {
            name: '武汉佰钧成技术有限责任公司',
            id: '100027',
            ref: 'http://www.bill-jc.com/',
            logo: 'assets/lr/img/logo-baijun.jpg',
            data: `
        <p>武汉佰钧成技术有限责任公司（以下简称“佰钧成”）致力成为中国领先的数字技术服务提供商，总部位于中国科教之城武汉。自2006年成立以来，佰钧成秉承“创造价值 承诺必达”的服务宗旨，迅速成长为IBM、华为、Google、Microsoft等全球500强企业在信息服务领域的重要合作伙伴。</p>
        <p>目前，佰钧成在中国大陆设立了26个分支机构或研发中心，并在美国、日本、新加坡和中国香港地区设立了分支机构，正逐步建成服务全球的需求响应机制。经过多年积累，佰钧成拥有了丰富的大型项目管理经验，在高科技、通信、能源、金融、制造等行业形成了独具特色的行业解决方案。</p>
        <p>佰钧成遵循国际先进的CMMI ML5、ISO27001、ISO9001、ISO14001、OHSAS18000等管理体系，聚焦集成服务、平台服务两大核心能力，深入了解客户需求，为客户打造核心竞争力提供可持续的数字技术服务，从而实现与客户的合作共赢。</p>
            `
        },
        // {
        //     name: '好家庭集团',
        //     id: '100020',
        //     ref: 'http://www.goodfamily.cc/',
        //     logo: 'assets/lr/img/goodfamily.jpg',
        //     data: `
        //     <p>好家庭集团公司成立于1994年，秉承“传播健康理念，倡导健康生活方式，最大程度满足民众对健康生活的需求”的企业使命，以“强大的品牌、创新的研发、专业的服务、高效的运营”为经营特色。多年来好家庭一直坚持质量和品质，致力于科技创新，以品质创新立足市场。为消费者提供的不仅仅是产品，更是一种健康的生活方式，赢得大众良好口碑，为市场带来更具竞争力的产品的过程中，也引领着行业的持续健康发展。</p>
        //     `
        // },
        {
            name: '软通动力信息技术（集团）有限公司',
            id: '100028',
            ref: 'http://www.isoftstone.com/',
            logo: 'assets/lr/img/logo-ruan.jpg',
            data: `
            <p>软通动力信息技术（集团）有限公司（以下简称：软通动力）是中国领先的创新型软件及信息技术服务商。公司2001年成立于北京，立足中国，服务全球市场。经过16年发展，目前公司在全球61个城市设有120余个分支机构33个全球交付中心，员工总数近40000人 。 </p>
            <p>软通动力具备端到端“软件+服务”综合业务能力和强大的纵深服务优势，凭借深厚的技术实力和强大的生态整合能力，公司主营业务覆盖软件技术服务、企业数字化转型服务、智慧城市服务以及云计算与互联网平台服务四大业务领域。</p>
            `
        },
        {
            name: '中国工商银行股份有限公司',
            id: '100029',
            ref: 'http://www.icbc.com.cn',
            logo: 'assets/lr/img/logo-gongshang.jpg',
            data: `
            中国工商银行成立于1984年1月1日。2005年10月28日，整体改制为股份有限公司。2006年10月27日，成功在上交所和香港联交所同日挂牌上市。经过持续努力和稳健发展，已经迈入世界领先大银行行列，拥有优质的客户基础、多元的业务结构、强劲的创新能力和市场竞争力，向全球532万公司客户和4.96亿个人客户提供广泛的金融产品和服务。通过持续推动改革创新和经营转型，资产负债业务在结构调整中保持稳定的盈利水平，零售金融、资产管理和投资银行成为盈利增长的重要引擎，领先的互联网金融发展推动了经营管理模式和服务方式的根本变革。国际化、综合化经营格局不断完善，境外网络扩展至42个国家和地区，海外业务和基金、保险、租赁等综合化子公司的盈利贡献不断提升。2015年获评《欧洲货币》“全球新兴市场最佳银行”，连续三年位列《银行家》全球1000家大银行和美国《福布斯》全球企业2000强榜首。
            `
        }
    ];

    private static getEnterpriseData(): any {
        return EnterpriseData.enterprise;
    }

    private static getDetailData(aid): any {
        for (const row of EnterpriseData.enterprise) {
            if (row.id === aid) {
                return row;
            }
        }
    }

    /**
     * 获取enterprise信息 首页的10家企业
     * @returns {any}
     */
    static getEnterprise(): Observable<any> {
        return of(EnterpriseData.getEnterpriseData());
    }

    /**
     * 获取具体的某家企业的信息
     * @returns {any}
     */
    static getDetail(aid: number): Observable<any> {
        return of(EnterpriseData.getDetailData(aid));
    }
}

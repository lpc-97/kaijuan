/*
 * 开卷备考 · 考试目录
 * 所有链接均为中国大陆可直连的站点（见 tools/linkcheck.js 直连检测）。
 * facts 只收录相对稳定的考试结构信息；报名时间、费用、合格线等以官方当年公告为准。
 *
 * 字段说明
 *   id        考试 ID（也是题库文件名 data/questions/<id>.js）
 *   cat       所属分类 ID
 *   family    考试族（同族考试在详情页互相推荐）
 *   kw        默认资源搜索关键词；bili / mooc / books 为各平台的额外关键词
 *   bank      是否有题库与闪卡
 *   hot       是否在首页“热门备考路线”展示
 */
window.KJ_CATALOG = {
  updated: '2026-10-08',

  categories: [
    { id: 'xueli', name: '学历提升', glyph: '学', desc: '高考、考研、专升本、自考与成人高考' },
    { id: 'gongkao', name: '公务员与事业单位', glyph: '公', desc: '国考省考、事业单位、军队文职' },
    { id: 'jiaoshi', name: '教师资格', glyph: '师', desc: '中小学教师资格笔试与面试' },
    { id: 'waiyu', name: '外语与国际中文', glyph: '语', desc: '四六级、雅思托福、日语、翻译资格、HSK' },
    { id: 'caikuai', name: '财会金融', glyph: '财', desc: '初中级会计、CPA、税务师、证券基金银行期货、经济师' },
    { id: 'falv', name: '法律', glyph: '法', desc: '国家统一法律职业资格考试' },
    { id: 'yiyao', name: '医药卫生', glyph: '医', desc: '医师、护士、药师与卫生专业技术资格' },
    { id: 'it', name: '计算机与软件', glyph: '码', desc: '计算机等级考试、软考' },
    { id: 'jianzhu', name: '建筑工程', glyph: '建', desc: '一建二建、造价工程师、消防工程师' },
    { id: 'shenghuo', name: '驾考与职业技能', glyph: '证', desc: '驾照科目一/四、普通话、导游、社工' }
  ],

  /* 资源平台：{q} 会被替换为 URL 编码后的关键词 */
  platforms: [
    { id: 'bilibili', name: '哔哩哔哩', kind: '视频课', home: 'https://www.bilibili.com', search: 'https://search.bilibili.com/all?keyword={q}', desc: '名师公开课、真题精讲、经验分享' },
    { id: 'icourse163', name: '中国大学MOOC', kind: '大学课程', home: 'https://www.icourse163.org', search: 'https://www.icourse163.org/search.htm?search={q}', desc: '985/211 高校免费在线课程' },
    { id: 'xuetangx', name: '学堂在线', kind: '大学课程', home: 'https://www.xuetangx.com', search: 'https://www.xuetangx.com/search?query={q}', desc: '清华大学发起的慕课平台' },
    { id: 'smartedu', name: '国家智慧教育平台', kind: '官方课程', home: 'https://www.smartedu.cn', search: '', desc: '教育部国家智慧教育公共服务平台' },
    { id: 'ximalaya', name: '喜马拉雅', kind: '音频', home: 'https://www.ximalaya.com', search: 'https://www.ximalaya.com/so/{q}', desc: '通勤路上听课、背诵' },
    { id: 'douban', name: '豆瓣读书', kind: '书评', home: 'https://book.douban.com', search: 'https://search.douban.com/book/subject_search?search_text={q}', desc: '先看评分和书评，再决定买哪本' },
    { id: 'jd', name: '京东图书', kind: '购书', home: 'https://book.jd.com', search: 'https://search.jd.com/Search?keyword={q}&enc=utf-8', desc: '教材与真题册' },
    { id: 'zhihu', name: '知乎', kind: '经验', home: 'https://www.zhihu.com', search: 'https://www.zhihu.com/search?type=content&q={q}', desc: '上岸经验、复习规划' }
  ],

  /* AI 助教：web 为网页版（免费，复制提示词后打开）；api 为 OpenAI 兼容接口（需自备 Key，浏览器直连） */
  ai: [
    { id: 'deepseek', name: 'DeepSeek', web: 'https://chat.deepseek.com', api: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', keyUrl: 'https://platform.deepseek.com/api_keys' },
    { id: 'kimi', name: 'Kimi', web: 'https://www.kimi.com', api: 'https://api.moonshot.cn/v1/chat/completions', model: 'moonshot-v1-8k', keyUrl: 'https://platform.moonshot.cn/console/api-keys' },
    { id: 'qwen', name: '通义千问', web: 'https://www.qianwen.com', api: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-plus', keyUrl: 'https://bailian.console.aliyun.com' },
    { id: 'zhipu', name: '智谱清言', web: 'https://chatglm.cn', api: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash', keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys' },
    { id: 'doubao', name: '豆包', web: 'https://www.doubao.com/chat/' },
    { id: 'yuanbao', name: '腾讯元宝', web: 'https://yuanbao.tencent.com' }
  ],

  exams: [
    /* ───────── 学历提升 ───────── */
    {
      id: 'gaokao', cat: 'xueli', family: '高考', name: '普通高等学校招生全国统一考试', short: '高考',
      aliases: ['gaokao', 'gk', '新高考'],
      org: '教育部教育考试院、各省级教育招生考试机构',
      summary: '普通高校本专科招生的全国统一考试，各省在全国统考基础上组织本省科目与录取。',
      facts: [
        '全国统考一般自每年 6 月 7 日开始，各省具体科目与日程以本省公告为准',
        '多数省份已实行新高考，采用“3+1+2”或“3+3”选考模式',
        '报名、志愿填报与录取查询以各省教育考试院和阳光高考平台为准'
      ],
      official: [
        { label: '阳光高考（教育部高校招生信息平台）', url: 'https://gaokao.chsi.com.cn' },
        { label: '国家中小学智慧教育平台', url: 'https://basic.smartedu.cn' }
      ],
      kw: '高考', bili: ['高考数学 一轮复习', '高考英语 语法', '高考物理 专题'], books: ['五年高考三年模拟'], mooc: []
    },
    {
      id: 'kaoyan-math', cat: 'xueli', family: '考研', name: '考研数学（数学一/二/三）', short: '考研数学',
      aliases: ['kaoyan', 'ky', '考研', '研究生', '数一', '数二', '数三', '高数'],
      org: '教育部教育考试院（全国统考科目命题）',
      summary: '全国硕士研究生招生考试的统考数学科目，按报考专业分为数学一、数学二、数学三。',
      facts: [
        '满分 150 分，考试时长 3 小时',
        '数学一、数学三考查高等数学、线性代数、概率论与数理统计；数学二不考概率论与数理统计',
        '初试一般在每年 12 月下旬举行，网上报名与准考证打印均在研招网进行'
      ],
      official: [{ label: '中国研究生招生信息网（研招网）', url: 'https://yz.chsi.com.cn' }],
      kw: '考研数学', bili: ['张宇 考研数学', '汤家凤 高等数学', '李永乐 线性代数', '宋浩 概率论'], mooc: ['高等数学', '线性代数', '概率论与数理统计'], books: ['考研数学 复习全书', '考研数学 历年真题'],
      bank: true, hot: true
    },
    {
      id: 'kaoyan-politics', cat: 'xueli', family: '考研', name: '考研政治（思想政治理论）', short: '考研政治',
      aliases: ['kaoyan', 'ky', '考研', '政治', '马原', '史纲'],
      org: '教育部教育考试院（全国统考科目命题）',
      summary: '全国硕士研究生招生考试公共课，考查马克思主义基本原理、中国近现代史纲要等内容。',
      facts: [
        '满分 100 分，考试时长 3 小时',
        '题型：单项选择题 16 道、多项选择题 17 道、分析题 5 道',
        '每年以当年发布的考试大纲为准，时政内容占一定比例'
      ],
      official: [{ label: '中国研究生招生信息网（研招网）', url: 'https://yz.chsi.com.cn' }],
      kw: '考研政治', bili: ['徐涛 考研政治', '腿姐 考研政治', '考研政治 马原'], mooc: ['马克思主义基本原理', '中国近现代史纲要'], books: ['肖秀荣 1000题', '考研政治 大纲'],
      bank: true, hot: true
    },
    {
      id: 'kaoyan-english', cat: 'xueli', family: '考研', name: '考研英语（英语一/英语二）', short: '考研英语',
      aliases: ['kaoyan', 'ky', '考研', '英一', '英二'],
      org: '教育部教育考试院（全国统考科目命题）',
      summary: '全国硕士研究生招生考试公共课，学术型硕士多考英语一，部分专业学位考英语二。',
      facts: [
        '满分 100 分，考试时长 3 小时',
        '题型：完形填空、阅读理解、翻译与写作',
        '英语一与英语二的翻译、写作要求不同，以报考专业要求为准'
      ],
      official: [{ label: '中国研究生招生信息网（研招网）', url: 'https://yz.chsi.com.cn' }],
      kw: '考研英语', bili: ['唐迟 考研英语 阅读', '刘晓艳 考研英语', '考研英语 真题 精讲'], mooc: ['学术英语'], books: ['考研英语 真题', '考研英语 词汇']
    },
    {
      id: 'zsb', cat: 'xueli', family: '专升本', name: '普通高校专升本考试', short: '专升本',
      aliases: ['zhuanshengben', 'zsb', '统招专升本'],
      org: '各省级教育行政部门与教育招生考试机构',
      summary: '面向普通高校专科毕业生的本科插班选拔考试，考试科目和招生政策由各省自定。',
      facts: [
        '公共课常见为英语、大学语文、高等数学或计算机基础，另加专业课，各省差异较大',
        '一般面向全日制普通专科应届毕业生，退役士兵等群体另有政策',
        '报名条件、科目与时间以本省教育考试院公告为准'
      ],
      official: [{ label: '阳光高考（教育部高校招生信息平台）', url: 'https://gaokao.chsi.com.cn' }],
      kw: '专升本', bili: ['专升本 高等数学', '专升本 英语'], mooc: ['高等数学', '大学英语'], books: ['专升本 真题']
    },
    {
      id: 'zikao', cat: 'xueli', family: '自考', name: '高等教育自学考试', short: '自考',
      aliases: ['zikao', 'zk'],
      org: '全国高等教育自学考试指导委员会、各省级教育考试院',
      summary: '无入学考试、按课程报考的国家学历考试，全部课程合格并满足条件即可申请毕业。',
      facts: [
        '按课程报考，单科合格成绩长期有效（以各省规定为准）',
        '全部课程合格并完成毕业要求可申请毕业证书，符合条件者可申请学士学位',
        '课程考试一般安排在每年 4 月和 10 月，具体时间以本省自学考试办公室公布的安排为准'
      ],
      official: [{ label: '中国教育考试网 · 自学考试', url: 'https://zikao.neea.edu.cn' }],
      kw: '自考', bili: ['自考 马克思主义基本原理', '自考 经验'], mooc: ['管理学原理'], books: ['自考 教材']
    },
    {
      id: 'chengkao', cat: 'xueli', family: '成人高考', name: '成人高等学校招生全国统一考试', short: '成人高考',
      aliases: ['chengkao', 'ck', '成考'],
      org: '教育部教育考试院、各省级教育考试院',
      summary: '面向社会成人的学历教育入学考试，录取后按脱产或业余、函授等非脱产形式学习。',
      facts: [
        '全国统考一般在每年 10 月中下旬举行',
        '分高中起点升本科、高中起点升专科和专科起点升本科三个层次',
        '报名与录取以本省教育考试院公告为准'
      ],
      official: [{ label: '中国教育考试网', url: 'https://www.neea.edu.cn' }],
      kw: '成人高考', bili: ['成人高考 数学', '成人高考 英语'], mooc: [], books: ['成人高考 真题']
    },

    /* ───────── 公务员与事业单位 ───────── */
    {
      id: 'xingce', cat: 'gongkao', family: '公务员考试', name: '公务员考试 · 行政职业能力测验', short: '行测',
      aliases: ['xingce', 'xc', 'guokao', 'gk', '国考', '省考', '考公', '公务员'],
      org: '国家公务员局（中央机关）；各省公务员主管部门（省考）',
      summary: '公务员录用笔试的客观题科目，考查言语、数量、推理、资料分析与常识。',
      facts: [
        '中央机关及其直属机构考试录用的笔试科目为《行政职业能力测验》和《申论》',
        '行测常见模块：常识判断、言语理解与表达、数量关系、判断推理、资料分析',
        '国考笔试通常在每年 11 月下旬或 12 月初，多数省考集中在上半年',
        '试卷按职位层级区分（如副省级、地市级），以当年考试公告为准'
      ],
      official: [{ label: '国家公务员局', url: 'http://www.scs.gov.cn' }],
      kw: '行测', bili: ['行测 数量关系', '行测 资料分析 速算', '判断推理 技巧', '言语理解 技巧'], mooc: ['逻辑学'], books: ['行测 历年真题'],
      bank: true, hot: true
    },
    {
      id: 'shenlun', cat: 'gongkao', family: '公务员考试', name: '公务员考试 · 申论', short: '申论',
      aliases: ['shenlun', 'sl', '国考', '省考', '考公'],
      org: '国家公务员局（中央机关）；各省公务员主管部门（省考）',
      summary: '公务员录用笔试的主观题科目，根据给定资料完成概括、对策、分析与写作。',
      facts: [
        '常见题型：归纳概括、提出对策、综合分析、贯彻执行（应用文写作）、文章写作',
        '与《行政职业能力测验》同为笔试科目，试卷按职位层级区分'
      ],
      official: [{ label: '国家公务员局', url: 'http://www.scs.gov.cn' }],
      kw: '申论', bili: ['申论 归纳概括', '申论 大作文', '申论 贯彻执行'], mooc: ['公文写作'], books: ['申论 范文', '申论 真题']
    },
    {
      id: 'shiye', cat: 'gongkao', family: '事业单位', name: '事业单位公开招聘考试', short: '事业单位',
      aliases: ['shiye', 'sydw', '事业编', '联考'],
      org: '各地人力资源和社会保障部门',
      summary: '事业单位工作人员公开招聘笔试，多省参加统一命题的分类联考，也有地区自行组织。',
      facts: [
        '多省联考笔试科目为《职业能力倾向测验》和《综合应用能力》',
        '按岗位分为综合管理类（A 类）、社会科学专技类（B 类）、自然科学专技类（C 类）、中小学教师类（D 类）、医疗卫生类（E 类）',
        '未参加联考的地区可能考公共基础知识等，以当地招聘公告为准'
      ],
      official: [
        { label: '中国人事考试网', url: 'http://www.cpta.com.cn' },
        { label: '人力资源和社会保障部', url: 'https://www.mohrss.gov.cn' }
      ],
      kw: '事业单位 联考', bili: ['事业单位 职测', '事业单位 综合应用能力'], mooc: [], books: ['事业单位 联考 真题']
    },
    {
      id: 'junwen', cat: 'gongkao', family: '军队文职', name: '军队文职人员公开招考', short: '军队文职',
      aliases: ['junwen', 'jw', '军队文职'],
      org: '中央军委政治工作部（统一组织）',
      summary: '面向社会公开招考军队文职人员，笔试一般包括公共科目和专业科目。',
      facts: [
        '笔试一般分公共科目和专业科目，岗位条件以招考公告为准',
        '报名与公告发布以军队人才网为准'
      ],
      official: [{ label: '军队人才网', url: 'http://81rc.81.cn' }],
      kw: '军队文职', bili: ['军队文职 公共科目'], mooc: [], books: ['军队文职 真题']
    },

    /* ───────── 教师资格 ───────── */
    {
      id: 'jiaozi', cat: 'jiaoshi', family: '教师资格', name: '中小学教师资格考试（笔试）', short: '教资笔试',
      aliases: ['jiaozi', 'jz', '教资', '教师资格证', '综合素质'],
      org: '教育部教育考试院',
      summary: '取得中小学、幼儿园教师资格的国家考试，笔试合格后参加面试。',
      facts: [
        '笔试每年上半年和下半年各举行一次，面试在笔试之后进行',
        '中学笔试科目：综合素质、教育知识与能力、学科知识与教学能力；小学为综合素质、教育教学知识与能力',
        '笔试单科成绩有效期 2 年，笔试与面试均合格后取得考试合格证明',
        '取得合格证明后还需按规定申请认定，才能获得教师资格证书'
      ],
      official: [{ label: '中小学教师资格考试网', url: 'https://ntce.neea.edu.cn' }],
      kw: '教师资格证 笔试', bili: ['教资 综合素质', '教资 教育知识与能力', '教育心理学'], mooc: ['教育学', '教育心理学'], books: ['教师资格证 真题'],
      bank: true, hot: true
    },
    {
      id: 'jiaozi-ms', cat: 'jiaoshi', family: '教师资格', name: '中小学教师资格考试（面试）', short: '教资面试',
      aliases: ['jiaozi', 'jz', '教资', '试讲', '结构化'],
      org: '教育部教育考试院',
      summary: '教资笔试合格后的面试环节，考查教学设计、试讲与职业认知。',
      facts: [
        '采用结构化面试和情境模拟方式',
        '一般流程：抽题备课、结构化问答、试讲（或演示）、答辩',
        '笔试各科合格且在有效期内方可报名面试'
      ],
      official: [{ label: '中小学教师资格考试网', url: 'https://ntce.neea.edu.cn' }],
      kw: '教资面试', bili: ['教资面试 试讲', '教资面试 结构化'], mooc: ['教学设计'], books: ['教资面试']
    },

    /* ───────── 外语与国际中文 ───────── */
    {
      id: 'cet4', cat: 'waiyu', family: '四六级', name: '大学英语四级考试（CET-4）', short: '英语四级',
      aliases: ['cet', 'cet4', 'sj', '四级', '四六级'],
      org: '教育部教育考试院',
      summary: '面向在校大学生的英语能力考试，笔试由所在高校统一组织报名。',
      facts: [
        '每年 6 月和 12 月各举行一次笔试',
        '笔试满分 710 分，包括写作、听力、阅读和翻译',
        '口语考试（CET-SET4）须先报考当次四级笔试方可报名，每年 5 月和 11 月举行，早于笔试'
      ],
      official: [{ label: '全国大学英语四、六级考试网', url: 'https://cet.neea.edu.cn' }],
      kw: '英语四级', bili: ['四级 真题 精讲', '四级 听力 技巧', '四级 翻译'], mooc: ['大学英语'], books: ['英语四级 真题', '四级 词汇'],
      bank: true, hot: true
    },
    {
      id: 'cet6', cat: 'waiyu', family: '四六级', name: '大学英语六级考试（CET-6）', short: '英语六级',
      aliases: ['cet', 'cet6', 'lj', '六级', '四六级'],
      org: '教育部教育考试院',
      summary: '在四级基础上的进阶英语能力考试。',
      facts: [
        '每年 6 月和 12 月各举行一次笔试，满分 710 分',
        '报考一般要求四级成绩达到 425 分，以所在学校规定为准',
        '口语考试（CET-SET6）须先报考当次六级笔试方可报名，每年 5 月和 11 月举行'
      ],
      official: [{ label: '全国大学英语四、六级考试网', url: 'https://cet.neea.edu.cn' }],
      kw: '英语六级', bili: ['六级 真题 精讲', '六级 阅读 技巧'], mooc: ['大学英语'], books: ['英语六级 真题', '六级 词汇']
    },
    {
      id: 'ielts', cat: 'waiyu', family: '出国语言考试', name: '雅思（IELTS）', short: '雅思',
      aliases: ['ielts', 'ys', '雅思'],
      org: '英国文化教育协会、IDP 和剑桥大学出版社与考评院共同拥有；中国大陆由英国文化教育协会与教育部教育考试院合作举办',
      summary: '用于留学、移民与工作的国际英语测试。',
      facts: [
        '分学术类与培训类',
        '听、说、读、写四项，成绩以 0–9 分制、以半分为单位报告',
        '中国大陆自 2026 年 9 月 1 日起停止纸笔考试，全部采用机考；口语为与真人考官一对一对话，具体形式以报名网站说明为准'
      ],
      official: [{ label: '教育部教育考试院 · 雅思报名', url: 'https://ielts.neea.edu.cn' }],
      kw: '雅思', bili: ['雅思 口语', '雅思 写作 大作文', '剑桥雅思 真题 精讲'], mooc: ['学术英语写作'], books: ['剑桥雅思 真题']
    },
    {
      id: 'toefl', cat: 'waiyu', family: '出国语言考试', name: '托福（TOEFL iBT）', short: '托福',
      aliases: ['toefl', 'tf', '托福'],
      org: '美国教育考试服务中心（ETS）；中国大陆由教育部教育考试院负责报名',
      summary: '以北美院校为主广泛认可的学术英语考试。',
      facts: [
        '机考，包括阅读、听力、口语、写作四部分',
        '自 2026 年 1 月 21 日起改为自适应考试，成绩改为 1–6 分制（每 0.5 分一档），过渡期内同时提供 0–120 分对应总分'
      ],
      official: [{ label: '教育部教育考试院 · 托福报名', url: 'https://toefl.neea.edu.cn' }],
      kw: '托福', bili: ['托福 听力', '托福 口语', '托福 写作'], mooc: ['学术英语'], books: ['托福 官方指南']
    },
    {
      id: 'jlpt', cat: 'waiyu', family: '日语', name: '日本语能力测试（JLPT）', short: '日语 N1–N5',
      aliases: ['jlpt', 'ry', 'n1', 'n2', '日语'],
      org: '日本国际交流基金、日本国际教育支援协会；中国大陆由教育部教育考试院承办',
      summary: '面向母语非日语者的日语能力测试，分 N1 至 N5 五个级别。',
      facts: [
        '分 N1–N5 五个级别，N1 最难',
        '每年 7 月和 12 月各举行一次',
        '考查语言知识（文字、词汇、语法）、阅读和听力'
      ],
      official: [{ label: '教育部教育考试院 · 日语能力测试', url: 'https://jlpt.neea.edu.cn' }],
      kw: '日语能力考试', bili: ['标准日本语 初级', '日语 N2 语法', '日语 N1 真题'], mooc: ['基础日语'], books: ['新标准日本语', '日语 N2 真题']
    },
    {
      id: 'catti', cat: 'waiyu', family: '翻译资格', name: '全国翻译专业资格（水平）考试（CATTI）', short: 'CATTI',
      aliases: ['catti', 'fy', '翻译', '口译', '笔译'],
      org: '中国外文局翻译院（受人力资源和社会保障部委托）',
      summary: '纳入国家职业资格目录的翻译资格考试，分口译和笔译。',
      facts: [
        '分口译、笔译两大类，设一级、二级、三级等级别',
        '涵盖英、日、法、俄、德、西、阿、朝/韩、葡等语种',
        '二级、三级的口译和笔译均设综合能力、实务两个科目，一级只考实务；均采用计算机化考试'
      ],
      official: [{ label: 'CATTI 中心官网', url: 'http://www.catticenter.com' }],
      kw: 'CATTI', bili: ['CATTI 三笔', 'CATTI 二口', '英汉翻译 技巧'], mooc: ['英汉翻译'], books: ['CATTI 真题']
    },
    {
      id: 'hsk', cat: 'waiyu', family: '国际中文', name: '中文水平考试（HSK）', short: 'HSK',
      aliases: ['hsk', '汉语水平考试', '中文水平考试', 'chinese'],
      org: '教育部中外语言交流合作中心（语合中心）主办，汉考国际（CTI）负责运营实施',
      summary: '面向母语非中文者的国际中文能力标准化考试。',
      facts: [
        '3.0 版 HSK 于 2026 年 12 月 13 日面向全球正式开考，等级由 6 级扩展为 9 级（初等 1–3 级、中等 4–6 级、高等 7–9 级）；报考前请确认所报考次使用的版本',
        '提供纸笔考试与网络考试'
      ],
      official: [{ label: '中文考试服务网', url: 'https://www.chinesetest.cn' }],
      kw: 'HSK', bili: ['HSK 4', 'HSK 5 听力', '对外汉语'], mooc: ['汉语'], books: ['HSK 标准教程']
    },

    /* ───────── 财会金融 ───────── */
    {
      id: 'chuji-kuaiji', cat: 'caikuai', family: '会计职称', name: '初级会计专业技术资格考试', short: '初级会计',
      aliases: ['chuji', 'cj', 'kuaiji', '初会', '会计证'],
      org: '财政部、人力资源和社会保障部（考务信息见全国会计资格评价网）',
      summary: '会计职称的入门级考试，通过后取得初级会计专业技术资格。',
      facts: [
        '考试科目：初级会计实务、经济法基础',
        '实行无纸化（计算机）考试',
        '须在一个考试年度内通过全部科目'
      ],
      official: [{ label: '全国会计资格评价网', url: 'http://kzp.mof.gov.cn' }],
      kw: '初级会计', bili: ['初级会计实务', '经济法基础', '会计 借贷记账法'], mooc: ['基础会计', '会计学原理'], books: ['初级会计实务', '经济法基础'],
      bank: true, hot: true
    },
    {
      id: 'zhongji-kuaiji', cat: 'caikuai', family: '会计职称', name: '中级会计专业技术资格考试', short: '中级会计',
      aliases: ['zhongji', 'zj', '中会', '会计职称'],
      org: '财政部、人力资源和社会保障部（考务信息见全国会计资格评价网）',
      summary: '会计职称中级考试，是会计人员晋升的重要资格。',
      facts: [
        '考试科目：中级会计实务、财务管理、经济法',
        '须在连续 2 个考试年度内通过全部科目',
        '实行无纸化（计算机）考试'
      ],
      official: [{ label: '全国会计资格评价网', url: 'http://kzp.mof.gov.cn' }],
      kw: '中级会计', bili: ['中级会计实务', '中级 财务管理'], mooc: ['中级财务会计', '财务管理'], books: ['中级会计实务']
    },
    {
      id: 'cpa', cat: 'caikuai', family: '注册会计师', name: '注册会计师全国统一考试（CPA）', short: 'CPA',
      aliases: ['cpa', 'zhukuai', '注会', '注册会计师'],
      org: '中国注册会计师协会（财政部注册会计师考试委员会）',
      summary: '取得注册会计师资格的全国统一考试，分专业阶段和综合阶段。',
      facts: [
        '专业阶段 6 科：会计、审计、财务成本管理、公司战略与风险管理、经济法、税法',
        '专业阶段单科合格成绩 5 年内有效，6 科全部合格后可参加综合阶段（职业能力综合测试）',
        '全国统一采用计算机化考试'
      ],
      official: [
        { label: '中国注册会计师协会', url: 'https://www.cicpa.org.cn' },
        { label: 'CPA 考试网上报名系统', url: 'https://cpaexam.cicpa.org.cn' }
      ],
      kw: '注册会计师', bili: ['CPA 会计', 'CPA 审计', 'CPA 税法', 'CPA 财管'], mooc: ['中级财务会计', '审计学'], books: ['注册会计师 教材', 'CPA 轻松过关'],
      hot: true
    },
    {
      id: 'shuiwushi', cat: 'caikuai', family: '税务师', name: '税务师职业资格考试', short: '税务师',
      aliases: ['shuiwushi', 'sws', '税务'],
      org: '中国注册税务师协会',
      summary: '取得税务师职业资格的考试，侧重税法与涉税服务。',
      facts: [
        '5 个科目：税法（一）、税法（二）、涉税服务实务、涉税服务相关法律、财务与会计',
        '单科合格成绩实行 5 年滚动管理'
      ],
      official: [{ label: '中国注册税务师协会', url: 'https://www.cctaa.cn' }],
      kw: '税务师', bili: ['税务师 税法一', '涉税服务实务'], mooc: ['税法'], books: ['税务师 教材']
    },
    {
      id: 'zhengquan', cat: 'caikuai', family: '金融从业', name: '证券从业人员一般从业资格考试', short: '证券从业',
      aliases: ['zhengquan', 'zq', '证券'],
      org: '中国证券业协会',
      summary: '进入证券行业的入门资格考试。',
      facts: [
        '科目：金融市场基础知识、证券市场基本法律法规',
        '计算机考试，题型包括单项选择题和组合型选择题',
        '通过考试是证券从业人员执业登记的条件之一，执业登记由所在机构办理'
      ],
      official: [{ label: '中国证券业协会', url: 'http://www.sac.net.cn' }],
      kw: '证券从业', bili: ['证券从业 金融市场基础知识', '证券从业 法律法规'], mooc: ['证券投资学', '金融学'], books: ['证券从业 教材'],
      bank: true
    },
    {
      id: 'jijin', cat: 'caikuai', family: '金融从业', name: '基金从业资格考试', short: '基金从业',
      aliases: ['jijin', 'jj', '基金'],
      org: '中国证券投资基金业协会',
      summary: '进入基金行业的从业资格考试。',
      facts: [
        '科目一：基金法律法规、职业道德与业务规范',
        '科目二：证券投资基金基础知识；科目三：私募股权投资基金基础知识',
        '通过科目一和科目二（或科目三）即满足基金从业资格的考试要求'
      ],
      official: [{ label: '中国证券投资基金业协会', url: 'https://www.amac.org.cn' }],
      kw: '基金从业', bili: ['基金从业 科目一', '基金从业 科目二'], mooc: ['投资学'], books: ['基金从业 教材']
    },
    {
      id: 'yinhang', cat: 'caikuai', family: '金融从业', name: '银行业专业人员职业资格考试', short: '银行从业',
      aliases: ['yinhang', 'yh', '银行'],
      org: '中国银行业协会',
      summary: '银行业从业人员的专业资格考试，分初级和中级。',
      facts: [
        '初级公共科目为《银行业法律法规与综合能力》',
        '专业实务科目包括个人理财、风险管理、公司信贷、个人贷款、银行管理等'
      ],
      official: [{ label: '中国银行业协会', url: 'https://www.china-cba.net' }],
      kw: '银行从业', bili: ['银行从业 法律法规', '银行从业 个人理财'], mooc: ['商业银行经营学'], books: ['银行从业 教材']
    },
    {
      id: 'qihuo', cat: 'caikuai', family: '金融从业', name: '期货从业人员资格考试', short: '期货从业',
      aliases: ['qihuo', 'qh', '期货'],
      org: '中国期货业协会',
      summary: '进入期货行业的从业资格考试。',
      facts: ['科目：期货基础知识、期货法律法规'],
      official: [{ label: '中国期货业协会', url: 'https://www.cfachina.org' }],
      kw: '期货从业', bili: ['期货基础知识', '期货 法律法规'], mooc: ['金融衍生工具'], books: ['期货从业 教材']
    },
    {
      id: 'jingjishi', cat: 'caikuai', family: '经济师', name: '经济专业技术资格考试', short: '经济师',
      aliases: ['jingjishi', 'jjs', '中级经济师'],
      org: '人力资源和社会保障部人事考试中心',
      summary: '经济系列职称考试，分初级、中级和高级。',
      facts: [
        '初级、中级科目为《经济基础知识》和《专业知识和实务》，后者分人力资源管理、金融、财政税收、工商管理等专业',
        '初级、中级均须在连续 2 个考试年度内通过全部科目'
      ],
      official: [{ label: '中国人事考试网', url: 'http://www.cpta.com.cn' }],
      kw: '中级经济师', bili: ['中级经济师 经济基础', '经济师 人力资源'], mooc: ['宏观经济学', '微观经济学'], books: ['中级经济师 教材']
    },

    /* ───────── 法律 ───────── */
    {
      id: 'fakao', cat: 'falv', family: '法考', name: '国家统一法律职业资格考试', short: '法考',
      aliases: ['fakao', 'fk', '司考', '司法考试', '法律职业资格'],
      org: '司法部',
      summary: '取得法律职业资格的国家考试，是从事法官、检察官、律师、公证员等职业的前提。',
      facts: [
        '分客观题考试和主观题考试，均实行计算机化考试',
        '客观题考试合格的，当年和下一年度可参加主观题考试',
        '初任法官、检察官，申请律师执业、公证员执业和初次担任法律类仲裁员等，应当通过法考取得法律职业资格'
      ],
      official: [{ label: '中华人民共和国司法部', url: 'https://www.moj.gov.cn' }],
      kw: '法考', bili: ['罗翔 刑法', '法考 民法', '法考 刑诉', '法考 主观题'], mooc: ['民法学', '刑法学', '宪法学'], books: ['法考 历年真题', '民法典 条文'],
      bank: true, hot: true
    },

    /* ───────── 医药卫生 ───────── */
    {
      id: 'yishi', cat: 'yiyao', family: '医师资格', name: '医师资格考试', short: '执业医师',
      aliases: ['yishi', 'ys', '执医', '医师'],
      org: '国家卫生健康委员会（国家医学考试中心组织实施）',
      summary: '取得执业医师或执业助理医师资格的国家考试。',
      facts: [
        '分临床、口腔、公共卫生、中医四类，分执业医师与执业助理医师两级',
        '先参加实践技能考试，合格后方可参加医学综合笔试'
      ],
      official: [{ label: '国家医学考试网', url: 'https://www.nmec.org.cn' }],
      kw: '执业医师', bili: ['执业医师 内科学', '执业医师 生理学'], mooc: ['内科学', '生理学', '病理学'], books: ['执业医师 真题']
    },
    {
      id: 'hushi', cat: 'yiyao', family: '护士资格', name: '护士执业资格考试', short: '护士资格',
      aliases: ['hushi', 'hs', '护考', '护资'],
      org: '国家卫生健康委员会、人力资源和社会保障部',
      summary: '申请护士执业注册前须通过的国家考试。',
      facts: [
        '包括专业实务和实践能力两个科目',
        '一次考试通过两个科目为考试成绩合格',
        '考试成绩合格是申请护士执业注册的条件之一'
      ],
      official: [{ label: '中国卫生人才网', url: 'https://www.21wecan.com' }],
      kw: '护士资格证', bili: ['护考 基础护理', '护考 内科护理'], mooc: ['基础护理学', '内科护理学'], books: ['护士资格考试 真题'],
      bank: true
    },
    {
      id: 'yaoshi', cat: 'yiyao', family: '药师资格', name: '执业药师职业资格考试', short: '执业药师',
      aliases: ['yaoshi', 'zyys', '药师'],
      org: '国家药品监督管理局、人力资源和社会保障部',
      summary: '取得执业药师资格的国家考试，分药学和中药学两类。',
      facts: [
        '分药学、中药学两个专业类别',
        '药学类科目：药事管理与法规、药学专业知识（一）、药学专业知识（二）、药学综合知识与技能',
        '以 4 年为一个周期，参加全部 4 科者须在连续 4 个考试年度内通过'
      ],
      official: [
        { label: '中国人事考试网', url: 'http://www.cpta.com.cn' },
        { label: '国家药监局执业药师资格认证中心', url: 'http://www.cqlp.org' }
      ],
      kw: '执业药师', bili: ['执业药师 药事管理与法规', '执业药师 药学专业知识'], mooc: ['药理学', '药物化学'], books: ['执业药师 教材']
    },
    {
      id: 'weisheng', cat: 'yiyao', family: '卫生职称', name: '卫生专业技术资格考试（初级/中级）', short: '卫生职称',
      aliases: ['weisheng', 'ws', '主管护师', '护师', '检验'],
      org: '国家卫生健康委员会、人力资源和社会保障部',
      summary: '医、药、护、技等卫生专业人员的职称考试。',
      facts: [
        '分初级（士、师）和中级',
        '一般设基础知识、相关专业知识、专业知识、专业实践能力四个科目',
        '初级、中级均须在连续 2 个考试年度内通过全部科目'
      ],
      official: [{ label: '中国卫生人才网', url: 'https://www.21wecan.com' }],
      kw: '主管护师', bili: ['主管护师', '卫生资格 检验'], mooc: ['护理学基础'], books: ['卫生资格考试']
    },

    /* ───────── 计算机与软件 ───────── */
    {
      id: 'ncre-python', cat: 'it', family: '计算机等级考试', name: '全国计算机等级考试二级 Python', short: '计算机二级 Python',
      aliases: ['ncre', 'jsj', '计算机二级', '二级', 'python'],
      org: '教育部教育考试院',
      summary: '面向非计算机专业学生的计算机应用能力考试，二级 Python 考查程序设计基础。',
      facts: [
        '上机考试，时长 120 分钟，满分 100 分',
        '题型：单项选择题 40 分（含公共基础知识 10 分），操作题 60 分（包括基本编程题和综合编程题）',
        '每年举行多次（以 3 月、9 月为主），具体由各省安排'
      ],
      official: [{ label: '全国计算机等级考试网', url: 'https://ncre.neea.edu.cn' }],
      kw: '计算机二级 Python', bili: ['计算机二级 Python', 'Python 入门', '嵩天 Python'], mooc: ['Python语言程序设计'], books: ['Python语言程序设计基础'],
      bank: true, hot: true
    },
    {
      id: 'ncre-office', cat: 'it', family: '计算机等级考试', name: '全国计算机等级考试二级 MS Office 高级应用与设计', short: '计算机二级 Office',
      aliases: ['ncre', 'jsj', '计算机二级', '二级', 'office', 'excel'],
      org: '教育部教育考试院',
      summary: '二级 MS Office 高级应用与设计，考查 Word、Excel、PowerPoint 的综合应用。',
      facts: [
        '上机考试，时长 120 分钟，满分 100 分',
        '题型：单项选择题（含公共基础知识）与 Word、Excel、PowerPoint 操作题'
      ],
      official: [{ label: '全国计算机等级考试网', url: 'https://ncre.neea.edu.cn' }],
      kw: '计算机二级 Office', bili: ['计算机二级 Office', 'Excel 函数 教程'], mooc: ['大学计算机', '办公软件'], books: ['计算机二级 MS Office']
    },
    {
      id: 'ruankao-sd', cat: 'it', family: '软考', name: '软件设计师（软考中级）', short: '软件设计师',
      aliases: ['ruankao', 'rk', '软考', '软设'],
      org: '工业和信息化部、人力资源和社会保障部',
      summary: '计算机技术与软件专业技术资格（水平）考试中级资格，考查软件设计与开发能力。',
      facts: [
        '软考分初级、中级、高级三个层次，软件设计师属于中级',
        '考试科目：计算机与软件工程知识、软件设计',
        '已实行计算机化考试，两科在同一次考试中均合格方为通过'
      ],
      official: [{ label: '中国计算机技术职业资格网', url: 'https://www.ruankao.org.cn' }],
      kw: '软件设计师', bili: ['软件设计师 软考', '数据结构', '计算机网络 谢希仁'], mooc: ['数据结构', '操作系统', '计算机网络'], books: ['软件设计师 教程'],
      bank: true, hot: true
    },
    {
      id: 'ruankao-pm', cat: 'it', family: '软考', name: '信息系统项目管理师（软考高级）', short: '信息系统项目管理师',
      aliases: ['ruankao', 'rk', '软考', '高项'],
      org: '工业和信息化部、人力资源和社会保障部',
      summary: '软考高级资格，侧重信息系统项目的全过程管理。',
      facts: [
        '属于软考高级资格',
        '考试科目：综合知识、案例分析、论文'
      ],
      official: [{ label: '中国计算机技术职业资格网', url: 'https://www.ruankao.org.cn' }],
      kw: '信息系统项目管理师', bili: ['信息系统项目管理师', '高项 论文'], mooc: ['软件项目管理'], books: ['信息系统项目管理师 教程']
    },

    /* ───────── 建筑工程 ───────── */
    {
      id: 'yijian', cat: 'jianzhu', family: '建造师', name: '一级建造师执业资格考试', short: '一级建造师',
      aliases: ['yijian', 'yj', '一建', '建造师'],
      org: '人力资源和社会保障部、住房和城乡建设部',
      summary: '建设工程项目管理人员的执业资格考试。本站题库覆盖《建设工程经济》。',
      facts: [
        '科目：建设工程经济、建设工程法规及相关知识、建设工程项目管理、专业工程管理与实务',
        '参加全部 4 科考试的人员须在连续 2 个考试年度内通过',
        '专业工程管理与实务分建筑工程、市政公用工程、机电工程、公路工程等专业'
      ],
      official: [
        { label: '中国人事考试网', url: 'http://www.cpta.com.cn' },
        { label: '住房和城乡建设部', url: 'https://www.mohurd.gov.cn' }
      ],
      kw: '一级建造师', bili: ['一建 工程经济', '一建 法规', '一建 项目管理'], mooc: ['工程经济学'], books: ['一级建造师 教材'],
      bank: true
    },
    {
      id: 'erjian', cat: 'jianzhu', family: '建造师', name: '二级建造师执业资格考试', short: '二级建造师',
      aliases: ['erjian', 'ej', '二建', '建造师'],
      org: '住房和城乡建设部（命题）、各省人社与住建部门（考务）',
      summary: '二级建造师执业资格考试，报名与考试由各省组织。',
      facts: [
        '科目：建设工程施工管理、建设工程法规及相关知识、专业工程管理与实务',
        '报名条件、成绩滚动周期等以本省公告为准'
      ],
      official: [{ label: '住房和城乡建设部', url: 'https://www.mohurd.gov.cn' }],
      kw: '二级建造师', bili: ['二建 施工管理', '二建 法规'], mooc: ['工程项目管理'], books: ['二级建造师 教材']
    },
    {
      id: 'zaojia', cat: 'jianzhu', family: '造价工程师', name: '一级造价工程师职业资格考试', short: '一级造价',
      aliases: ['zaojia', 'zj', '造价'],
      org: '住房和城乡建设部、交通运输部、水利部、人力资源和社会保障部',
      summary: '工程造价专业人员的职业资格考试。',
      facts: [
        '科目：建设工程造价管理、建设工程计价、建设工程技术与计量、建设工程造价案例分析',
        '技术与计量、案例分析分土木建筑、交通运输、水利、安装四个专业'
      ],
      official: [{ label: '中国人事考试网', url: 'http://www.cpta.com.cn' }],
      kw: '一级造价工程师', bili: ['一级造价 计价', '造价 案例分析'], mooc: ['工程造价'], books: ['一级造价工程师 教材']
    },
    {
      id: 'xiaofang', cat: 'jianzhu', family: '消防工程师', name: '一级注册消防工程师资格考试', short: '一级消防',
      aliases: ['xiaofang', 'xf', '消防'],
      org: '应急管理部、人力资源和社会保障部',
      summary: '消防安全技术服务人员的职业资格考试。',
      facts: ['科目：消防安全技术实务、消防安全技术综合能力、消防安全案例分析'],
      official: [{ label: '中国人事考试网', url: 'http://www.cpta.com.cn' }],
      kw: '一级消防工程师', bili: ['消防工程师 技术实务', '消防 案例分析'], mooc: ['建筑防火'], books: ['消防工程师 教材']
    },

    /* ───────── 驾考与职业技能 ───────── */
    {
      id: 'kemu1', cat: 'shenghuo', family: '驾照考试', name: '机动车驾驶人考试 · 科目一', short: '驾考科目一',
      aliases: ['kemu1', 'km1', 'jiakao', '驾考', '驾照', '科一'],
      org: '公安机关交通管理部门',
      summary: '道路交通安全法律、法规和相关知识考试，是驾照考试的第一关。',
      facts: [
        '考查道路通行、交通信号、道路交通安全违法行为和交通事故处理、机动车驾驶证申领和使用、机动车登记等规定，以及其他道路交通安全法律、法规和规章',
        '小型汽车科目一：100 题，每题 1 分，考试时间 45 分钟，90 分合格',
        '可通过“交管 12123”App 或交通安全综合服务管理平台预约考试'
      ],
      official: [{ label: '交通安全综合服务管理平台', url: 'https://gab.122.gov.cn' }],
      kw: '科目一', bili: ['科目一 技巧', '驾考 扣分规则', '交通标志 讲解'], mooc: [], books: ['驾驶人 科目一'],
      bank: true, hot: true
    },
    {
      id: 'kemu4', cat: 'shenghuo', family: '驾照考试', name: '机动车驾驶人考试 · 安全文明驾驶常识（科目四）', short: '驾考科目四',
      aliases: ['kemu4', 'km4', 'jiakao', '驾考', '驾照', '科四'],
      org: '公安机关交通管理部门',
      summary: '科目三中的安全文明驾驶常识考试，俗称“科目四”。',
      facts: [
        '在科目三道路驾驶技能考试后进行',
        '小型汽车：50 题，每题 2 分，90 分合格'
      ],
      official: [{ label: '交通安全综合服务管理平台', url: 'https://gab.122.gov.cn' }],
      kw: '科目四', bili: ['科目四 技巧', '安全文明驾驶'], mooc: [], books: []
    },
    {
      id: 'putonghua', cat: 'shenghuo', family: '普通话', name: '普通话水平测试（PSC）', short: '普通话',
      aliases: ['putonghua', 'pth', '普测'],
      org: '国家语言文字工作委员会（国家语委普通话与文字应用培训测试中心）',
      summary: '对应试人普通话规范程度的口语测试，教师、播音主持等职业有明确等级要求。',
      facts: [
        '三级六等：一级甲等、一级乙等、二级甲等、二级乙等、三级甲等、三级乙等',
        '主要采用计算机辅助测试，题型为读单音节字词、读多音节词语、朗读短文、命题说话',
        '报名入口为全国普通话水平测试报名网'
      ],
      official: [
        { label: '国家普通话水平测试网', url: 'https://www.cltt.org' },
        { label: '普通话水平测试报名', url: 'https://bm.cltt.org' }
      ],
      kw: '普通话水平测试', bili: ['普通话 二甲', '普通话 命题说话', '普通话 前后鼻音'], mooc: ['普通话', '播音发声'], books: ['普通话水平测试实施纲要'],
      bank: true, hot: true
    },
    {
      id: 'daoyou', cat: 'shenghuo', family: '导游资格', name: '全国导游资格考试', short: '导游证',
      aliases: ['daoyou', 'dy', '导游'],
      org: '文化和旅游部',
      summary: '取得导游资格的全国统一考试。',
      facts: [
        '科目：政策与法律法规、导游业务、全国导游基础知识、地方导游基础知识、导游服务能力',
        '导游服务能力为现场考试（面试），其余科目为计算机考试'
      ],
      official: [{ label: '文化和旅游部', url: 'https://www.mct.gov.cn' }],
      kw: '导游证', bili: ['导游证 政策法规', '导游 面试'], mooc: ['导游业务'], books: ['导游资格考试 教材']
    },
    {
      id: 'shegong', cat: 'shenghuo', family: '社会工作者', name: '社会工作者职业资格考试', short: '社工证',
      aliases: ['shegong', 'sg', '社工'],
      org: '民政部、人力资源和社会保障部',
      summary: '社会工作专业人员的职业资格考试，分初级、中级、高级。',
      facts: [
        '初级、中级科目：社会工作综合能力、社会工作实务；中级另考社会工作法规与政策'
      ],
      official: [
        { label: '中国人事考试网', url: 'http://www.cpta.com.cn' },
        { label: '民政部', url: 'https://www.mca.gov.cn' }
      ],
      kw: '社会工作者', bili: ['社工 综合能力', '社工 实务'], mooc: ['社会工作概论'], books: ['社会工作者 教材']
    }
  ]
};

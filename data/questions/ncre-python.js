/* 开卷备考 · 题库：全国计算机等级考试二级 Python —— 原创练习题（非真题），仅供练习；考试政策以官方公告为准 */
window.KJ_QB = window.KJ_QB || {};
window.KJ_QB["ncre-python"] = {
  examId: "ncre-python",
  title: "计算机二级 Python 练习题",
  updated: "2026-10-08",
  questions: [
    {
      id: "ncre-python-01", topic: "基本语法与数据类型",
      q: "下列整除与取余运算代码的输出结果是",
      code: "print(7 // 2, 7 % 2, -7 // 2)",
      options: ["3 1 -4", "3 1 -3", "3.5 1 -3.5", "3 -1 -4"], answer: 0,
      explain: "// 是向下取整的整除（地板除），7 // 2 得 3，-7 // 2 等于 floor(-3.5) = -4；% 求余数，7 % 2 得 1。常见错误是把 -7 // 2 当成向零取整而得到 -3。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-02", topic: "基本语法与数据类型",
      q: "下列 round() 函数调用的输出结果是",
      code: "print(round(2.5), round(3.5))",
      options: ["3 4", "2 4", "2 3", "3 3"], answer: 1,
      explain: "Python 3 的 round() 采用“四舍六入五成双”（银行家舍入）：恰好为 .5 时取最近的偶数，所以 round(2.5) 为 2、round(3.5) 为 4。误以为一律四舍五入会得到 3 4。",
      basis: "Python 3 运行验证；Python 官方文档 round()"
    },
    {
      id: "ncre-python-03", topic: "基本语法与数据类型",
      q: "下列字符串切片代码的输出结果是",
      code: "s = \"Python\"\nprint(s[-3:], s[::2])",
      options: ["hon Pyt", "tho Pto", "hon Pto", "hon yhn"], answer: 2,
      explain: "s[-3:] 从倒数第 3 个字符取到末尾，得到 hon；s[::2] 从头开始、步长为 2，取下标 0、2、4 的字符 P、t、o，得到 Pto。切片区间含起点、不含终点。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-04", topic: "组合数据类型",
      q: "下列列表赋值与 append() 代码的输出结果是",
      code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
      options: ["3", "报错", "None", "4"], answer: 3,
      explain: "b = a 只是让 b 与 a 引用同一个列表对象，并没有复制；通过 b 追加元素后，a 看到的是同一个列表，长度为 4。需要独立副本时应使用 a.copy() 或 a[:]。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-05", topic: "组合数据类型",
      q: "下列字典 get() 方法代码的输出结果是",
      code: 'd = {"a": 1, "b": 2}\nprint(d.get("c", 0) + len(d))',
      options: ["报错 KeyError", "2", "3", "0"], answer: 1,
      explain: "d.get(键, 默认值) 在键不存在时返回默认值，不会抛出 KeyError，这里返回 0；len(d) 为 2，相加得 2。直接用 d[\"c\"] 访问不存在的键才会报 KeyError。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-06", topic: "组合数据类型",
      q: "下列集合并集与交集运算代码的输出结果是",
      code: "s = {1, 2, 2, 3}\nt = {2, 3, 4}\nprint(len(s | t), len(s & t))",
      options: ["5 2", "4 1", "3 2", "4 2"], answer: 3,
      explain: "集合会自动去重，s 实际为 {1, 2, 3}。并集 s | t 为 {1, 2, 3, 4}，长度 4；交集 s & t 为 {2, 3}，长度 2。把重复写的 2 也计入会误得 5。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-07", topic: "函数与异常",
      q: "下列使用可变默认参数的函数，第二次调用后的输出结果是",
      code: "def f(x, lst=[]):\n    lst.append(x)\n    return lst\n\nf(1)\nprint(f(2))",
      options: ["[1, 2]", "[2]", "[1]", "报错"], answer: 0,
      explain: "默认参数的值只在函数定义时创建一次。第一次调用 f(1) 已把 1 放进这个共享的默认列表，第二次调用继续追加 2，因此输出 [1, 2]。规范写法是 lst=None，再在函数体内新建列表。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-08", topic: "函数与异常",
      q: "下列 try-except-else-finally 代码的输出结果是",
      code: "try:\n    n = int(\"12a\")\nexcept ValueError:\n    print(\"E\", end=\"\")\nelse:\n    print(\"O\", end=\"\")\nfinally:\n    print(\"F\")",
      options: ["E", "EOF", "EF", "OF"], answer: 2,
      explain: "int(\"12a\") 无法转换为整数，抛出 ValueError，被 except 捕获后输出 E；else 只在没有发生异常时执行，因此被跳过；finally 无论是否发生异常都会执行，输出 F，结果为 EF。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-09", topic: "函数与异常",
      q: "下列涉及局部变量与全局变量的代码，输出结果是",
      code: "x = 10\ndef g():\n    x = 20\n    return x\n\nprint(g(), x)",
      options: ["20 20", "10 10", "20 10", "报错"], answer: 2,
      explain: "函数内部对 x 赋值时，x 被当作局部变量，不会影响同名的全局变量，所以 g() 返回 20，而全局 x 仍为 10。若要在函数中修改全局变量，需要先用 global x 声明。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-10", topic: "标准库与文件",
      q: "要以追加方式写入文本文件 log.txt（文件不存在时自动创建；文件已存在时保留原内容，在末尾继续写入），open() 的模式参数应为",
      options: ["'a'", "'w'", "'r'", "'x'"], answer: 0,
      explain: "'a' 是追加写模式，文件不存在时会新建，写入内容接在原有内容之后。'w' 会先清空原内容；'r' 是只读；'x' 用于创建新文件，文件已存在时抛出 FileExistsError。",
      basis: "Python 3 运行验证；Python 官方文档 open()"
    },
    {
      id: "ncre-python-11", topic: "标准库与文件",
      q: "下列 math 库取整函数代码的输出结果是",
      code: "import math\nprint(math.ceil(-2.5), math.floor(-2.5))",
      options: ["-3 -2", "-2 -2", "-3 -3", "-2 -3"], answer: 3,
      explain: "ceil 是向上取整，取不小于该数的最小整数，-2.5 向上取整得 -2；floor 是向下取整，取不大于该数的最大整数，得 -3。负数的取整方向最容易记反。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-12", topic: "标准库与文件",
      q: "下列设置随机数种子的代码，输出结果是",
      code: "import random\nrandom.seed(1)\na = random.random()\nrandom.seed(1)\nb = random.random()\nprint(a == b)",
      options: ["False", "True", "报错", "每次运行结果不确定"], answer: 1,
      explain: "random 库生成的是伪随机数，序列完全由种子决定。两次设置相同的种子后，紧接着调用 random() 得到的值相同，因此输出 True。不设置种子时，默认以系统时间等作为种子，结果才会每次不同。",
      basis: "Python 3 运行验证"
    },
    {
      id: "ncre-python-13", topic: "公共基础知识",
      q: "某二叉树中度为 2 的结点有 5 个，则该二叉树的叶子结点数为",
      options: ["5", "4", "10", "6"], answer: 3,
      explain: "对任意一棵二叉树，叶子结点数 n0 总比度为 2 的结点数 n2 多 1，即 n0 = n2 + 1 = 6。这一结论与度为 1 的结点个数无关，常见错误是误以为两者相等。",
      basis: "二叉树性质 n0 = n2 + 1（随机二叉树程序验证）"
    },
    {
      id: "ncre-python-14", topic: "公共基础知识",
      q: "下列软件测试方法中，属于黑盒测试方法的是",
      options: ["语句覆盖", "基本路径测试", "等价类划分", "判定覆盖"], answer: 2,
      explain: "黑盒测试不关心程序内部结构，只根据需求和功能设计测试用例，常用方法有等价类划分、边界值分析、错误推测法和因果图。语句覆盖、判定覆盖和基本路径测试都依赖代码逻辑，属于白盒测试。",
      basis: "二级公共基础知识考纲·软件工程基础"
    },
    {
      id: "ncre-python-15", topic: "公共基础知识",
      q: "元素 1、2、3、4 依次入栈，出栈操作可以与入栈交替进行，则下列出栈序列中不可能得到的是",
      options: ["3, 1, 2, 4", "4, 3, 2, 1", "2, 3, 1, 4", "3, 2, 4, 1"], answer: 0,
      explain: "要先输出 3，必须让 1、2、3 都入栈后再弹出 3，此时栈顶是 2，1 压在它下面，不可能紧接着输出 1。其余序列都能通过合理安排入栈与出栈得到。栈的特点是后进先出。",
      basis: "程序模拟验证"
    }
  ],
  flashcards: [
    { front: "// 与 % 运算", back: "// 为向下取整的整除（-7 // 2 = -4）；% 为取余，结果符号与除数相同（-7 % 2 = 1）。" },
    { front: "round() 的舍入规则", back: "四舍六入五成双（银行家舍入）：round(2.5) = 2，round(3.5) = 4；还会受浮点数二进制表示误差影响。" },
    { front: "可变类型与不可变类型", back: "可变：列表 list、字典 dict、集合 set；不可变：int、float、str、tuple。赋值 b = a 只复制引用。" },
    { front: "切片 s[start:end:step]", back: "包含 start、不包含 end；step 为步长，负数表示倒序，如 s[::-1] 反转字符串。" },
    { front: "format() 格式控制", back: "{:<填充><对齐><宽度>.<精度><类型>}，对齐符号 < 左、> 右、^ 居中，如 \"{:*^9}\".format(\"Py\") 得 ***Py****。" },
    { front: "try-except-else-finally", back: "except 捕获异常；else 在未发生异常时执行；finally 无论是否发生异常都执行。" },
    { front: "默认参数陷阱", back: "默认参数只在函数定义时求值一次，可变对象会在多次调用间共享；应写成 lst=None 再在函数内新建。" },
    { front: "jieba 三种分词模式", back: "精确模式 jieba.lcut(s)；全模式 jieba.lcut(s, cut_all=True)；搜索引擎模式 jieba.lcut_for_search(s)。lcut 返回列表。" },
    { front: "open() 常用模式", back: "'r' 只读（默认）；'w' 覆盖写；'a' 追加写；'x' 新建，已存在则报错；'b' 二进制；'+' 同时读写。" },
    { front: "二叉树基本性质", back: "n0 = n2 + 1；第 i 层最多 2^(i−1) 个结点；深度为 k 的二叉树最多 2^k − 1 个结点。" }
  ]
};

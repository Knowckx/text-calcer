import { evaluate, format, MathType } from 'mathjs';
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { Configs } from '@/conf';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export function TextCalcApp() {
    const [lines, setLines] = useState<{ input: string; result: string[] }>(() => {
        const savedInput = localStorage.getItem('calcInput') || '';
        return {
            input: savedInput,
            result: savedInput ? calculateResults(savedInput) : []
        };
    });
    const [copiedLineIndex, setCopiedLineIndex] = useState<number | null>(null);
    // --- 用于追踪鼠标悬停的行 ---
    const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

    const handleInputChange = (value: string) => {
        const resArray = calculateResults(value)
        setLines({ input: value, result: resArray });
        localStorage.setItem('calcInput', value);
    };
    const handleCopy = (textToCopy: string, index: number) => {
        if (!textToCopy.trim()) return;
        const resultPart = textToCopy
        navigator.clipboard.writeText(resultPart).then(() => {
            setCopiedLineIndex(index);
            setTimeout(() => {
                setCopiedLineIndex(null);
            }, 2000);
        }).catch(err => {
            console.error('无法复制文本: ', err);
        });
    };
    return (
        <div className="container mx-auto p-4 grid grid-cols-2 gap-4 ">
            <div className="flex flex-col space-y-2 ">
                <Textarea
                    value={lines.input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={Configs.DefaultTxt}
                    // 对齐修正 "leading-8" 与右侧 h-8 对应，确保每行高度一致
                    className="w-full min-h-[calc(90vh-1rem)] md:text-2xl font-mono leading-8"
                />
            </div>
            
            <div className="flex flex-col space-y-2">
                {/* 对齐修正 使用与Textarea相同的 px-3 py-2, 并继承字体和行高样式 */}
                <div className="w-full min-h-[calc(90vh-1rem)] font-bold md:text-2xl font-mono leading-8 px-3 py-2 border bg-background rounded-md overflow-y-auto">
                    {lines.result.map((line, index) => (
                        // 对齐修正 `h-8` 确保此容器高度与 `leading-8` 的行高完全匹配
                        <div
                            key={index}
                            className="group flex justify-between items-center h-8" 
                        >
                            {/* 使用 <pre> 保留空格，font-bold 让结果突出 */}
                            <pre className="font-bold">
                                {/* --- 使用 span 包裹文本，并根据悬停状态动态应用样式 --- */}
                                <span className={`transition-colors duration-150 rounded px-1 ${
                                    hoveredLineIndex === index ? 'bg-muted' : 'bg-transparent'
                                }`}>
                                    {/* --- 对齐修正: 处理空行 --- */}
                                    {/* 如果行为空，渲染一个空格，使其占据一行的高度 */}
                                    {line || <>&nbsp;</>}
                                </span>
                            </pre>
                            {line.trim() && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleCopy(line, index)}
                                    // --- 鼠标进入和离开事件，用于更新悬停状态 ---
                                    onMouseEnter={() => setHoveredLineIndex(index)}
                                    onMouseLeave={() => setHoveredLineIndex(null)}
                                >
                                    {copiedLineIndex === index ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">复制此行</span>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- 5. 修改计算函数: 返回 string[] 而不是 string ---
const calculateResults = (value: string): string[] => { // <-- 返回类型改为 string[]

    const inputLines = value.split('\n');
    const resultLines = [];
    for (const line of inputLines) {
        const { lineWithoutComment, comment } = HandleOneLine(line);
        if (lineWithoutComment === "") {
            // 如果只有注释或为空行，也推送，以保持行号对应
            resultLines.push(comment ? `# ${comment}` : '');
            continue;
        }
        if (/^\d+(\.\d+)?$/.test(lineWithoutComment)) {
            // 如果是纯数字，直接推入
            resultLines.push(lineWithoutComment);
            continue;
        }
        let result = GetLineNoCommentResult(lineWithoutComment);
        if (comment) {
            result += `    # ${comment}`;
        }
        resultLines.push(result);
    }
    return resultLines; // <-- 直接返回数组
};




function formatEvalResultNumber(evalResult: number, needPercent: boolean): string {
    if (Number.isInteger(evalResult)) return evalResult.toString();

    const formatted = format(evalResult, { notation: 'fixed', precision: 4 });
    let res = parseFloat(formatted).toString();

    // 股票涨跌幅显示优化 假如比例值处在[70%, 130%]时显示具体的百分比 实际上A股日内涨跌幅是20%以内 30%能满足大部分情况
    if (Configs.ShowNumPercentDetail){  // 通过配置开启或者关闭
        if (needPercent && evalResult < 1.3 && evalResult > 0.7) {
            const temp = format(evalResult * 100 - 100, { notation: 'fixed', precision: 2 })
            const fix = evalResult > 1 ? "+" : ""
            const percent = fix + parseFloat(temp).toString() + "%";
            res = `${res} (${percent})`;
        }
    }
    return res
}

function formatEvalResult(evalResult: MathType, needPercent: boolean): string {
    if (typeof evalResult === 'number') {
        return formatEvalResultNumber(evalResult, needPercent)
    } else if (typeof evalResult === 'string') {
        return evalResult;
    } else if (evalResult && typeof evalResult === 'object' && 'type' in evalResult) {
        if (evalResult.type === 'Complex') {
            return format(evalResult, { notation: 'auto' });
        } else if (evalResult.type === 'BigNumber') {
            return format(evalResult, { notation: 'auto', precision: 14 });
        } else if (evalResult.type === 'Unit') {
            return format(evalResult);
        } else {
            return format(evalResult);
        }
    }
    return "";
}


/** 分解成注释和公式两部分 */
function HandleOneLine(line: string) {
    const trimmedLine = line.trim();
    // 1. 尝试查找注释
    const commentMatch = trimmedLine.match(/#\s*(.+)/);  // 捕获 # 后面的任意字符
    let comment = '';
    if (commentMatch) {
        comment = commentMatch[1];  // commentMatch[1] 是第一个捕获组的内容
    }
    // 2. 移除注释部分，再进行计算.
    const lineWithoutComment = trimmedLine.replace(/#.*/, '').trim();
    console.log(`varibale: `, { lineWithoutComment, comment })
    return { lineWithoutComment, comment }; // 返回一个对象
}


function GetLineNoCommentResult(inpLine: string) {
    let result = '';
    // --- 创建一个仅用于计算的副本，将 x 替换为 * ---
    const lineForCalc = inpLine.replaceAll('x', '*');

    if (inpLine.includes('a') && inpLine.includes('=')) {
        try { // 尝试解方程
            result = solveEquation(lineForCalc);
            result = `a = ${result}` // 你的代码是 a=... 我加了空格
        } catch (error) {
            console.log(`error: `, error)
            //如果solveEquation内部出错, 也不影响下面逻辑执行
            result = `${inpLine}  # 方程求解失败, 请检查方程的格式`;
        }
        return result
    }

    try {
        const needPercent = lineForCalc.includes('/') ? true : false
        const evalResult = evaluate(lineForCalc);
        const formattedResult = formatEvalResult(evalResult, needPercent);
        result = `${inpLine} = ${formattedResult}`; 
    } catch (error: any) {
        console.log(`error: `, error)
        result = `${inpLine}`; //如果发生异常 还是显示原始行
    }
    return result
}


/** 输入一个一元一次方程 x表示需要求解的变量 */
function solveEquation(equation: string): string {
    // 将方程以"="拆分为左右两部分
    const parts = equation.split('=');
    if (parts.length !== 2) {
        throw new Error("方程格式不正确，应为 '表达式=表达式'");
    }
    const [left, right] = parts;

    // 定义函数 f(a) = 左边表达式 - 右边表达式
    const f = (a: number): number => {
        // 使用 Function 构造器生成计算表达式的函数
        const leftFunc = new Function("a", "return " + left);
        const rightFunc = new Function("a", "return " + right);
        return leftFunc(a) - rightFunc(a);
    };

    // 计算 f(0) 和 f(1)
    const f0 = f(0);
    const f1 = f(1);
    const coeff = f1 - f0; // 线性函数 f(a) = f0 + coeff * a

    // 如果系数为0，则需要判断是否有无穷多解或无解
    if (coeff === 0) {
        if (f0 === 0) return "Infinite solutions"; // 无穷多解
        else return "No solution"; // 无解
    }

    // 求解 f(a) = 0 => a = -f(0) / coeff
    const result = -f0 / coeff;
    // 如果结果是小数，保留4位小数
    const resultStr = result.toString();

    // 如果存在小数点，且小数位数大于4位，则格式化为保留4位小数
    if (resultStr.includes('.')) {
        const fractionalPart = resultStr.split('.')[1];
        if (fractionalPart.length > 4) {
            return result.toFixed(4);
        }
    }
    return resultStr;
}

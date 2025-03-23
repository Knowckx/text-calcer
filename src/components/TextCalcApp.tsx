import { evaluate, format, MathType } from 'mathjs';
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';

export function TextCalcApp() {
    // Initialize state with data from localStorage, or default values
    const [lines, setLines] = useState<{ input: string; result: string }>(() => {
        const savedInput = localStorage.getItem('calcInput') || '';
        return {
            input: savedInput,
            result: savedInput ? calculateResults(savedInput) : '' // Calculate only if needed
        };
    });



    // Function to calculate results and update state
    const handleInputChange = (value: string) => {
        const resText = calculateResults(value)
        setLines({ input: value, result: resText });
        localStorage.setItem('calcInput', value);
    };

    return (
        <div className="container mx-auto p-4 grid grid-cols-2 gap-4 ">
            <div className="flex flex-col space-y-2 ">
                <Textarea
                    value={lines.input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="输入公式, 例如: 20*10"
                    className="w-full min-h-[calc(90vh-1rem)] md:text-2xl font-mono"
                />
            </div>
            <div className="flex flex-col space-y-2">
                <Textarea
                    value={lines.result}
                    readOnly
                    className="w-full min-h-[calc(90vh-1rem)]  font-bold  md:text-2xl"
                />
            </div>
        </div>
    );
}

function formatEvalResultNumber(evalResult: number, needPercent: boolean): string {
    if (Number.isInteger(evalResult)) return evalResult.toString();

    const formatted = format(evalResult, { notation: 'fixed', precision: 4 });
    let res = parseFloat(formatted).toString();

    // 太大的值没有必要显示百分比
    if (needPercent && evalResult < 3) {
        const temp = format(evalResult * 100 - 100, { notation: 'fixed', precision: 2 })
        const fix = evalResult > 1 ? "+" : ""
        const percent = fix + parseFloat(temp).toString() + "%";
        res = `${res}(${percent})`;
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


// Function to calculate results
const calculateResults = (value: string): string => {
    const inputLines = value.split('\n');
    const resultLines = [];
    for (const line of inputLines) {
        const { lineWithoutComment, comment } = HandleOneLine(line);
        if (lineWithoutComment === "") {
            resultLines.push(comment);
            continue;
        }
        if (/^\d+(\.\d+)?$/.test(lineWithoutComment)) {
            resultLines.push(lineWithoutComment);
            continue;
        }
        let result = GetLineNoCommentResult(lineWithoutComment);
        if (comment) {
            result += `    ${comment}`;
        }
        resultLines.push(result);
    }
    return resultLines.join('\n')
};

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
    if (inpLine.includes('x') && inpLine.includes('=')) {
        try { // 尝试解方程
            result = solveEquation(inpLine);
            result = `x = ${result}`
        } catch (error) {
            console.log(`error: `, error)
            //如果solveEquation内部出错, 也不影响下面逻辑执行
            result = `${inpLine}  # 方程求解失败, 请检查方程的格式`;
        }
        return result
    }

    try {
        const needPercent = inpLine.includes('/') ? true : false
        const evalResult = evaluate(inpLine);
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

    // 定义函数 f(x) = 左边表达式 - 右边表达式
    const f = (x: number): number => {
        // 使用 Function 构造器生成计算表达式的函数
        const leftFunc = new Function("x", "return " + left);
        const rightFunc = new Function("x", "return " + right);
        return leftFunc(x) - rightFunc(x);
    };

    // 计算 f(0) 和 f(1)
    const f0 = f(0);
    const f1 = f(1);
    const coeff = f1 - f0; // 线性函数 f(x) = f0 + coeff * x

    // 如果系数为0，则需要判断是否有无穷多解或无解
    if (coeff === 0) {
        if (f0 === 0) return "Infinite solutions"; // 无穷多解
        else return "No solution"; // 无解
    }

    // 求解 f(x) = 0 => x = -f(0) / coeff
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


import { evaluate, format, MathType } from 'mathjs';
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from 'react';
import { Configs } from '@/conf';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale, Messages } from '@/i18n/types';

const APP_TITLE = 'Text Calculator';

export function TextCalcApp() {
    const { locale, messages } = useI18n();
    const [lines, setLines] = useState<{ input: string; result: string[] }>(() => {
        const savedInput = localStorage.getItem('calcInput') || '';
        return {
            input: savedInput,
            result: savedInput !== '' ? calculateResults(savedInput, messages, locale) : []
        };
    });
    const [copiedLineIndex, setCopiedLineIndex] = useState<number | null>(null);
    // --- 用于追踪鼠标悬停的行 ---
    const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleInputChange = (value: string) => {
        const resArray = calculateResults(value, messages, locale)
        setLines({ input: value, result: resArray });
        localStorage.setItem('calcInput', value);
    };

    const showNotice = (message: string) => {
        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
        }

        setNotice(message);
        noticeTimerRef.current = setTimeout(() => {
            setNotice(null);
            noticeTimerRef.current = null;
        }, 1500);
    };

    const resetWorkspace = () => {
        setLines({ input: '', result: [] });
        localStorage.removeItem('calcInput');
        setCopiedLineIndex(null);
        setHoveredLineIndex(null);
        showNotice(messages.notices.cleared);
        textareaRef.current?.focus();
    };

    const matchesShortcut = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const shortcut = Configs.ClearWorkspaceShortcut.trim().toLowerCase();
        const tokens = shortcut
            .split('+')
            .map((part) => part.trim())
            .filter(Boolean);

        if (tokens.length === 0) return false;

        const key = tokens[tokens.length - 1];
        const modifiers = new Set(tokens.slice(0, -1));

        return (
            event.key.toLowerCase() === key &&
            event.ctrlKey === modifiers.has('ctrl') &&
            event.shiftKey === modifiers.has('shift') &&
            event.altKey === modifiers.has('alt') &&
            event.metaKey === modifiers.has('meta')
        );
    };

    const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.nativeEvent.isComposing) return;
        if (!matchesShortcut(event)) return;

        event.preventDefault();
        event.stopPropagation();
        resetWorkspace();
    };

    const handleCopy = (textToCopy: string, index: number) => {
        if (!textToCopy.trim()) return;
        const resultPart = textToCopy
        navigator.clipboard.writeText(resultPart).then(() => {
            setCopiedLineIndex(index);
            setTimeout(() => {
                setCopiedLineIndex(null);
            }, 2000);
        }).catch(() => {
            showNotice(messages.notices.copyFailed);
        });
    };

    useEffect(() => {
        return () => {
            if (noticeTimerRef.current) {
                clearTimeout(noticeTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        document.title = APP_TITLE;
    }, []);

    useEffect(() => {
        setLines((prev) => {
            if (prev.input === '') {
                return prev;
            }

            return {
                ...prev,
                result: calculateResults(prev.input, messages, locale),
            };
        });
    }, [locale, messages]);

    const shortcutLabel = Configs.ClearWorkspaceShortcut
        .split('+')
        .map((part) => {
            const normalized = part.trim();
            if (!normalized) return '';
            if (normalized.length === 1) {
                return normalized.toUpperCase();
            }
            return normalized[0].toUpperCase() + normalized.slice(1);
        })
        .filter(Boolean)
        .join(' + ');

    const hasResults = lines.result.length > 0;
    const isIdle = lines.input === '' && !hasResults;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(248,250,252,0.96)_0%,rgba(255,255,255,1)_36%,rgba(244,246,248,0.98)_100%)]">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -left-24 top-[-4rem] h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
                <div className="absolute right-[-5rem] top-32 h-96 w-96 rounded-full bg-slate-200/45 blur-3xl" />
            </div>

            <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <header className="rounded-3xl border border-slate-200/80 bg-white/85 px-5 py-3 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.55)] backdrop-blur">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600">
                            {APP_TITLE}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="min-h-9">
                                {notice ? (
                                    <div
                                        className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-700 shadow-sm"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        {notice}
                                    </div>
                                ) : null}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetWorkspace}
                                className="h-9 rounded-full border-slate-300 bg-white/90 px-4 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                            >
                                {messages.actions.clear}
                                <kbd className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                    {shortcutLabel}
                                </kbd>
                            </Button>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </header>

                <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
                    <section className="flex min-h-[calc(90vh-7rem)] flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)]">
                        <div className="space-y-1">
                            <div className="text-sm font-semibold text-slate-400">
                                {messages.titles.input}
                            </div>
                        </div>
                        <Textarea
                            ref={textareaRef}
                            value={lines.input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={handleEditorKeyDown}
                            placeholder={messages.placeholders.formula}
                            className="min-h-[min(72vh,960px)] flex-1 rounded-2xl border-slate-200 bg-white/95 p-4 font-mono text-[18px] leading-8 text-slate-900 shadow-inner shadow-slate-100/70 placeholder:text-slate-400 md:text-xl"
                        />
                    </section>

                    <section className="flex min-h-[calc(90vh-7rem)] flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)]">
                        <div className="space-y-1">
                            <div className="text-sm font-semibold text-slate-400">
                                {messages.titles.result}
                            </div>
                        </div>

                        <div className="flex min-h-[min(72vh,960px)] flex-1 flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-inner shadow-slate-100/70">
                            {hasResults ? (
                                <div className="font-mono text-[18px] font-bold leading-8 text-slate-900 md:text-xl">
                                    {lines.result.map((line, index) => (
                                        <div
                                            key={index}
                                            className="group flex h-8 items-center justify-between gap-3 rounded-lg px-2 transition-colors hover:bg-slate-100/60"
                                        >
                                            <pre className="truncate font-bold">
                                                <span className={`rounded px-1 transition-colors duration-150 ${
                                                    hoveredLineIndex === index ? 'bg-slate-200/80' : 'bg-transparent'
                                                }`}>
                                                    {line || <>&nbsp;</>}
                                                </span>
                                            </pre>
                                            {line.trim() && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 rounded-full text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-200/60 hover:text-slate-900"
                                                    onClick={() => handleCopy(line, index)}
                                                    onMouseEnter={() => setHoveredLineIndex(index)}
                                                    onMouseLeave={() => setHoveredLineIndex(null)}
                                                >
                                                    {copiedLineIndex === index ? (
                                                        <Check className="h-4 w-4 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">{messages.actions.copyLine}</span>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : isIdle ? (
                                <div className="flex flex-1 items-center justify-center text-left">
                                    <div className="max-w-md space-y-5">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                                                {messages.titles.quickTips}
                                            </div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                                                {messages.emptyState.heading}
                                            </h2>
                                            <p className="text-sm leading-6 text-slate-600">
                                                {messages.emptyState.description}
                                            </p>
                                        </div>

                                        <div className="grid gap-3 text-sm text-slate-700">
                                            <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm">
                                                {messages.emptyState.bullet1}
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm">
                                                {messages.emptyState.bullet2}
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm">
                                                {messages.emptyState.bullet3}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-1 items-center justify-center text-center">
                                    <div className="max-w-sm space-y-2">
                                        <div className="text-base font-semibold text-slate-700">
                                            {messages.noResults.heading}
                                        </div>
                                        <div className="text-sm leading-6 text-slate-500">
                                            {messages.noResults.description}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

// --- 5. 修改计算函数: 返回 string[] 而不是 string ---
const calculateResults = (value: string, messages: Messages, locale: Locale): string[] => {

    if (value === '') {
        return [];
    }

    const inputLines = value.split('\n');
    const resultLines = [];
    for (const line of inputLines) {
        if (line.trim() === '') {
            resultLines.push('');
            continue;
        }
        const { lineWithoutComment, comment } = HandleOneLine(line);
        if (lineWithoutComment === '') {
            resultLines.push(comment ? `# ${comment}` : '');
            continue;
        }
        if (/^\d+(\.\d+)?$/.test(lineWithoutComment)) {
            // 如果是纯数字，直接推入
            resultLines.push(lineWithoutComment);
            continue;
        }
        let result = GetLineNoCommentResult(lineWithoutComment, messages, locale);
        if (comment) {
            result += `    # ${comment}`;
        }
        resultLines.push(result);
    }
    return resultLines;
};




function formatEvalResultNumber(evalResult: number, needPercent: boolean, locale: Locale): string {
    if (Number.isInteger(evalResult)) {
        return new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: false }).format(evalResult);
    }

    const res = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 4,
        useGrouping: false,
    }).format(evalResult);

    // 股票涨跌幅显示优化 假如比例值处在[70%, 130%]时显示具体的百分比 实际上A股日内涨跌幅是20%以内 30%能满足大部分情况
    if (Configs.ShowNumPercentDetail){  // 通过配置开启或者关闭
        if (needPercent && evalResult < 1.3 && evalResult > 0.7) {
            const percent = new Intl.NumberFormat(locale, {
                maximumFractionDigits: 2,
                useGrouping: false,
                signDisplay: 'always',
            }).format(evalResult * 100 - 100);
            return `${res} (${percent}%)`;
        }
    }
    return res
}

function formatEvalResult(evalResult: MathType, needPercent: boolean, locale: Locale): string {
    if (typeof evalResult === 'number') {
        return formatEvalResultNumber(evalResult, needPercent, locale)
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
    return { lineWithoutComment, comment };
}


function GetLineNoCommentResult(inpLine: string, messages: Messages, locale: Locale) {
    let result = '';
    // --- 创建一个仅用于计算的副本，将 x 替换为 * ---
    const lineForCalc = inpLine.replaceAll('x', '*');

    if (inpLine.includes('a') && inpLine.includes('=')) {
        try { // 尝试解方程
            result = solveEquation(lineForCalc, messages);
            result = `${messages.calculations.equationPrefix}${result}`;
        } catch {
            //如果solveEquation内部出错, 也不影响下面逻辑执行
            result = `${inpLine}  # ${messages.calculations.equationSolveFailed}`;
        }
        return result
    }

    try {
        const needPercent = lineForCalc.includes('/') ? true : false
        const evalResult = evaluate(lineForCalc);
        const formattedResult = formatEvalResult(evalResult, needPercent, locale);
        result = `${inpLine} = ${formattedResult}`; 
    } catch {
        result = `${inpLine}`;
    }
    return result
}


/** 输入一个一元一次方程 x表示需要求解的变量 */
function solveEquation(equation: string, messages: Messages): string {
    // 将方程以"="拆分为左右两部分
    const parts = equation.split('=');
    if (parts.length !== 2) {
        throw new Error(messages.calculations.equationFormatError);
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
        if (f0 === 0) return messages.calculations.equationInfiniteSolutions;
        else return messages.calculations.equationNoSolution;
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

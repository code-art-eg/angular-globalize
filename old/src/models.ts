export interface Dictionary<T> {
    [key: string]: T|undefined;
}

export interface NumberFormatInfo {
    zeroChar: string;
    plusSign: string;
    minusSign: string;
    timeSeparator: string;
    decimalSeperator: string;
    groupSeperator: string;
    formatter: FormatterFunction<number>;
}

export type FormatterFunction<TInput> = (val: TInput) => string;
export type FormatterFactory<TInput, TOptions>
    = (locale: string, options: TOptions|undefined) => FormatterFunction<TInput>;
export type ParserFunction<TOutput> = (val: string) => TOutput;
export type ParserFactory<TOutput, TOptions>
    = (options: TOptions | undefined) => ParserFunction<TOutput>;

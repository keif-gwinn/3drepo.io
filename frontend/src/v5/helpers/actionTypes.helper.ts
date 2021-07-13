// tslint:disable-next-line:max-line-length
type CapitalLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

type Constant<S extends string> =
S extends `${infer First}${CapitalLetter}${infer Second}` ? `${Uppercase<First>}_S${Uppercase<Second>}` : Uppercase<S>;

type Constants<Type> = {
	[Property in keyof Type as Constant<`${string & Property}`>]: Constant<`${string & Property}`>;
};

import Embed from './Embed';
export default class Utils {
    static fetch: (url: string, options: any) => Promise<Buffer | any>;
    static download: (url: string) => Promise<Buffer>;
    static randomNumber: (min: number, max: number) => number;
    static capitalize: (text: string) => string;
    static Embed: typeof Embed;
    static emojies: string[];
    static urlRegExp: RegExp;
    static urlMatch: (text: string) => RegExpMatchArray | null;
}
//# sourceMappingURL=index.d.ts.map
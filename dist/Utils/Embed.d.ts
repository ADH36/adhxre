import { IEmbed } from '../Typings';
export default class Embed implements IEmbed {
    header: string;
    body: string;
    footer: string;
    constructor(config?: IEmbed);
    setHeader: (header: string) => void;
    setBody: (body: string) => void;
    setFooter: (footer: string) => void;
    get: () => string;
}
//# sourceMappingURL=Embed.d.ts.map
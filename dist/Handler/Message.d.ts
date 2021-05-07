import { MessageType, WAMessage } from '@adiwajshing/baileys';
import { Client } from '../Client';
import { IParsedArgs } from '../Typings';
export declare class Message {
    private client;
    validTypes: any[];
    constructor(client: Client);
    handleGroupMessage: (M: any) => Promise<void>;
    handleDirectMessage: (M: any) => Promise<void>;
    validate: (Msg: any) => false | {
        type: any;
        chat: 'group' | 'dm';
    };
    getBase: (M: any, message: any) => {
        body: string | null | undefined;
        media: WAMessage | null;
    };
    parseArgs: (text: string) => false | IParsedArgs;
    freeText: (text: string, M: any) => Promise<void>;
    checkMessageandAct: (M: any, username: string, metadata: any) => Promise<boolean>;
    moderate: (M: any, text: string, metadata: any, username: string) => Promise<boolean>;
    checkForGroupLink: (text: string) => boolean;
    isMessageSafe: (M: any) => boolean;
    loopText: (inc: number) => string;
}
//# sourceMappingURL=Message.d.ts.map
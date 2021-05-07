import { WAConnection, WAContact, WAGroupMetadata, WAMessage } from '@adiwajshing/baileys/';
import { Model } from 'mongoose';
import { IReply, IConfig, IGroupModel, IUserModel, ISessionModel, ISession } from '../Typings';
export declare class Client extends WAConnection {
    GroupModel: Model<IGroupModel>;
    UserModel: Model<IUserModel>;
    SessionModel: Model<ISessionModel>;
    assets: any;
    browserDescription: [string, string, string];
    private config;
    constructor(GroupModel: Model<IGroupModel>, UserModel: Model<IUserModel>, SessionModel: Model<ISessionModel>);
    getMods(): string[];
    getSession(ID: string): Promise<ISession | false>;
    updateSession(ID: string): Promise<void>;
    reply(jid: string, options: IReply, quote?: WAMessage): Promise<unknown>;
    get _config(): IConfig;
    getUser(jid: string): Promise<{
        user: WAContact;
        data: IUserModel;
    }>;
    banUser(jid: string, ban: boolean): Promise<boolean>;
    everyone(jid: string, metadata: WAGroupMetadata, admin: boolean, hidden: boolean, M?: WAMessage): Promise<void>;
    getPfp(jid: string): Promise<string | null>;
    banAction(chat: string, users: string[], ban: boolean, M: WAMessage): Promise<void>;
    clearCycle: (time: string) => Promise<void>;
    clearAllChats: () => Promise<{
        status: 200 | 500;
    }>;
    getLinkPreview: (link: string) => Promise<Buffer>;
    deleteQuotedMessage: (M: any) => Promise<string>;
}
//# sourceMappingURL=Utils.d.ts.map
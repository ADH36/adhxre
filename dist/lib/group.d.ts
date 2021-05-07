import { Client } from '../Client';
import { IGroup, IGroupinfo, IReply } from '../Typings';
export declare class GroupEx {
    client: Client;
    constructor(client: Client);
    toggleEvent: (chat: string, contacts: string[], uia: boolean, xim: boolean, type: 'promote' | 'demote' | 'remove') => Promise<IReply>;
    register: (admin: boolean, chat: IGroup, register: boolean, type: toggleableGroupActions) => Promise<IReply>;
    join: (text: string, mod: boolean, username?: string) => Promise<IReply>;
    simplifiedGroupInfo: (info: IGroupinfo) => Promise<IReply>;
    announce: (metadata: any, admin: boolean, me: boolean, announce: boolean) => Promise<IReply>;
    purge: (metadata: any, sender: string, me: boolean) => Promise<IReply>;
    purgeSet: Set<string>;
    addToPurge: (id: string) => Promise<void>;
}
export declare enum toggleableGroupActions {
    events = "events",
    NSFW = "nsfw",
    safe = "safe",
    mod = "mod"
}
//# sourceMappingURL=group.d.ts.map
import { GroupEx } from '../lib';
import { IGroupinfo } from '../Typings';
import { Client as Base } from './ML';
export declare class Client extends Base {
    group: GroupEx;
    getGroupInfo(jid: string): Promise<IGroupinfo>;
}
//# sourceMappingURL=Group.d.ts.map
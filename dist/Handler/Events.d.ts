import { Client } from '../Client';
import { IEvent, IGroupinfo } from '../Typings';
export declare class EventHandler {
    client: Client;
    constructor(client: Client);
    handle: (event: IEvent) => Promise<void>;
    add: (event: IEvent, group: IGroupinfo) => Promise<void>;
    leave: (event: IEvent) => Promise<void>;
}
//# sourceMappingURL=Events.d.ts.map
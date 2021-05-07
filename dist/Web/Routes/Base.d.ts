import { Client } from '../../Client';
import { Web } from '../Web';
export declare class BaseRoutes {
    client: Client;
    web: Web;
    clientRouter: any;
    constructor(client: Client, web: Web);
    auth: (req: any) => true | {
        error: string;
    };
    connectionOptions: string[];
}
//# sourceMappingURL=Base.d.ts.map
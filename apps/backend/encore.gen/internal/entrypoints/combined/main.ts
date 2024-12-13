import { registerGateways, registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";

import { get as hello_getImpl0 } from "../../../../hello/hello";
import { convert as video_convertImpl1 } from "../../../../videos/convert";
import * as hello_service from "../../../../hello/encore.service";
import * as video_service from "../../../../videos/encore.service";

const gateways: any[] = [
];

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "hello",
            name:              "get",
            handler:           hello_getImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"auth":false,"expose":true,"isRaw":false,"isStream":false},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "video",
            name:              "convert",
            handler:           video_convertImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"auth":false,"expose":true,"isRaw":false,"isStream":false},
        middlewares: video_service.default.cfg.middlewares || [],
    },
];

registerGateways(gateways);
registerHandlers(handlers);

await run();

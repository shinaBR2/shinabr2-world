import { registerGateways, registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";

import { get as health_check_getImpl0 } from "../../../../health-check/index";
import { get as hello_getImpl1 } from "../../../../hello/hello";
import { getUsers as hello_getUsersImpl2 } from "../../../../hello/users";
import { convert as video_convertImpl3 } from "../../../../videos/convert";
import * as health_check_service from "../../../../health-check/encore.service";
import * as hello_service from "../../../../hello/encore.service";
import * as video_service from "../../../../videos/encore.service";

const gateways: any[] = [
];

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "health-check",
            name:              "get",
            handler:           health_check_getImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"auth":false,"expose":true,"isRaw":false,"isStream":false},
        middlewares: health_check_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "hello",
            name:              "get",
            handler:           hello_getImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"auth":false,"expose":true,"isRaw":false,"isStream":false},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "hello",
            name:              "getUsers",
            handler:           hello_getUsersImpl2,
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
            handler:           video_convertImpl3,
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

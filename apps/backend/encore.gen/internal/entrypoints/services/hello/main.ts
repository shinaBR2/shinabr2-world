import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { get as getImpl0 } from "../../../../../hello/hello";
import { getUsers as getUsersImpl1 } from "../../../../../hello/users";
import * as hello_service from "../../../../../hello/encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "hello",
            name:              "get",
            handler:           getImpl0,
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
            handler:           getUsersImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"auth":false,"expose":true,"isRaw":false,"isStream":false},
        middlewares: hello_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);
await run();

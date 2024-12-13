import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as hello_service from "../../../../hello/encore.service";

export async function get(params) {
    const handler = (await import("../../../../hello/hello")).get;
    registerTestHandler({
        apiRoute: { service: "hello", name: "get", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: hello_service.default.cfg.middlewares || [],
        endpointOptions: {"auth":false,"expose":true,"isRaw":false,"isStream":false},
    });

    return apiCall("hello", "get", params);
}


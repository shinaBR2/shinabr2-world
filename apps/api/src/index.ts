import * as healthCheck from "./healthCheck";
import { ListenAPIs } from "./admin";

// trigger deploy 5

const adminAPIs = {
  admin: ListenAPIs,
};

export { healthCheck, adminAPIs };

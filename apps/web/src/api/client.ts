import createFetchClient from "openapi-fetch";
import createQueryClient from "openapi-react-query";
import type { components, paths } from "./schema.js";

/** Typed client over the generated OpenAPI schema. Regenerate with `pnpm api:schema` after changing API routes. */
export const fetchClient = createFetchClient<paths>({ baseUrl: "/" });
export const api = createQueryClient(fetchClient);

export type Account = components["schemas"]["Account"];
export type VerifyError = components["schemas"]["VerifyError"]["error"];

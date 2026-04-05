import { userResolver } from "./user.resolver";
import { recordResolver } from "./record.resolver";
import { dashboardResolver } from "./dashboard.resolver";

export const resolvers = [userResolver, recordResolver, dashboardResolver];
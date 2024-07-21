import { App } from "@/app";
import { ValidateEnv } from "@utils/validateEnv";

import { AuthRoute } from "@routes/auth.route";
import { UserRoute } from "@routes/users.route";

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();

import { ValidateEnv } from "./utils/validateEnv";
import { App } from "./app";
import { AuthRoute } from "./routes/auth.route";

ValidateEnv();

const app = new App([new AuthRoute()]);

app.listen();

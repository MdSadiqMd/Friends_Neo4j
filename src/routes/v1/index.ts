import { Hono } from "hono";

import friendsRouter from "./friends.routes";
import userRouter from "./user.routes";

const v1Router = new Hono();

v1Router.route('/friends', friendsRouter);
v1Router.route('/user', userRouter);

export default v1Router;
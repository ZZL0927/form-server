import * as Router from "koa-router";
import { Context } from "koa";
import { catchError, check, generateOk } from "../libs/check";
import { checkBody, checkToken } from "../middlewares/dataCheck";
import * as userKit from "../kits/user";
import * as problemKit from "../kits/problem";
import { checkCancelProblemBody, checkStarBody } from "./problem.check";
import { ICancelStarReq, IStarProblemReq } from "../types/request";

const router = new Router({
  prefix: "/api/problem",
});

router.get("/listType", async (ctx: Context) => {
  try {
    const problemTypes = await problemKit.getProblemTypes()
    ctx.body = generateOk({ problemTypes });
  } catch (err) {
    catchError(err, ctx);
  }
});

router.get("/listBasic", checkToken(userKit.checkToken), async (ctx: Context) => {
  try {
    const basicProblems = await problemKit.getBasicProblem()
    ctx.body = generateOk({ basicProblems });
  } catch (err) {
    catchError(err, ctx);
  }
});

router.post(
  "/listStar",
  checkToken(userKit.checkToken),
  async (ctx: Context) => {
    try {
      const token = ctx.cookies.get("token");
      const items = await problemKit.listStar(token);
      ctx.body = generateOk({ items });
    } catch (err) {
      catchError(err, ctx);
    }
  }
);

router.post(
  "/star",
  checkToken(userKit.checkToken),
  checkBody(checkStarBody),
  async (ctx: Context) => {
    try {
      const token = ctx.cookies.get("token");
      const { problem } = ctx.request.body as IStarProblemReq;
      const id = await problemKit.star(token, problem);
      ctx.body = generateOk({ id });
    } catch (err) {
      catchError(err, ctx);
    }
  }
);

router.post(
  "/cancelStar",
  checkToken(userKit.checkToken),
  checkBody(checkCancelProblemBody),
  async (ctx: Context) => {
    try {
      const token = ctx.cookies.get("token");
      const { id } = ctx.request.body as ICancelStarReq;
      await problemKit.cancelStar(token, id);
      ctx.body = generateOk();
    } catch (err) {
      catchError(err, ctx);
    }
  }
);

export default router;

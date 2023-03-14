import db_mongo from '../db/index'
import * as crypto from "crypto";
import config from "../config";
import { EStatus, IUser } from "../types/models";
import { check } from "../libs/check";

const session = [];
const collection = db_mongo.collection("users")

export async function createUser(account: string, pwd: string) {
  const result = await collection.find({
    "account":account
  }).toArray()
  const user = result[0]
  check(!user, "ERR_ACCOUNT_EXIST");
  const id = crypto.randomUUID();
  const hashPwd = crypto
    .createHmac("sha256", config.secret)
    .update(pwd)
    .digest("hex");
  const now = Date.now();
  await collection.insertOne({
    id,
    account,
    pwd: hashPwd,
    status: EStatus.normal,
    ctime: now,
    utime: now,
    nickname: account,
    avatar: "",
  })
  return id;
}

export async function setUserInfo(
  id: string,
  nickname: string,
  avatar: string
) {
  const result = await collection.find({
    "id":id
  }).toArray()
  const user = result[0]
  check(!!user, "ERR_USER_NOT_FOUND");
  await collection.updateOne({"id":id},{$set:{ nickname, avatar }})
}

export async function login(account: string, pwd: string) {
  const result = await collection.find({
    "account": account
  }).toArray() as unknown as IUser
  const user = result[0]
  
  check(!!user, "ERR_ACCOUNT_NOT_FOUND");
  const hashPwd = crypto
    .createHmac("sha256", config.secret)
    .update(pwd)
    .digest("hex");
    
  check(hashPwd === user.pwd, "ERR_PWD_NOT_CORRECT");
  if (!session.includes(user.id)) {
    session.push(user.id);
  }
  return user.id;
}

export function logout(token: string) {
  const index = session.indexOf(token);
  session.splice(index, 1);
}

export function checkToken(token: string) {
  const isLogin = session.includes(token);
  check(isLogin, "ERR_USER_NOT_LOGIN");
}

export async function getUserInfo(token: string) {
  const result = await collection.find({"id":token}).toArray()
  const user = result[0]
  check(!!user, "ERR_USER_NOT_FOUND");
  return user;
}
//todo
export async function changePwd(token: string, pwd: string, oldPwd: string) {
  const result = await collection.find({"id":token}).toArray()
  check(!!result.length, "ERR_USER_NOT_FOUND");
  const user = result[0]
  const hashOldPwd = crypto
    .createHmac("sha256", config.secret)
    .update(oldPwd)
    .digest("hex");
  check(hashOldPwd === user.pwd, "ERR_OLD_PWD_NOT_CORRECT");
  const hashPwd = crypto
    .createHmac("sha256", config.secret)
    .update(pwd)
    .digest("hex");
    await collection.updateOne({"id":token},{$set:{pwd:hashPwd}})
  logout(token);
}

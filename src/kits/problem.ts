import db_mongo from '../db/index'
import { EStatus, IProblem, TProblemType } from "../types/models";
import * as crypto from "crypto";
import { check } from '../libs/check';
const typeCollection = db_mongo.collection("problemTypes")
const problemCollection = db_mongo.collection("basicProblems")
const starProblemsCollection = db_mongo.collection("starProblems")

export async function getProblemTypes() {
  const types = await typeCollection.find({}).toArray()
  return types
}

export async function getBasicProblem() {
  const problems = await problemCollection.find({}).toArray()
  return problems
}

export async function listStar(token: string) {
  const items = await starProblemsCollection.find({uId:token,status:2}).toArray()
  return items;
}

export async function cancelStar(token: string, id: string) {
  const items = await starProblemsCollection.find({id,uId:token,status:2}).toArray()
  check(!!items.length,"ERR_STAR_NOT_FOUND")
  const item = await starProblemsCollection.updateOne({id,uId:token,status:2},{$set:{status:1}})
  return item;
}

export async function star(
  token: string,
  problem: Omit<IProblem<TProblemType>, "result" | "id" | "status">
) {
  const id = crypto.randomUUID();
  await starProblemsCollection.insertOne({ id, uId: token, status: EStatus.normal, problem })
  return id;
}

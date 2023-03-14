import db from "../db";
import db_mongo from '../db/index'
import { IProblem, TProblemType } from "../types/models";
import * as crypto from "crypto";
import { check } from "../libs/check";
import { formKit } from ".";
const collection = db_mongo.collection("formResults")
export async function getDetail(token: string, id: string) {
  const items = await collection.find({id,formAuthor : token}).toArray()
  check(!!items.length, "ERR_FORM_RESULT_NOT_FOUND");
  const item = items[0]
  return item;
}

export async function create(
  formId: string,
  problems: IProblem<TProblemType>[]
) {
  const id = crypto.randomUUID();
  const form = await formKit.getIngForm(formId);
  await collection.insertOne({id,formAuthor: form.author, formId, result: problems})
}

export async function getFormResult(token: string, formId: string) {
  const items = await collection.find({formId,formAuthor:token}).toArray()
  return items;
}

import db from "../db";
import db_mongo from '../db/index'
import { EFormStatus, IForm, IProblem, TProblemType } from "../types/models";
import * as crypto from "crypto";
import { check } from "../libs/check";
const collection = db_mongo.collection("forms")
export async function listForm(
  token: string,
  isStar = undefined,
  offset = 0,
  limit = 10
) {
  let items =
    isStar === undefined
      ? await collection.find({"author":token,"status":{$ne:EFormStatus.delete}}).toArray()
      : await collection.find({"author":token,"status":{$ne:EFormStatus.delete},"isStar":isStar}).toArray()
  const total = items.length;
  items = items.filter(
    (_item, index) => index >= offset * limit && index < offset * limit + limit
  );
  return [items, total];
}

export async function createForm(
  token: string,
  title: string,
  subTitle: string,
  problems: IProblem<TProblemType>[]
) {
  const now = Date.now();
  const id = crypto.randomUUID();
  problems = problems.map((p) => {
    const id = crypto.randomUUID();
    p.id = id;
    if (
      p.type === "multiSelect" ||
      p.type === "pullSelect" ||
      p.type === "singleSelect"
    ) {
      p.setting.options.map((o) => {
        const id = crypto.randomUUID();
        o.id = id;
      });
    }
    return p;
  });
  await collection.insertOne({
      id,
      ctime: now,
      utime: now,
      status: EFormStatus.normal,
      author: token,
      isStar: false,
      title,
      subTitle,
      problems,
  })
  return id;
}

export async function getForm(id: string) {
  const forms = await collection.find({id,"status":{$ne:EFormStatus.delete}}).toArray()
  check(!!forms.length, "ERR_FORM_NOT_FOUND");
  const form = forms[0]
  return form;
}

export async function getIngForm(id: string) {
  const forms = await collection.find({id,status:EFormStatus.ing}).toArray()
  check(!!forms.length, "ERR_FORM_NOT_FOUND");
  const form = forms[0]
  return form;
}

export async function delForm(token: string, id: string) {
  const form = await collection.find({"author":token,"id":id,"status":{$ne:EFormStatus.delete}}).toArray()
  check(!!form.length, "ERR_FORM_NOT_FOUND");
  await collection.updateOne({"id":id},{$set:{"status":EFormStatus.delete}})
  return form;
}

export async function setFormStatus(token: string, id: string, status: EFormStatus) {
  const forms = await collection.find({"author":token,id,"status":{$ne:EFormStatus.delete}}).toArray()
  check(!!forms.length, "ERR_FORM_NOT_FOUND");
  const form = forms[0]
  await collection.updateOne({id},{$set:{status}})
  return form;
}

export async function starForm(token: string, id: string, isStar: boolean) {
  const form = await collection.find({"author":token,"id":id,"status":{$ne:EFormStatus.delete}}).toArray()
  check(!!form.length, "ERR_FORM_NOT_FOUND");
  await collection.updateOne({"id":id},{$set:{"isStar":isStar}})
  return form;
}

export async function updateForm(token: string, form: IForm) {
  const item = await db
    .get("forms")
    .find((form) => form.author === token && form.status === EFormStatus.normal)
    .assign({ ...form })
    .write();
  check(!!form, "ERR_FORM_NOT_FOUND");
  return item;
}

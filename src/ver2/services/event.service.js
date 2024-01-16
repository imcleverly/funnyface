import { apiMeta } from "./api";

export const getEventsByUserId = (id) =>
  apiMeta.get(`/lovehistory/page/1?id_user=${id}`);

export const getAllEventsByUserId = (id) =>
  apiMeta.get(`/lovehistory/user/${id}`);

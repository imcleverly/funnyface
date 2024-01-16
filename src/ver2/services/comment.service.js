import { apiMeta } from "./api";

export const getCommentsByUserId = (id) =>
  apiMeta.get(`/lovehistory/pageComment/1?id_user=${id}`);

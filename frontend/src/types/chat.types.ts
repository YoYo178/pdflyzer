export interface IChat {
  _id: string;
  name: string;
  owner_id: string;
  updated_at: string;
  pinned?: boolean; // TODO: add in backend
}
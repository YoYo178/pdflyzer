export interface IChat {
  _id: string;

  name: string;
  owner: string;

  pinned?: boolean;

  created_at: string;
  updated_at: string;
}
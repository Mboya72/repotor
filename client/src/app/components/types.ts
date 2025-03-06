// types.ts or interfaces.ts

export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  following: Follow[];
  followers: Follow[];
  bookmarks: Bookmark[]
}
export interface Bookmark {
  id: number;
  user_id: number;
  record_id: number;
  created_at: string
}

export interface Follow{
  id: number;
  follower_id: number;
  followed_id: number;
  created_at: string
}

export interface Record {
  id: number;
  user_id: number;
  type: string; // e.g., "red-flag" or "intervention"
  description: string;
  status: string; // e.g., "under investigation"
  latitude: number | null; // Latitude could be null
  longitude: number | null; // Longitude could be null
  image_url: string | null; // URL to image, can be null if no image
  video_url: string | null; // URL to video, can be null if no video
  created_at: string; // ISO string format for created_at
  user: User; // The user data associated with the record
  likes: Like[]
}

export interface Comment {
  id: number;
  user_id: number;
  record_id: number;
  message: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  user: User;
  record: Record;
}

export interface Like {
  id: number;
  user_id: number;
  record_id: number;
  created_at: string;
  user: User;
  record: Record
}
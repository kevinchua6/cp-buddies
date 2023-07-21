import { PlatformType } from "@/pages";

const SAVED_USERS = "savedUsers";

export interface SavedUsers {
  leetcode: string[];
  atcoder: string[];
  cf: string[];
}

export class LocalStorage {
  static getSavedUsers(): SavedUsers {
    return JSON.parse(
      localStorage.getItem(SAVED_USERS) ||
        '{"leetcode":[],"atcoder":[],"cf":[]}'
    ) as SavedUsers;
  }

  static addSavedUserToPlatform(user: string, platform: PlatformType): void {
    const savedUsers = this.getSavedUsers();
    savedUsers[platform].push(user);
    localStorage.setItem(SAVED_USERS, JSON.stringify(savedUsers));
  }
}

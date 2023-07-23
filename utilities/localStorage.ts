import { PlatformType } from "@/pages";

const SAVED_USERS = "savedUsers";

export interface SavedUsers {
  leetcode: string[];
  atcoder: string[];
  cf: string[];
}

export class LocalStorage {
  static getSavedUsers() {
    return JSON.parse(
      localStorage.getItem(SAVED_USERS) ||
        '{"leetcode":[],"atcoder":[],"cf":[]}'
    ) as SavedUsers;
  }

  static addSavedUserToPlatform(user: string, platform: PlatformType) {
    const savedUsers = this.getSavedUsers();
    if (savedUsers[platform].includes(user)) return;

    savedUsers[platform].push(user);
    localStorage.setItem(SAVED_USERS, JSON.stringify(savedUsers));
  }

  static removeSavedUserFromPlatform(user: string, platform: PlatformType) {
    const savedUsers = this.getSavedUsers();
    savedUsers[platform] = savedUsers[platform].filter((u) => u !== user);
    localStorage.setItem(SAVED_USERS, JSON.stringify(savedUsers));
  }
}

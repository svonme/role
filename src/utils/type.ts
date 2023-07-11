
import type { RouteLocationNormalized, RouteRecord } from "vue-router";

// 0根节点、1系统、2目录、3菜单、4按钮
export enum MenuType {
  root = "0",
  app = "1",
  folder = "2",
  page = "3",
  button = "4"
}

export interface Menu {
  id: string;       // 权限ID
  pid?: string;      // App ID
  name?: string; // 权限名称
  key: string | RegExp; // 权限唯一标识， 用于判断权限凭证
}


export type RoleCallback = (list: Menu[], type?: MenuType | MenuType[]) => boolean;
export type RoleType = boolean | string  | RouteRecord | RouteLocationNormalized | RoleCallback | Array<string  | RouteRecord | RouteLocationNormalized | RoleCallback>;
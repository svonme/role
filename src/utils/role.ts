/**
 * @file 角色，权限判断
 */

import * as _ from "lodash-es";
import { MenuType } from "./type";
import DBList from "@fengqiaogang/dblist";
import safeGet from "@fengqiaogang/safe-get";

import type { Menu, RoleCallback, RoleType } from "./type";


const menuDb = new DBList<Menu>([], "id", "pid");
export const setMenuList = function(value: Menu[] | Menu) {
  menuDb.insert(value);
}

export const getMenuList = function(type?: MenuType | MenuType[]): Menu[] {
  return type ? menuDb.select({ type: _.concat(type) }) : menuDb.clone();
}

const _assert = function(value: string | boolean | RoleCallback, type?: MenuType | MenuType[]): boolean {
  // 如何权限规则为 true, 则默认为有权限
  if (value && _.isBoolean(value)) {
    return true;
  }
  if (value && _.isFunction(value)) {
    return value(getMenuList(type), type);
  }
  let status = false;
  // 根据资源菜单中配置的权限进行比较，判断
  for (const data of getMenuList(type)) {
    if (data.key && _.isString(data.key)) {
      // 如果路由规则为字符串
      // 判断两个值是否相等
      status = value === data.key;
    } else if (data.key && _.isRegExp(data.key)) {
      // 如果路由规则为正则对象
      // 校验是否符合规则
      status = data.key.test(value as string);
    }
    if (status) {
      break;
    }
  }
  return status;
}

/**
 * 判断权限
 * @param value 角色
 * @param type  角色类型，为空时全局检索
 * @returns boolean
 */
export const assert = function(role: RoleType, type?: MenuType | MenuType[]): boolean {
  const list = _.concat(_.concat(role));
  let status = false;
  for (const value of list) {
    if (_.isString(value) || _.isFunction(value) || _.isBoolean(value)) {
      status = _assert(value, type);
    } else {
      const temp = safeGet<RoleType>(value, "meta.roles");
      if (temp) {
        status = assert(temp, type);
      }
    }
    if (status) {
      break;
    }
  }
  return status;
}

/**
 * 判断是否页面权限
 * @param role 角色或者时 Router 对象
 * @returns boolean
 */
export const page = function(role: RoleType): boolean {
  return assert(role, MenuType.page);
}


/**
 * 判断是否有按钮权限
 * @param role 按钮规则, 可以是多个规则 
 * @returns boolean
 * @description 如果 role 为多个规则时，只有满足其中一个则认为有权限
 */
export const buttton = function(role: string | string[]): boolean {
  return assert(role, MenuType.button);
}

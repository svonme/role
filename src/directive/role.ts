/**
 * @file 权限控制
 * @author svon.me@gmail.com
 */

import * as _ from "lodash-es";
import * as role from "../utils/role";
import safeGet from "@fengqiaogang/safe-get";
import { MenuType } from "../utils/type";

import type { App } from "vue";

const getMenuType = function(bind: object): MenuType | undefined {
  const button = safeGet<MenuType>(bind, "modifiers.button");
  const page = safeGet<MenuType>(bind, "modifiers.page");
  if (button) {
    return MenuType.button;
  }
  if (page) {
    return MenuType.page;
  }
}

const show = function(el: HTMLElement) {
  el.style.display = "";
}

const hidden = function(el: HTMLElement) {
  el.style.display = "none";
}

const main = function(el: HTMLElement, bind: object) {
  // 权限规则
  const value = _.compact(_.concat(safeGet<string>(bind, "value")));
  // 权限判断
  const status = role.assert(value, getMenuType(bind));
  const parent = el.parentNode as HTMLDivElement;
  if (parent && parent.className) {
    // 判断是否为 Space 节点
    if (_.includes(parent.className, "ant-space-item")) {
      return status ? show(parent) : hidden(parent);
    }
  }
  return status ? show(el) : hidden(el);
};

export default {
  install: function(app: App) {
    app.directive("role", {
      mounted: main,
      updated: main
    });
  }
}
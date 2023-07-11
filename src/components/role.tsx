/**
 * @file 权限组件
 * @author svon.me@gmail.com
 */

import * as _ from "lodash-es";
import { useRouter } from "vue-router";
import * as role from "../utils/role";
import { MenuType } from "../utils/type";
import { defineComponent, PropType, onMounted, onUpdated } from "vue";

import type { RoleType } from "../utils/type";


interface Props {
  value: RoleType;
  page?: boolean;
  button?: boolean;
};

export default defineComponent({
  name: "Role",
  props: {
    value: {
      required: false,
      default: false,
      type: Object as PropType<RoleType>
    },
    page: {
      required: false,
      default: () => false,
      type: Boolean,
    },
    button: {
      required: false,
      default: () => false,
      type: Boolean,
    }
  },
  setup(props: Props, { slots }) {
    const router = useRouter();
    let status: boolean;
    if (props.button) {
      status = role.assert(props.value, MenuType.button);
    } else if (props.page) {
      status = role.assert(props.value, MenuType.page);
    } else {
      status = role.assert(props.value);
    }
    const onLoad = function() {
      // 如果权限结果为 false 并且当前逻辑为页面
      if (!status && props.page) {
        // 跳转到 404 页面
        router.replace("/404");
      }
    }
    onMounted(onLoad);
    onUpdated(onLoad);
    return () => {
      if (status && slots.default) {
        return slots.default();
      }
    }
  }
});
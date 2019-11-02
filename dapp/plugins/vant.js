import Vue from "vue";
import Toast from "vant/lib/toast";
import ActionSheet from "vant/lib/action-sheet";
import Field from "vant/lib/field";

import "vant/lib/toast/style";
import "vant/lib/action-sheet/style";

import "vant/lib/field/style";
import "cube-ui/lib/scroll/style.css";

Vue.use(ActionSheet)
  .use(Toast)
  .use(Field);

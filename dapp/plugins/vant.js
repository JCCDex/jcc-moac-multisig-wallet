import Vue from "vue";
import Button from "vant/lib/button";
import Toast from "vant/lib/toast";
import "vant/lib/toast/style";

import "vant/lib/button/style";
import ActionSheet from "vant/lib/action-sheet";
import "vant/lib/action-sheet/style";

Vue.use(ActionSheet)
  .use(Button)
  .use(Toast);

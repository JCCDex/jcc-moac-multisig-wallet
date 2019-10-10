import { isDev } from "~/js/util";
import tp from "tp-js-sdk";

if (!isDev()) {
  tp.popGestureRecognizerEnable({ enable: false });
  tp.forwardNavigationGesturesEnable({ enable: false });
}

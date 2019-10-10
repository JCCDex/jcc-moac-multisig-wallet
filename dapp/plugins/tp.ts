import tp from "tp-js-sdk";

if (tp.isConnected()) {
  tp.popGestureRecognizerEnable({ enable: false });
  tp.forwardNavigationGesturesEnable({ enable: false });
}

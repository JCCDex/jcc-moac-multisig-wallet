export default function({ route, redirect }) {
  if (route.path === "/") {
    return redirect("/home");
  }
}

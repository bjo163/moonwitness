import { defineModule } from "@modules/define-module"
import { LoginView } from "./views/login-view"
import { ProfileView } from "./views/profile-view"

/**
 * Auth Module — MoonWitness OS
 *
 * Manajemen sesi pengguna dan profil.
 */
export default defineModule({
  id: "auth",
  label: "AUTH",
  icon: "User",
  type: "CORE_OS",
  navPlacement: "SYSTEM_TRAY",
  basePath: "/auth",
  defaultRoute: "login",
  routes: [
    { slug: "login", label: "Login", icon: "LogIn", component: LoginView },
    { slug: "profile", label: "Profile", icon: "User", component: ProfileView },
  ],
})


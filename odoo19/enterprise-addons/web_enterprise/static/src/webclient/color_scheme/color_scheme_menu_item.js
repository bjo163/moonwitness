import { _t } from "@web/core/l10n/translation";
import { markup } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { browser } from "@web/core/browser/browser";
import { cookie } from "@web/core/browser/cookie";
import { user } from "@web/core/user";

export function themeToggleMenuItem(env) {
    const currentScheme = cookie.get("color_scheme") || "light";
    const isDark = currentScheme === "dark";
    const nextScheme = isDark ? "light" : "dark";
    const label = isDark ? _t("Switch to Light Mode") : _t("Switch to Dark Mode");
    const icon = isDark ? "fa-sun-o" : "fa-moon-o";

    return {
        type: "item",
        id: "theme_toggle",
        description: markup`
            <div class="d-flex align-items-center justify-content-between p-0 w-100">
                <span>${label}</span>
                <span class="fa ${icon} text-primary ms-2"></span>
            </div>`,
        callback: async () => {
            try {
                if (user.settings?.id) {
                    await env.services.orm.write("res.users.settings", [user.settings.id], {
                        color_scheme: nextScheme,
                    });
                }
            } catch (e) {
                // Ignore if settings write fails
            }
            cookie.set("color_scheme", nextScheme);
            browser.location.reload();
        },
        sequence: 45,
    };
}

registry.category("user_menuitems").add("theme_toggle", themeToggleMenuItem);

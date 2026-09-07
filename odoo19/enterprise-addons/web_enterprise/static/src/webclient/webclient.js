import { WebClient } from "@web/webclient/webclient";
import { useService } from "@web/core/utils/hooks";
import { EnterpriseNavBar } from "./navbar/navbar";

export class WebClientEnterprise extends WebClient {
    static components = {
        ...WebClient.components,
        NavBar: EnterpriseNavBar,
    };
    setup() {
        super.setup();
        this.hm = useService("home_menu");

        const titleService = this.env.services.title;
        if (titleService) {
            const origSetParts = titleService.setParts.bind(titleService);
            titleService.setParts = (parts) => {
                origSetParts(parts);
                if (document.title.endsWith("Odoo")) {
                    document.title = document.title.replace(/Odoo$/, "MoonWitness");
                }
            };
            if (document.title.includes("Odoo")) {
                document.title = document.title.replace(/Odoo/g, "MoonWitness");
            }
        }
    }
    _loadDefaultApp() {
        return this.hm.toggle(true);
    }
}

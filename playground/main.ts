import "reflect-metadata";
import "zone.js";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app.module";

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        const oldRootElem = document.querySelector("app");
        const newRootElem = document.createElement("app");
        oldRootElem!.parentNode!.insertBefore(newRootElem, oldRootElem);
        modulePromise.then((appModule) => appModule.destroy());
    });
}

const modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);

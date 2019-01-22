import {
    IChaincodeFactory,
    ICodeLoader,
} from "@prague/runtime-definitions";
import { exec } from "child_process";
import * as path from "path";
import { promisify } from "util";

const asyncExec = promisify(exec);
const npmRegistry = "https://packages.wu2.prague.office-int.com";

export class NodeCodeLoader implements ICodeLoader {
    public async load(pkg: string): Promise<IChaincodeFactory> {
        const components = pkg.match(/(.*)\/(.*)@(.*)/);
        if (!components) {
            return Promise.reject("Invalid package");
        }
        const [, scope, name] = components;

        const packagesBase = path.join(__dirname, "../packages");
        console.log(`Loading package...`);
        await asyncExec(`npm install ${pkg} --registry ${npmRegistry}`, { cwd: packagesBase });

        // tslint:disable:no-unsafe-any
        // tslint:disable-next-line:non-literal-require
        const entry = import(`${packagesBase}/node_modules/${scope}/${name}`);
        return entry;
    }
}

import Finances from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class FinancesSettingsTab extends PluginSettingTab {

    private constructor(app: App, plugin: Finances) {
        super(app, plugin);
    }

    static async build(plugin: Finances): Promise<FinancesSettingsTab> {
        return new Promise<FinancesSettingsTab>(async (resolve) => {
            resolve(new FinancesSettingsTab(plugin.app, plugin));
        });
    }

    display(): void {
        new Setting(this.containerEl)
            .setName("Database Path")
            .setDesc(`Relative path (from vault root) to the database file. Restart the app to apply changes.`)
            .addText((text) => {
                text.setValue(Finances.USERDATA.databasePath);
                text.setPlaceholder("Blank for default")
                text.onChange((value) => {
                    Finances.USERDATA.databasePath = value;
                })
            })
    }

    hide(): void {
        console.log("Saving settings...");
        Finances.USERDATA.save();
        super.hide();
        this.containerEl.empty();
    }

}

export class FinancesUserdata {

    private plugin: Finances;

    public readonly version: number = 1;
    public databasePath: string = "";

    private constructor(
        plugin: Finances,
        data: {
            version?: number,
            databasePath?: string,
        }) {
        this.plugin = plugin;
        if (data.version != undefined)
            this.version = data.version;
        if (data.databasePath != undefined)
            this.databasePath = data.databasePath;
    }

    static async init(plugin: Finances): Promise<FinancesUserdata> {
        const data = await plugin.loadData();
        const instance = new this(plugin,{
            version: data?.version,
            databasePath: data?.databasePath
        });
        if (data == null) instance.save();
        return instance;
    }

    save(): void {
        this.plugin.saveData({
            version: this.version,
            databasePath: this.databasePath
        });
    }

}
import initSqlJs from 'sql.js';
import { App, Plugin } from 'obsidian';
import { Model } from 'src/model/Model';
import { Controller } from 'src/module/Controller';

export default class Finances extends Plugin {

	static PLUGIN_APP: App;

	async onload() {

		Finances.PLUGIN_APP = this.app;

		const SQL = await initSqlJs({
			wasmBinary: await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-finances/sql-wasm.wasm")
		});

		const DB_FILE = (await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-finances/database.db"));

		Model.setSqlite(new SQL.Database(Buffer.from(DB_FILE)));

		this.addRibbonIcon('dollar-sign', 'Financial Tracker', async () => {
			Controller.openUi();
		});

	}
}
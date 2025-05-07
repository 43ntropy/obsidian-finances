import initSqlJs from 'sql.js';
import { App, Plugin } from 'obsidian';
import { Model } from 'src/model/Model';
import { Controller } from 'src/module/Controller';
import { arrayBuffer } from 'stream/consumers';

export default class Finances extends Plugin {

	static PLUGIN_APP: App;

	async onload() {

		Finances.PLUGIN_APP = this.app;

		const SQL = await initSqlJs({
			wasmBinary: await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-finances/sql-wasm.wasm")
		});

		const DB_FILE = (await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-finances/database.sqlite"));

		Model.setSqlite(new SQL.Database(Buffer.from(DB_FILE)));

		this.addRibbonIcon('dollar-sign', 'Financial Tracker', async () => {
			Controller.openUi();
		});

		this.addCommand({
			id: 'obisian-finances-open',
			name: 'Open Financial Tracker',
			icon: 'dollar-sign',
			callback: () => Controller.openUi()
		})

		Controller.onSave = async () => {
			console.log("Saving database...");
			await this.app.vault.adapter.writeBinary(this.app.vault.configDir + "/plugins/obsidian-finances/database.sqlite", Model.sqlite.export().buffer);
		}

	}
}
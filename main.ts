import initSqlJs from 'sql.js';
import { App, base64ToArrayBuffer, Plugin } from 'obsidian';
import { Model } from 'src/model/Model';
import { Controller } from 'src/module/Controller';
import { arrayBuffer } from 'stream/consumers';
import { sqliteBinary } from 'src/assets/sqlite';
import { wasmBinary } from 'src/assets/wasm';

export default class Finances extends Plugin {

	static PLUGIN_APP: App;

	async onload() {

		Finances.PLUGIN_APP = this.app;

		if (!await this.app.vault.adapter.exists(this.app.vault.configDir + "/plugins/obsidian-finances/database.sqlite")) {
			await this.app.vault.adapter.writeBinary(this.app.vault.configDir + "/plugins/obsidian-finances/database.sqlite", base64ToArrayBuffer(sqliteBinary));
		}

		if (!await this.app.vault.adapter.exists(this.app.vault.configDir + "/plugins/obsidian-finances/sql-wasm.wasm")) {
			await this.app.vault.adapter.writeBinary(this.app.vault.configDir + "/plugins/obsidian-finances/sql-wasm.wasm", base64ToArrayBuffer(wasmBinary));
		}

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
import initSqlJs from 'sql.js';
import { Plugin } from 'obsidian';
import { Model } from 'src/model/Model';

export default class FinancialTracker extends Plugin {

	async onload() {

		const SQL = await initSqlJs({
			wasmBinary: await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-financialtracker/sql-wasm.wasm")
		})

		const DB_FILE = (await this.app.vault.adapter.readBinary(this.app.vault.configDir + "/plugins/obsidian-financialtracker/database.db"));
		
		Model.setSqlite(new SQL.Database(Buffer.from(DB_FILE)));

	}
}
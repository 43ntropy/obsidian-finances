import initSqlJs from 'sql.js';
import { App, base64ToArrayBuffer, Plugin, PluginManifest } from 'obsidian';
import { Model } from 'src/model/Model';
import { Controller } from 'src/module/Controller';
import { sqliteBinary } from 'src/assets/sqlite';
import { FinancesSettingsTab, FinancesUserdata } from 'src/module/FinancesSettings';
import { BIN_SQLJS } from 'src/assets/sqljswasm';

export default class Finances extends Plugin {

	static APP: App;
	static MANIFEST: PluginManifest;
	static USERDATA: FinancesUserdata;

	async onload() {

		Finances.APP = this.app;
		Finances.MANIFEST = this.manifest;
		Finances.USERDATA = await FinancesUserdata.init(this);

		const PATH_DATABASE = Finances.USERDATA.databasePath == "" ?
			`${Finances.MANIFEST.dir!}/finances.sqlite` :
			`/${Finances.USERDATA.databasePath}/finances.sqlite`;

		const PATH_SQLWASM = `${Finances.MANIFEST.dir!}/sql-wasm.wasm`;

		if (!await this.app.vault.adapter.exists(PATH_DATABASE)) {
			await this.app.vault.adapter.writeBinary(PATH_DATABASE, base64ToArrayBuffer(sqliteBinary));
		}

		if (!await this.app.vault.adapter.exists(PATH_SQLWASM)) {
			await this.app.vault.adapter.writeBinary(PATH_SQLWASM, base64ToArrayBuffer(BIN_SQLJS.data));
		}

		const SQL = await initSqlJs({
			wasmBinary: await this.app.vault.adapter.readBinary(PATH_SQLWASM)
		});

		const DB_FILE = new Uint8Array(await this.app.vault.adapter.readBinary(PATH_DATABASE));

		Model.setSqlite(new SQL.Database(DB_FILE));

		this.addRibbonIcon('dollar-sign', 'Financial Tracker', async () => {
			Controller.openUi();
		});

		this.addCommand({
			id: 'obisian-finances-open',
			name: 'Open Financial Tracker',
			icon: 'dollar-sign',
			callback: () => Controller.openUi()
		})

		this.addSettingTab(await FinancesSettingsTab.build(this));

		Controller.onSave = async () => {
			console.log("Saving database...");
			await this.app.vault.adapter.writeBinary(PATH_DATABASE, Model.sqlite.export());
		}

	}

	async onloadInstaller() {

		// * SQLite WASM Intaller & Updater

		const SQLITE_WASM_ACTUAL_VERSION = (await this.app.vault.adapter.list(Finances.MANIFEST.dir!)).files.find((file) => /^sqlite-.*\.wasm$/.test(file));

		// If the file doesn't exist or the version is different
		if (`sqlite-${BIN_SQLJS.version}.wasm` != SQLITE_WASM_ACTUAL_VERSION) {

			// Delete the old file if it exists
			if (SQLITE_WASM_ACTUAL_VERSION)
				await this.app.vault.adapter.remove(`${Finances.MANIFEST.dir!}/${SQLITE_WASM_ACTUAL_VERSION}`);

			// Unpack the new file from base64
			const SQLITE_WASM = base64ToArrayBuffer(BIN_SQLJS.data);

			// Write the new file in the plugin folder
			await this.app.vault.adapter.writeBinary(`${Finances.MANIFEST.dir!}/sqlite-${BIN_SQLJS.version}.wasm`, SQLITE_WASM);

		}

	}
}
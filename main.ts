import { App, base64ToArrayBuffer, Plugin, PluginManifest } from 'obsidian';
import { Model } from 'src/model/Model';
import { Controller } from 'src/module/Controller';
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


		// * - SQLite WASM

		let SQLITE_WASM_VERSION = (await this.app.vault.adapter.list(Finances.MANIFEST.dir!)).files.find((file) => /^sqlite-.*\.wasm$/.test(file))

		// If the file doesn't exist or the version is different
		if (`sqlite-${BIN_SQLJS.version}.wasm` != SQLITE_WASM_VERSION) {

			// Delete the old file if it exists
			if (SQLITE_WASM_VERSION)
				await this.app.vault.adapter.remove(`${Finances.MANIFEST.dir!}/${SQLITE_WASM_VERSION}`);

			// Write the new binary in the plugin folder
			await this.app.vault.adapter.writeBinary(
				`${Finances.MANIFEST.dir!}/sqlite-${BIN_SQLJS.version}.wasm`,
				base64ToArrayBuffer(BIN_SQLJS.data)
			);

			// Update version
			SQLITE_WASM_VERSION = `sqlite-${BIN_SQLJS.version}.wasm`;

		}

		const SQLITE_WASM = await this.app.vault.adapter.readBinary(`${Finances.MANIFEST.dir!}/${SQLITE_WASM_VERSION}`);


		// * - SQLite Database

		const SQLITE_DB_PATH = Finances.USERDATA.databasePath == "" ?
			`${Finances.MANIFEST.dir!}/finances.sqlite` :
			`/${Finances.USERDATA.databasePath}/finances.sqlite`;

		const SQLITE_DB = await this.app.vault.adapter.exists(SQLITE_DB_PATH) ?
			new Uint8Array(await this.app.vault.adapter.readBinary(SQLITE_DB_PATH)) :
			undefined;


		// * - Model Initialization

		await Model.sqliteInit(SQLITE_WASM, SQLITE_DB);


		// * - Plugin Components

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

		// ! Temporary solution to save the database on close
		Controller.onSave = async () => {
			console.log("Saving database...");
			await this.app.vault.adapter.writeBinary(SQLITE_DB_PATH, Model.sqlite.export());
		}

	}

}
import Finances from "main";
import { Modal, Setting } from "obsidian";
import { ModelAccount } from "src/model/Account";

export class UiDashboard extends Modal {

    private quit: () => void;

    constructor(placeholder: {
        default_account: ModelAccount,
        transactions_total: number
    }, cb: {
        openAccounts: () => void,
        openTransactions: () => void,
        createTransaction: () => void,
        openPeople: () => void,
        openConsumers: () => void,
        quit: () => void
    }) {
        super(Finances.APP);
        this.setTitle(`💎 Finances`);

        // ! Workaround
        this.quit = cb.quit;
        // ! Workaround end

        new Setting(this.contentEl)

        new Setting(this.contentEl)
            .setHeading()
            .setName(`💳 Accounts`)
            .setDesc(`
                Default: 
                ${placeholder.default_account.name} 
                (${placeholder.default_account.balance}€)`
            )
            .addButton((open) => {
                open.setIcon(`credit-card`);
                open.onClick(() => {
                    cb.openAccounts();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            })

        new Setting(this.contentEl)
            .setHeading()
            .setName(`🧾 Transactions`)
            .setDesc(`Total: ${placeholder.transactions_total >= 0 ?
                `+${placeholder.transactions_total}` :
                `${placeholder.transactions_total}`}€`)
            .addButton((open) => {
                open.setIcon(`list`);
                open.onClick(() => {
                    cb.openTransactions();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            })

        new Setting(this.contentEl)
            .setHeading()
            .setName(`🛒 New Transaction`)
            .setDesc(`Create a new transaction`)
            .addButton((open) => {
                open.setIcon(`list-plus`);
                open.onClick(() => {
                    cb.createTransaction();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            })

        new Setting(this.contentEl)
            .setHeading()
            .setName(`👥 People`)
            .setDesc(`Manage your people`)
            .addButton((open) => {
                open.setIcon(`users`);
                open.onClick(() => {
                    cb.openPeople();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            });

        new Setting(this.contentEl)
            .setHeading()
            .setName(`🔖 Consumers`)
            .setDesc(`Manage your consumers`)
            .addButton((open) => {
                open.setIcon(`tag`);
                open.onClick(() => {
                    cb.openConsumers();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            });

        this.open();

    }

    // ! Workaround to distinguish between close and cancel from controller
    onClose(): void {
        this.quit();
    }

}
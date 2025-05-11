import Finances from "main";
import { Modal, Setting } from "obsidian";
import { ModelAccount } from "src/model/Account";
import { ModelConsumer } from "src/model/Consumer";
import { ModelPerson } from "src/model/Person";
import { ModelWorld } from "src/model/World";
import { ControllerState } from "src/module/ControllerUiState";
import { zenParseMoney } from "src/module/Utils";

export async function viewNewTransaction(cb: {
    getAccount: (id: number) => ModelAccount,
    getAccounts: () => ModelAccount[],
    getPerson: (id: number) => ModelPerson,
    getPeople: () => ModelPerson[],
    getConsumer: (id: number) => ModelConsumer,
    getConsumers: (sub?: number) => ModelConsumer[],
    onSubmit: (sender: ModelAccount | ModelPerson | ModelWorld,
        receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld,
        amount: number,
        description: string,
        timestamp: Date) => ControllerState;
    onCancel: () => ControllerState;
    onClose: () => ControllerState;
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        const modal = new Modal_NewTransaction({
            getAccount: cb.getAccount,
            getAccounts: cb.getAccounts,
            getPerson: cb.getPerson,
            getPeople: cb.getPeople,
            getConsumer: cb.getConsumer,
            getConsumers: cb.getConsumers,
        });

        modal.onSubmit = (sender, receiver, amount, description, timestamp) => {
            modal.onClose = () => { };
            resolve(cb.onSubmit(sender, receiver, amount, description, timestamp))
            modal.close();
        }

        modal.onCancel = () => {
            modal.onClose = () => { };
            resolve(cb.onCancel());
            modal.close();
        }

        modal.onClose = () => {
            resolve(cb.onClose());
        }

        modal.open();
    });
}


export class Modal_NewTransaction extends Modal {

    private sender: ModelAccount | ModelPerson | ModelWorld | undefined;
    private receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld | undefined;
    private description: string | undefined;
    private amount: string;
    private timestamp: Date = new Date(Date.now());

    constructor(cb: {
        getAccount: (id: number) => ModelAccount,
        getAccounts: () => ModelAccount[],
        getPerson: (id: number) => ModelPerson,
        getPeople: () => ModelPerson[],
        getConsumer: (id: number) => ModelConsumer,
        getConsumers: (sub?: number) => ModelConsumer[],
    }) {
        super(Finances.APP);
        this.setTitle("New Transaction");

        /* SENDER */
        const sender = new Setting(this.contentEl);

        const sender_pick = () => {
            sender
                .clear()
                .setName("Sender")
                .setDesc("Select the sender type")
                .addDropdown((dropdown) => {
                    dropdown.addOption("null", "");
                    dropdown.addOption("a", "Accounts");
                    dropdown.addOption("p", "People");
                    dropdown.addOption("w", "World");
                    dropdown.onChange((value) => {
                        if (value == "a") sender_pick_account();
                        else if (value == "p") sender_pick_person();
                        else if (value == "w") {
                            this.sender = new ModelWorld;
                            sender.setName(`Sender: World`);
                        }
                        else sender_pick();
                    });
                });
        }

        const sender_pick_account = () => {
            sender
                .clear()
                .setName("Sender")
                .setDesc("Select the sender account")
                .addDropdown((dropdown) => {
                    dropdown.addOption("null", "");
                    cb.getAccounts().forEach((account) => {
                        dropdown.addOption(account.id.toString(), account.name);
                    });
                    dropdown.addOption("back", "🔙 Back");
                    dropdown.onChange((value) => {
                        if (value == "back") sender_pick();
                        else if (value == "null") return;
                        else {
                            this.sender = cb.getAccount(parseInt(value));
                            sender.setName(`Sender: ${(this.sender as ModelAccount).name}`);
                        }
                    });
                });
        }

        const sender_pick_person = () => {
            sender
                .clear()
                .setName("Sender")
                .setDesc("Select the sender person")
                .addDropdown((dropdown) => {
                    dropdown.addOption("null", "");
                    cb.getPeople().forEach((person) => {
                        dropdown.addOption(person.id.toString(), person.name);
                    });
                    dropdown.addOption("back", "🔙 Back");
                    dropdown.onChange((value) => {
                        if (value == "back") sender_pick();
                        else if (value == "null") return;
                        else {
                            this.sender = cb.getPerson(parseInt(value));
                            sender.setName(`Sender: ${(this.sender as ModelPerson).name}`);
                        }
                    });
                });
        }

        sender_pick();

        /* RECEIVER */
        const receiver = new Setting(this.contentEl);

        const receiver_pick = () => {
            receiver
                .clear()
                .setName("Receiver")
                .setDesc("Select the receiver type")
                .addDropdown((dropdown) => {
                    dropdown.addOption("null", "");
                    dropdown.addOption("a", "Accounts");
                    dropdown.addOption("p", "People");
                    dropdown.addOption("c", "Consumers");
                    dropdown.addOption("w", "World");
                    dropdown.onChange((value) => {
                        if (value == "a") receiver_pick_account();
                        else if (value == "p") receiver_pick_person();
                        else if (value == "c") receiver_pick_consumer();
                        else if (value == "w") {
                            this.receiver = new ModelWorld;
                            receiver.setName(`Receiver: World`);
                        }
                        else receiver_pick();
                    });
                });
        }

        const receiver_pick_account = () => {
            receiver
                .clear()
                .setName("Receiver")
                .setDesc("Select the receiver account")
                .addDropdown((dropdown) => {
                    dropdown.addOption("null", "");
                    cb.getAccounts().forEach((account) => {
                        dropdown.addOption(account.id.toString(), account.name);
                    });
                    dropdown.addOption("back", "🔙 Back");
                    dropdown.onChange((value) => {
                        if (value == "back") receiver_pick();
                        else if (value == "null") return;
                        else {
                            this.receiver = cb.getAccount(parseInt(value));
                            receiver.setName(`Receiver: ${(this.receiver as ModelAccount).name}`);
                        }
                    });
                });
        }

        const receiver_pick_person = () => {
            receiver
                .clear()
                .setName("Receiver")
                .setDesc("Select the receiver person")
                .addDropdown((dropdown) => {
                    dropdown.addOption("null", "");
                    cb.getPeople().forEach((person) => {
                        dropdown.addOption(person.id.toString(), person.name);
                    });
                    dropdown.addOption("back", "🔙 Back");
                    dropdown.onChange((value) => {
                        if (value == "back") receiver_pick();
                        else if (value == "null") return;
                        else {
                            this.receiver = cb.getPerson(parseInt(value));
                            receiver.setName(`Receiver: ${(this.receiver as ModelPerson).name}`);
                        }
                    });
                });
        }

        const receiver_pick_consumer = () => {
            receiver
                .clear()
                .setName(this.receiver instanceof ModelConsumer ?
                    `Receiver: ${(this.receiver as ModelConsumer).name}` :
                    "Receiver"
                )
                .setDesc("Select the receiver consumer")
                .addDropdown((dropdown) => {
                    if (!(this.receiver instanceof ModelConsumer)) dropdown.addOption("null", "");
                    else {
                        dropdown.addOption((this.receiver as ModelConsumer).id.toString(), (this.receiver as ModelConsumer).name);
                        dropdown.addOption("null", "");
                    }
                    cb.getConsumers(
                        this.receiver instanceof ModelConsumer ?
                            (this.receiver as ModelConsumer).id : undefined
                    ).forEach((consumer) => {
                        dropdown.addOption(consumer.id.toString(), consumer.name);
                    });
                    dropdown.addOption("back", "🔙 Back");
                    dropdown.onChange((value) => {
                        if (value == "back") {
                            if (this.receiver instanceof ModelConsumer && (this.receiver as ModelConsumer).parent != null) {
                                this.receiver = cb.getConsumer((this.receiver as ModelConsumer).parent!.id);
                                receiver_pick_consumer();
                            }
                            else {
                                if (this.receiver instanceof ModelConsumer) {
                                    this.receiver = undefined;
                                    receiver_pick_consumer();
                                }
                                else receiver_pick();
                            }
                        }
                        else if (value == "null") return;
                        else {
                            this.receiver = cb.getConsumer(parseInt(value));
                            receiver_pick_consumer();
                        }
                    });
                })
        }

        receiver_pick();

        /* DESCRIPTION */
        new Setting(this.contentEl)
            .setName("Description")
            .setDesc("Enter the description of the transaction")
            .addText((text) => {
                text.onChange((value) => {
                    this.description = value;
                })
            })

        /* AMOUNT */

        const amount = new Setting(this.contentEl)
            .setName(`Amount: ${zenParseMoney(this.amount) ?? "Invalid"}`)
            .setDesc("Enter the amount of the transaction")
            .addText((text) => {
                text.onChange((value) => {
                    this.amount = value;
                    amount.setName(`Amount: ${zenParseMoney(this.amount) ?? "Invalid"}`);
                })
            })

        /* DATE TIME */

        const time = new Setting(this.contentEl)
            .setName(`Time: ${this.timestamp.getHours()}:${this.timestamp.getMinutes()}`)
            .setDesc("Enter the time of the transaction")
            .addButton((btn) => {
                btn.setButtonText('+h');
                btn.onClick(() => {
                    this.timestamp.setHours(this.timestamp.getHours() + 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('+min');
                btn.onClick(() => {
                    this.timestamp.setMinutes(this.timestamp.getMinutes() + 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('-min');
                btn.onClick(() => {
                    this.timestamp.setMinutes(this.timestamp.getMinutes() - 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('-h');
                btn.onClick(() => {
                    this.timestamp.setHours(this.timestamp.getHours() - 1);
                    updateDatetime();
                })
            })

        const date = new Setting(this.contentEl)
            .setName(`Date: ${this.timestamp.getDate()}/${this.timestamp.getMonth() + 1}/${this.timestamp.getFullYear()}`)
            .setDesc("Enter the date of the transaction")
            .addButton((btn) => {
                btn.setButtonText('+y');
                btn.onClick(() => {
                    this.timestamp.setFullYear(this.timestamp.getFullYear() + 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('+m');
                btn.onClick(() => {
                    this.timestamp.setMonth(this.timestamp.getMonth() + 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('+d');
                btn.onClick(() => {
                    this.timestamp.setDate(this.timestamp.getDate() + 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('-d');
                btn.onClick(() => {
                    this.timestamp.setDate(this.timestamp.getDate() - 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('-m');
                btn.onClick(() => {
                    this.timestamp.setMonth(this.timestamp.getMonth() - 1);
                    updateDatetime();
                })
            })
            .addButton((btn) => {
                btn.setButtonText('-y');
                btn.onClick(() => {
                    this.timestamp.setFullYear(this.timestamp.getFullYear() - 1);
                    updateDatetime();
                })
            })

        const updateDatetime = () => {
            time.setName(`Time: ${this.timestamp.getHours()}:${this.timestamp.getMinutes()}`);
            date.setName(`Date: ${this.timestamp.getDate()}/${this.timestamp.getMonth() + 1}/${this.timestamp.getFullYear()}`);
        };

        new Setting(this.contentEl)
            .addButton((btn) => {
                btn.setIcon('cross');
                btn.onClick(() => {
                    this.onCancel();
                });
            })
            .addButton((btn) => {
                btn.setCta();
                btn.setIcon('checkmark');
                btn.onClick(() => {
                    this.onSubmit(this.sender!, this.receiver!, zenParseMoney(this.amount), this.description!, this.timestamp);
                });
            });

    }

    onSubmit: (sender: ModelAccount | ModelPerson | ModelWorld,
        receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld,
        amount: number,
        description: string,
        timestamp: Date) => void;
    onCancel: () => void;
}
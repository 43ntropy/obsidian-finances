import Finances from "main";
import { Modal, Setting } from "obsidian";
import { ModelPerson } from "src/model/Person";

export class UiPerson extends Modal {

    private quit: () => void;
    
    constructor(placeholder: {
        person: ModelPerson
    }, cb: {
        rename: () => void,
        delete: () => void,
        back: () => void,
        quit: () => void
    }) {
        super(Finances.APP);
        this.setTitle(`👤 ${placeholder.person.name}`);

        // ! Workaround
        this.quit = cb.quit;
        // ! Workaround end

        new Setting(this.contentEl)
            .setHeading()
            .setName(`◼️ ${placeholder.person.balance <= 0 ?
                    "You owe them:" :
                    "They owe you:"
                } ${Math.abs(placeholder.person.balance)}€`)
            .setDesc(`◼️ Remission: ${placeholder.person.remission}€`)
            .addButton((renameButton) => {
                renameButton.setIcon('pencil');
                renameButton.onClick(() => {
                    cb.rename();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            })
            .addButton((deleteButton) => {
                deleteButton.setIcon('trash');
                deleteButton.setWarning();
                deleteButton.onClick(() => {
                    cb.delete();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            })

        new Setting(this.contentEl)
            .addButton((backButton) => {
                backButton.setIcon('left-arrow');
                backButton.setCta();
                backButton.onClick(() => {
                    cb.back();
                    // ! Workaround 
                    this.onClose = () => { };
                    // ! Workaround end
                    this.close();
                });
            })
            .settingEl.style.borderTop = "none";

        this.open();
    }

    // ! Workaround to distinguish between close and cancel from controller
    onClose(): void {
        this.quit();
    }

}
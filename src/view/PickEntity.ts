import { ModelAccount } from "src/model/Account";
import { ModelConsumer } from "src/model/Consumer";
import { ModelPerson } from "src/model/Person";
import { ModelWorld } from "src/model/World";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal, SelectionModalData } from "src/module/ModalSelection";
import { viewAccounts } from "./Accounts";

export async function viewPickEntity(placeholders: {
    title: string,
    accounts?: boolean,
    people?: boolean,
    consumers?: boolean,
    world?: boolean,
}): Promise<ControllerState> {
    if (placeholders.accounts == undefined) placeholders.accounts = true;
    if (placeholders.people == undefined) placeholders.people = true;
    if (placeholders.consumers == undefined) placeholders.consumers = true;
    if (placeholders.world == undefined) placeholders.world = true;
    return new Promise((resolve) => {
        do createSelectionModal(`${placeholders.title}`,
            [
                ...(placeholders.accounts ? [
                    {
                        text: `💳 Accounts`,
                        value: {
                            action: ControllerAction.OPEN_ACCOUNTS,
                        }
                    }
                ] as SelectionModalData[] : []),
                ...(placeholders.people ? [
                    {
                        text: `👤 People`,
                        value: {
                            action: ControllerAction.OPEN_PEOPLE,
                        }
                    }
                ] as SelectionModalData[] : []),
                ...(placeholders.consumers ? [
                    {
                        text: `🏷️ Consumers`,
                        value: {
                            action: ControllerAction.OPEN_CONSUMERS,
                        }
                    }
                ] as SelectionModalData[] : []),
                ...(placeholders.world ? [
                    {
                        text: `🌍 World`,
                        value: {
                            action: ControllerAction.PICK_ENTITY_WORLD,
                        }
                    }
                ] as SelectionModalData[] : []),
                {
                    text: ` `,
                    value: {
                        action: ControllerAction.PICK_ENTITY
                    }
                },
                {
                    text: `🔙 Back`,
                    value: {
                        action: ControllerAction.CREATE_TRANSACTION,
                    }
                }
            ],
            (item) => resolve(item),
            () => resolve({ action: ControllerAction.CLOSE }),
        ); while (true)
    });
}
import { ModelAccount } from "src/model/Account";
import { ModelConsumer } from "src/model/Consumer";
import { ModelPerson } from "src/model/Person";
import { ModelWorld } from "src/model/World";
import { ControllerAction, ControllerState } from "src/module/ControllerUiState";
import { createSelectionModal } from "src/module/ModalSelection";

export async function viewNewTransaction(placeholders: {
    sender: ModelAccount | ModelPerson | ModelWorld,
    receiver: ModelAccount | ModelPerson | ModelConsumer | ModelWorld,
    amount: number,
    description: string,
    timestamp: Date,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createSelectionModal(`💰 New Transaction`,
            [
                {
                    text: `📤 Sender`,
                    value: {
                        action: ControllerAction.PICK_ENTITY,
                        action_data: {
                            sender: placeholders.sender,
                            reciver: placeholders.receiver,
                            amount: placeholders.amount,
                            description: placeholders.description,
                            timestamp: placeholders.timestamp,
                        }
                    }
                },
                /*{
                    text: `📥 Receiver`
                },
                {
                    text: `💵 Amount`
                },
                {
                    text: `📝 Description`
                },
                {
                    text: `📅 Timestamp`
                }*/
            ],
            (item) => resolve(item),
            () => resolve({action: ControllerAction.CLOSE}),
        );
    });
}
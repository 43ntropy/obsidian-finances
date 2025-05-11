import { ModelConsumer } from "src/model/Consumer";
import { ControllerState } from "src/module/ControllerUiState";
import { createTextModal } from "src/module/ModalText";

export async function viewEditConsumerName(placeholder: {
    consumer: ModelConsumer
}, cb: {
    submit: (fields: { [key: string]: string }) => ControllerState,
    cancel: () => ControllerState,
    close: () => ControllerState,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createTextModal(`✏️ Renaming ${placeholder.consumer.name}...`,
            [
                {
                    key: `name`,
                    name: `New consumer's name?`,
                },
            ],
            (fields) => resolve(cb.submit(fields)),
            () => resolve(cb.cancel()),
            () => resolve(cb.close())
        )
    });
}
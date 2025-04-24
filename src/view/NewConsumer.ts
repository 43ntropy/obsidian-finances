import { ControllerState } from "src/module/ControllerUiState";
import { createTextModal } from "src/module/ModalText";

export async function viewNewConsumer(cb: {
    submit: (fields: { [key: string]: string }) => ControllerState,
    cancel: () => ControllerState,
    close: () => ControllerState,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createTextModal(`🏷️ New Consumer`,
            [
                {
                    key: `name`,
                    name: `Name`,
                },
            ],
            (fields) => resolve(cb.submit(fields)),
            () => resolve(cb.cancel()),
            () => resolve(cb.close()),
        );
    });
}
import { ControllerState } from "src/module/ControllerUiState";
import { createTextModal } from "src/module/ModalText";

export async function viewNewAccount(cb: {
    submit: (fields: { [key: string]: string }) => ControllerState,
    cancel: () => ControllerState,
    close: () => ControllerState,
}): Promise<ControllerState> {
    return new Promise((resolve) => {
        createTextModal(`💳 New Account`,
            [
                {
                    key: `name`,
                    name: `Name`,
                },
                {
                    key: `balance`,
                    name: `Starting Balance`,
                }
            ],
            (fields) => resolve(cb.submit(fields)),
            () => resolve(cb.cancel()),
            () => resolve(cb.close()),
        );
    });
}
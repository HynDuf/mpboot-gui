import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../../common/ipc';
import type { Parameter } from '../../../common/parameter';
import { convertParameterToCommandArgs } from '../../../common/parameter';
import { logger } from '../../../common/logger';
import { randomUUID } from 'crypto';
import type { CommandCallbackOnFinishResult, CommandExecuteResult } from '../../../common/commander';
import { MPBootCommander } from '../entity/mpboot-commander';


ipcMain.handle(IPC_EVENTS.COMMAND_EXECUTE, async (event, param: Parameter) : Promise<CommandExecuteResult> => {
    logger.log('Received COMMAND_EXECUTE', { param });
    const args = convertParameterToCommandArgs(param);
    const commandId = randomUUID();
    const command = new MPBootCommander('/Users/aqaurius6666/Downloads/build/mpboot', args, {
    });
    const result = await command.execute(() => {
        const data : CommandCallbackOnFinishResult = {
            treeFile: command.generatedTreeFilePath,
        };
        event.sender.send(IPC_EVENTS.COMMAND_CALLBACK_ON_FINISH(commandId), data);
    });
    return {
        logFile: result.logFile,
        commandId,
    };
});

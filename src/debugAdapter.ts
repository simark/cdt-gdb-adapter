/*********************************************************************
 * Copyright (c) 2018 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import * as yargs from 'yargs';
import { GDBDebugSession } from './GDBDebugSession';
import { configureLogger, createLogger } from './logging';

yargs.strict()
    .option('log-file', {
        describe: 'Log communications (DAP and MI) to the specified file',
        type: 'string',
    })
    .option('log-verbose', {
        describe: 'Increase logging verbosity (only relevant if --log-file is used)',
        type: 'boolean',
        default: false,
    });

const args = yargs.parse();
const logger = createLogger();

if (args.logFile) {
    configureLogger(logger, args.logFile, args.logVerbose);
}

const session = new GDBDebugSession(logger);

process.on('SIGTERM', () => {
    logger.info('Caught SIGTERM');
    session.shutdown();
});

process.on('uncaughtException', (err: any) => {
    logger.error(JSON.stringify(err));
});

session.start(process.stdin, process.stdout);

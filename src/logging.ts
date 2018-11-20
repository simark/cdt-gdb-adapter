/*********************************************************************
 * Copyright (c) 2018 Ericsson and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

import * as winston from 'winston';
import * as Transport from 'winston-transport';

/**
 * A Winston logger for when we actually don't want to log.
 */
class DevNullTransport extends Transport {
    public log?(info: any, next: () => void): any {
        next();
    }
}

/**
 * Create a default logger for the application.
 */
export function createLogger(): winston.Logger {
    return winston.createLogger({
        transports: [new DevNullTransport()]
    });
}

/**
 *  Change the log level of logger (and all its transports) to be verbose.
 */
export function configureLogger(logger: winston.Logger, logFile: string, logVerbose: boolean) {
    logger.configure({
        level: logVerbose ? 'verbose' : 'info',
        transports: [new winston.transports.File({
            level: logVerbose ? 'verbose' : 'info',
            filename: logFile,
            format: winston.format.cli(),
            options: { flags: 'w' },
        })],
    });
}

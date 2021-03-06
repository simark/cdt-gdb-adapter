/*********************************************************************
 * Copyright (c) 2018 Ericsson and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

import { GDBBackend } from '../GDBBackend';

interface MIDataReadMemoryBytesResponse {
    memory: Array<{
        begin: number;
        end: number;
        offset: number;
        contents: string;
    }>;
}

export function sendDataReadMemoryBytes(gdb: GDBBackend, address: number, size: number)
    : Promise<MIDataReadMemoryBytesResponse> {
    const command = `-data-read-memory-bytes 0x${address.toString(16)} ${size}`;
    return gdb.sendCommand(command);
}

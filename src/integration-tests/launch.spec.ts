/*********************************************************************
 * Copyright (c) 2018 Ericsson and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

import { expect } from 'chai';
import * as path from 'path';
import { DebugClient } from 'vscode-debugadapter-testsupport';
import { getExecPath } from '..';

// Allow non-arrow functions: https://mochajs.org/#arrow-functions
// tslint:disable:only-arrow-functions

let dc: DebugClient;
const emptyProgram = path.join(__dirname, '..', '..', 'src', 'integration-tests', 'test-programs', 'empty');

before(function() {
    let args: string = `${getExecPath()} --log-file gdb-debug.log --log-verbose`;
    if (process.env.INSPECT_DEBUG_ADAPTER) {
        args = '--inspect-brk ' + args;
    }

    dc = new DebugClient('node', args, 'cppdbg', {
        shell: true,
    });
    dc.start();
    dc.initializeRequest();
});

after(function() {
    dc.stop();
});

function ExpectRejectedPromise<T>(p: Promise<T>) {
    return new Promise((resolve, reject) => {
        p.then(reject).catch((error) => {
            resolve(error);
        });
    });
}

describe('launch', function() {
    // Move the timeout out of the way if the adapter is going to be debugged.
    if (process.env.INSPECT_DEBUG_ADAPTER) {
        this.timeout(9999999);
    }

    it('can launch and hit a breakpoint', async function() {
        await dc.launchRequest({
            program: emptyProgram,
        } as any);

        await dc.setBreakpointsRequest({
            source: { path: 'empty.c' },
            breakpoints: [{
                line: 3,
            }],
        });
        await dc.configurationDoneRequest({});
        await dc.assertStoppedLocation('breakpoint', {});
    });

    it('reports breakpoint set errors', async function() {
        await dc.launchRequest({
            verbose: true,
            program: emptyProgram,
        } as any);

        const errorMessage = await ExpectRejectedPromise(dc.setBreakpointsRequest({
            source: { path: 'prout.c' },
            breakpoints: [{
                line: 3,
            }],
        })) as any;

        expect(errorMessage.message).eq('No source file named prout.c.');
    });
});

import {
    urlEncode,
    showMsg,
    hideMsg,
    getQueryParameter,
    API2Request,
    getTerminalSettings,
    severities
} from './utils'
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"
import '@xterm/xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';

function StartConsole() {


    const { service_group_id } = useParams();
    const [queryStatus, setData] = useState(null);
    var states = {
        start: 1,
        connecting: 2,
        connected: 3,
        disconnecting: 4,
        disconnected: 5,
        reconnecting: 6,
    };
    var term,
        protocol,
        socketURL,
        socket,
        ticket,
        resize,
        ping,
        state = states.start,
        starttime = new Date();
    useEffect(() => {
        let type = 'kvm'
        const terminalContainer = document.getElementById('terminal-container');
        document.getElementById('status_bar').addEventListener('click', hideMsg);
        document.getElementById('connect_btn').addEventListener('click', startGuest);
        const fitAddon = new FitAddon();

        createTerminal();

        function updateState(newState, msg, code) {
            var timeout, severity, message;
            switch (newState) {
                case states.connecting:
                    message = "Connecting...";
                    timeout = 0;
                    severity = severities.warning;
                    break;
                case states.connected:
                    window.onbeforeunload = windowUnload;
                    message = "Connected";
                    break;
                case states.disconnecting:
                    window.onbeforeunload = undefined;
                    message = "Disconnecting...";
                    timeout = 0;
                    severity = severities.warning;
                    break;
                case states.reconnecting:
                    window.onbeforeunload = undefined;
                    message = "Reconnecting...";
                    timeout = 0;
                    severity = severities.warning;
                    break;
                case states.disconnected:
                    window.onbeforeunload = undefined;
                    switch (state) {
                        case states.start:
                        case states.connecting:
                        case states.reconnecting:
                            message = "Connection failed";
                            timeout = 0;
                            severity = severities.error;
                            break;
                        case states.connected:
                        case states.disconnecting:
                            var time_since_started = new Date() - starttime;
                            timeout = 5000;
                            if (time_since_started > 5 * 1000 || type === 'shell') {
                                message = "Connection closed";
                            } else {
                                message = "Connection failed";
                                severity = severities.error;
                            }
                            break;
                        case states.disconnected:
                            // no state change
                            break;
                        default:
                            throw "unknown state";
                    }
                    break;
                default:
                    throw "unknown state";
            }
            let msgArr = [];
            if (msg) {
                msgArr.push(msg);
            }
            if (code !== undefined) {
                msgArr.push(`Code: ${code}`);
            }
            if (msgArr.length > 0) {
                message += ` (${msgArr.join(', ')})`;
            }
            state = newState;
            showMsg(message, timeout, severity);
        }



        function startConnection(url, params, term) {

            API2Request({
                method: 'GET',
                params: params,
                url: `https://dev.iqdata.cloud/api/v1/proxmox/vms/${service_group_id}/console`,
                success: function (result) {
                    var port = encodeURIComponent(result.data.port);
                    ticket = result.data.ticket;
                    socketURL = `${protocol}dev.iqdata.cloud/api/v1/proxmox/vms/${service_group_id}/console/ws`;
                    // socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/api2/json' + url + '/vncwebsocket?port=' + port + '&vncticket=' + encodeURIComponent(ticket);

                    socket = new WebSocket(socketURL, 'binary');

                    socket.binaryType = 'arraybuffer';
                    socket.onopen = runTerminal;
                    socket.onclose = tryReconnect;
                    socket.onerror = tryReconnect;
                    updateState(states.connecting);
                    document.addEventListener('beforeonunload', () => { socket.close() });
                },
                failure: function (msg) {
                    console.log(msg)
                    updateState(states.disconnected, msg);
                }
            });
        }



        function startGuest() {

            API2Request({
                method: 'POST',
                url: `https://dev.iqdata.cloud/api/v1/proxmox/vms/${service_group_id}/start`,
                success: function (result) {
                    showMsg('Guest started successfully', 0);
                    // setTimeout(function () {
                    //     location.reload();
                    // }, 1000);
                },
                failure: function (msg) {
                    if (msg.match(/already running/)) {
                        showMsg('Guest started successfully', 0);
                        // setTimeout(function () {
                        //     location.reload();
                        // }, 1000);
                    } else {
                        console.log(msg)
                        updateState(states.disconnected, msg);
                    }
                }
            });
        }



        function createTerminal() {
            term = new Terminal(getTerminalSettings());

            term.open(terminalContainer);
            term.loadAddon(fitAddon);
            // let loadedWebgl = false;
            // try {
            //     if (detectWebgl()) {
            //         const webglAddon = new WebglAddon();
            //         term.loadAddon(webglAddon);
            //         loadedWebgl = true;
            //     }
            // } catch (_e) { }

            // if (!loadedWebgl) {
            //     console.warn("webgl-addon loading failed, falling back to regular dom renderer");
            // }

            term.onResize(function (size) {
                if (state === states.connected) {
                    socket.send("1:" + size.cols + ":" + size.rows + ":");
                }
            });
            console.log(term)
            protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';

            let params = {};
            const urlStatus = `https://dev.iqdata.cloud/api/v1/proxmox/vms/${service_group_id}/status`;
            if (type === 'kvm' || type === 'lxc') {
                API2Request({
                    method: 'GET',
                    url: urlStatus,
                    success: function (result) {

                        if (result.status === 'running') {
                            startConnection(urlStatus, params, term);
                        } else {
                            document.getElementById('connect_dlg').classList.add('pve_open');
                        }
                    },
                    failure: function (msg) {

                        updateState(states.disconnected, msg);
                    },
                });

            } else {
                startConnection(url, params, term);
            }

        }

        function runTerminal() {
            socket.onmessage = function (event) {

                let answer = new Uint8Array(event.data);

                if (state === states.connected) {
                    term.write(answer);
                } else if (state === states.connecting) {
                    if (answer[0] === 79 && answer[1] === 75) { // "OK"
                        updateState(states.connected);
                        term.write(answer.slice(2));
                    } else {
                        socket.close();
                    }
                }
            };

            term.onData(function (data) {
                if (state === states.connected) {
                    socket.send("0:" + decodeURIComponent(encodeURIComponent(data)).length.toString() + ":" + data);
                }
            });

            ping = setInterval(function () {
                socket.send("2");
            }, 30 * 1000);

            window.addEventListener('resize', function () {
                clearTimeout(resize);
                resize = setTimeout(function () {
                    // done resizing
                    fitAddon.fit();
                }, 250);
            });
            // initial focus and resize
            setTimeout(function () {
                term.focus();
                fitAddon.fit();
            }, 250);
        }

        function windowUnload(e) {
            let message = "Are you sure you want to leave this page?";

            e = e || window.event;
            if (e) {
                e.returnValue = message;
            }

            return message;
        }

        function tryReconnect(event) {
            var time_since_started = new Date() - starttime;
            var type = 'kvm';
            if (time_since_started < 5 * 1000) { // 5 seconds
                stopTerminal(event);
                return;
            }

            updateState(states.disconnecting, '');
        }
        function stopTerminal(event) {
            event = event || {};
            clearEvents();
            clearInterval(ping);
            socket.close();

            updateState(states.disconnected, event.reason, event.code);
        }
        function clearEvents() {
            term.onResize(() => { });
            term.onData(() => { });
        }
    }, []);

    return (
        <>
            <div id="wrap">
                <div className="center">
                    <div id="connect_dlg">
                        <div id="pve_start_info">Guest not running</div>
                        <div id="connect_btn"><div> Start Now </div></div>
                    </div>
                </div>
                <div id="terminal-container">
                    <div id="status_bar"></div>

                </div>
            </div>
        </>
    )
}

export { StartConsole }
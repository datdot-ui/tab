const bel = require('bel')
const csjs = require('csjs-inject')
const path = require('path')
const filename = path.basename(__filename)
const domlog = require('ui-domlog')
const tab = require('..')

function demoComponent() {
    let recipients = []
    const obj = {data: [], schedule: '', location: '', peformance: '', swam: { key: '', feeds: [1,2,3,4,5]}}
    const tabList = tab({page: 'PLANS', name: 'tab', flow: 'demo-ui', arr: Object.keys(obj)}, tabProtocol('demo-tab'))
    // content
    const content = bel`
    <div class=${css.content}>
        <h1>Tab</h1>
        ${tabList}
    </div>`
    // show logs
    let terminal = bel`<div class=${css.terminal}></div>`
    // container
    const container = wrap(content, terminal)
    return container

    function wrap (content) {
        const container = bel`
        <div class=${css.wrap}>
            <section class=${css.container}>
                ${content}
            </section>
            ${terminal}
        </div>
        `
        return container
    }

    /*************************
    * ------ Receivers -------
    *************************/
    function receive (message) {
        const {page, from, flow, type, action, body} = message
        showLog(message)
        if (type === 'init') return showLog({page: 'demo', from, flow, type: 'ready', filename, line: 58})
    }

    /*************************
    * ------ Protocols -------
    *************************/
    function tabProtocol(name) {
        return send => {
            recipients[name] = send
            return receive
        }
    }

    // keep the scroll on bottom when the log displayed on the terminal
    function showLog (message) { 
        sendMessage(message)
        .then( log => {
            terminal.append(log)
            terminal.scrollTop = terminal.scrollHeight
        }
    )}
    /*********************************
    * ------ Promise() Element -------
    *********************************/
    async function sendMessage (message) {
        return await new Promise( (resolve, reject) => {
            if (message === undefined) reject('no message import')
            const log = domlog(message)
            return resolve(log)
        }).catch( err => { throw new Error(err) } )
    }
}

const css = csjs`
html {
    box-sizing: border-box;
}
*, *::before, *::after {
    box-sizing: inherit;
}
body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    background-color: rgba(0, 0, 0, .1);
    height: 100%;
}
.wrap {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 75vh 25vh;
}
.container {
    padding: 25px;
    overflow-y: auto;
}
.container > div {
    margin-bottom: 20px;
}
.container > div button {
    margin-right: 10px;
}
.content {}
.terminal {
    background-color: #212121;
    color: #f2f2f2;
    font-size: 13px;
    overflow-y: auto;
}
`

document.body.append( demoComponent() )
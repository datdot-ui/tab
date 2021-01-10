const bel = require('bel')
const csjs = require('csjs-inject')
const path = require('path')
const filename = path.basename(__filename)
const button = require('datdot-ui-button')

module.exports = datdot_ui_tab

function datdot_ui_tab({page, name = 'tab', flow, arr}, protocol)  {
    const widget = 'ui-tab'
    const recipients = []
    const send2Parent = protocol( receive )
    const tabList = bel`<nav role="tablist" aria-tab="${name}" class=${css['ui-tab']}> </nav>`
    tabs(arr)
    send2Parent({page, from: name, flow: flow ? `${flow}/${widget}` : widget, type: 'init', filename, line: 15})
    return tabList

    // make tab
    function tabs (args) {
        return args.map( (item, index) => {
            const btn = button({page, flow: flow ? `${flow}/${widget}`: widget, name: item, content: item, style: 'tab', current: index === 0 ? true : false}, buttonProtocol(item))
            tabList.append(btn)
        })
    }

    /*************************
    * ------- Actions --------
    *************************/
    function actionSwitch(args, message) {
        const { page, from, flow, type, action, body } = message
        const classList = []
        args.forEach( (btn, i) => {
            const target = btn.getAttribute('name')
            classList.push( target )
            const type = target === from ? 'current-active' : 'remove-current'
            const name = target === from ? from : classList[i]
            const log = { page, from: name, flow, type}
            recipients[name](log)
            return send2Parent({...log, body, filename, line: 38})
        })
    }

    /*************************
    * ------ Receivers -------
    *************************/
    function receive (message) {
        const {page, from, flow, type, action, body} = message
    }

    /*************************
    * ------ Protocols -------
    *************************/
    function buttonProtocol (name) {
        return send => {
            recipients[name] = send
            return function btnReceive (message) {
                const {type} = message
                if (type === 'init') return send2Parent(message)
                if (type === 'click') return actionSwitch([...tabList.children], message)
            }
        }
    }

}

const css = csjs`
.ui-tab {}
.tab {
    color: #000000;
    background-color: #d9d9d9;
    padding: 15px;
    border: none;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    margin-right: 4px;
    /* outline: #d9d9d9 dotted 1px; */
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
}
.tab[class*="current"] {
    background-color: #fff;
}
`
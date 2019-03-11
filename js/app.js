
let editor; 

function initialContent(inInitContent)
{
    editor = new tui.Editor(
    {
        el: document.querySelector('#editor-intro'),
        previewStyle: 'vertical',
        height: zlGetEditorHeight(),
        initialEditType: 'wysiwyg',
        useCommandShortcut: true,
        initialValue: inInitContent,
        usageStatistics: false,
        exts: [
        {
            name: 'chart',
            minWidth: 100,
            maxWidth: 600,
            minHeight: 100,
            maxHeight: 300
        },
        'scrollSync',
        'colorSyntax',
        'uml',
        'mark',
        'table',
        'taskCounter'
        ]
    });
}

function zlGetEditorHeight()
{
    var body = document.body,
    html = document.documentElement;
    var docHeight = Math.max( body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight );
    
    const toolbarHeight = 20;//20 pixels reserved for font-awesome icons acting as toolbar

    docHeight = docHeight - toolbarHeight;

    return docHeight;

} 


// Listen to messages from parent window
bindEvent(window, 'message', hanleMsgFromParent);

function hanleMsgFromParent(msg) 
{
    switch (msg.data.aTopic) 
    {
        case 'testTopic':
        {
            const u8buf = new Uint8Array(msg.data.aBuf);
            const recvdString = u8BufToString(u8buf);
            console.log(`FromParent: MsgTopic: ${msg.data.aTopic} MsgString: ${recvdString}`);
            const childStr = "ChildAdded: " + recvdString;
            sendMsgToParent("echoMsg", childStr);
        }
        break;

        case 'initTui':
        {
            const u8buf = new Uint8Array(msg.data.aBuf);
            const recvdString = u8BufToString(u8buf);
            console.log(`FromParent: MsgTopic: ${msg.data.aTopic} MsgString: ${recvdString}`);
            initialContent(recvdString);
            //const childStr = "ChildAdded: " + recvdString;
            //sendMsgToParent("echoMsg", childStr);
        }
        break;

        case 'updateContent':
        {
            const u8buf = new Uint8Array(msg.data.aBuf);
            const recvdString = u8BufToString(u8buf);
            console.log(`FromParent: MsgTopic: ${msg.data.aTopic} MsgString: ${recvdString}`);
            updateContent(recvdString);
            //const childStr = "ChildAdded: " + recvdString;
            //sendMsgToParent("echoMsg", childStr);
        }
        break;

        default:
            throw 'no aTopic on incoming message to ChromeWorker';
    }
}

function bindEvent(element, eventName, eventHandler) 
{
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}

function getContent()
{

}

function sendMsgToParent(inMsgTopic, inMsgString)
{
    let u8BufFromStr = stringToU8Buffer(inMsgString);
    
    window.parent.postMessage(
    {
        aTopic: inMsgTopic,
        aBuf: u8BufFromStr.buffer,
    },
    [
        u8BufFromStr.buffer
    ]);
}


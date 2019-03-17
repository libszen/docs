
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

    //console.log("Editor: " + editor);
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
            const childStr = "ChildAdded: " + recvdString;
            sendMsgToParent("echoMsg", childStr);
        }
        break;

        case 'initTui':
        {
            const u8buf = new Uint8Array(msg.data.aBuf);
            const recvdString = u8BufToString(u8buf);
            initialContent(recvdString);
            
        }
        break;

        case 'updateContent':
        {
            const u8buf = new Uint8Array(msg.data.aBuf);
            const recvdString = u8BufToString(u8buf);
            updateContent(recvdString);
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

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
function getUrlParams(url)
{
	let params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
    }
    //console.log(JSON.stringify(params));
	return params;

}

function main()
{
    const params = getUrlParams(window.location.href);
    const welcomeMsg="# Welcome To ZenLibs! \nOpen a file by clicking on the folder icon, or edit & save this!";
    if(params.firstLoad==6)
    {
        initialContent(welcomeMsg);
        sendMsgToParent("firstLoadDone", "");
    }

}

function updateContent(recvdString)
{
    //console.log("Editor from updateContent: " + editor);
    if(editor!==null)
    {
        editor.setValue(recvdString, false);

    }
}


main();

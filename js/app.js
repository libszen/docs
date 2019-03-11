
initialContent();
var editor; 

function initialContent()
{
    fetch('../TinySeed.md')
    .then(function(response) 
    {
        return response.text();
    })
    .then(function(retText) 
    {
        editor = new tui.Editor(
        {
            el: document.querySelector('#editor-intro'),
            previewStyle: 'vertical',
            height: zlGetEditorHeight(),
            initialEditType: 'wysiwyg',
            useCommandShortcut: true,
            initialValue: retText,
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
bindEvent(window, 'message', function (e) 
{
    console.log("Rcvd in child: " + e.data);
    toParent();

});

function toParent() 
{
    const random = Math.random();
    sendMessage('FromChild: ' + random);
};

// Send a message to the parent
var sendMessage = function (msg) 
{
    // Make sure you are sending a string, and to stringify JSON
    window.parent.postMessage(msg, '*');
};

function bindEvent(element, eventName, eventHandler) 
{
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
    }
}

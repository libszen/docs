var fs = require('fs');
    fs.writeFile('/tmp/test.txt', 'Cool, I can do this in the browser!', 
    function(err) 
    {
        fs.readFile('/tmp/test.txt', function(err, contents) 
        {
            console.log(contents.toString());
        });
    });

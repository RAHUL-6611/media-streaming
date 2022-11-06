const app = require('express')();
const fs = require('fs');


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', function (req, res) {

    // simply manipulating the response as per our requirement
    //response is our our video but in buffer stream form 

    // ensure u are getting headers on every request      
    const range = req.headers.range;
    console.log(req.headers);
    if (!range){
        res.status(400).send("Requires Range headers");
    }
    const videoPath = "sema.mp4";
    const videoSize = fs.statSync(videoPath).size;
    const chunk = (10**6)/4;

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunk,videoSize-1);

    contentLength = Number((end - start)+1);

    const headers = {
        "Content-Length": contentLength,
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Type":"video/mp4",
    };
    //to denote sending partial content
    res.writeHead(206,headers);

    //creating a stream of buffers of following video 
    const videoStream = fs.createReadStream(videoPath, {start,end});
    // and sending it to the client using response
    videoStream.pipe(res);
})

app.listen(8000, function() {
    console.log("Listening on port 8000!");
})
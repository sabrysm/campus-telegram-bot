import {connect} from "ngrok"
import {json} from "body-parser"
import {createServer} from "http"
import axios from "axios";
import { handler as lambda } from "./functions/webhook";


const server = createServer((req:any, res) => {
    if (req.method === 'POST') {

        const handler = json()
        

        handler(req, res,(err) => {

            if (err) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Bad Request');
            }
            
            const testEvent = {
                body:JSON.stringify(req.body)
            }
            lambda(testEvent,{ } as any, (err:any, data:any) => {
                
            })
            res.end()
        })
    } else {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Method Not Allowed');
    }
});

// Listen for incoming requests on port 8000
server.listen(8000, () => {
    connect({addr: "http://localhost:8000",authtoken:"1gXyFVMhNuJvrTkUFiaIjeEw1ng_7FxnvpDRccvit4JkfszDQ"})
        .then((url) => {
            axios.post("https://api.telegram.org/bot6794617842:AAHxBVBwST5maK0jPrRbYmsHaWIb8EltrbY/setWebhook",{
                url, allowed_updates:["message_reaction","message", "callback_query"]
            }).then(() => {
                console.log("done")
            })
        })
});
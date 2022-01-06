var express = require("express");
var path = require("path");
// var routes =require("./routes");
var app = express();
app.set("port", process.env.PORT || 3000);
// 
// 
// 
// Provide the full path to the env file which you have previously stored securely.
let configFilePath = "./secure/BitPay.config.json";

const {Client, Env, Currency, Models, Tokens} = require('bitpay-sdk');

let client = new Client(configFilePath);

console.log(client);
///////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
const CreateInvoiceFunction = async()=>{
    let invoiceData = new Models.Invoice(50, Currency.USD);
    console.log(invoiceData);
    const result = await client.CreateInvoice(invoiceData,(err,invoice)=>{
         let invoiceUrl = invoice.url;
        console.log(invoiceUrl);
        let status = invoice.status;
        console.log(status);
        console.log(invoice);
       
    }).catch((err)=>{
        console.log(err);
    })
   
    
    
}
CreateInvoiceFunction();
///////////////////////////////////////////////////////////////////

app.listen(app.get("port"),function(){
    console.log("server started on port " + app.get("port"));
});
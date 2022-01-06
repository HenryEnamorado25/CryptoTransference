const express = require("express");
const path = require("path");
const Fetch = require("node-fetch");
var app = express();
require('dotenv').config();
//change this to (https://bitpay.com) when it is ready for production
const Environment = "https://test.bitpay.com";
// var routes =require("./routes");

app.set("port", process.env.PORT || 3000);


//Webhook to create a invoice
app.get('/createinvoice', async (req,res)=>{
    const hookUrl= `${Environment}/invoices`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json","X-Identity":`${process.env.SIN}`},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "currency": "USD",
            "price": 5,
            "token":`${process.env.MerchantAPITOKEN}`
        })
    }
    console.log(options);
    const response = await Fetch(hookUrl, options)
    
    .then((invoice)=>{
        console.log("***SUCCESS***");
        console.log(invoice);
        
        res.json(JSON.stringify(
            {
                status: "success",
                code: 200,
                url:{invoice}
            })
        )
    })
    .catch((error)=>{
        console.log("***ERROR***");
         res.json(JSON.stringify(
            {
                status: "fail",
                code: 201,
                error:error
            })
        )
    })
    console.log(response);
    
})
//webhook to get API tokens to get in use in invoices creation
app.get('/gettoken', async (req,res)=>{
    const hookUrl= `${Environment}/tokens`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "id": `${process.env.SIN}`,
            "facade": "merchant",
            "label": "test Investacard"
        }) 
    }
    console.log(options);
    console.log(process.env.SIN);
    const response = await Fetch(hookUrl, options)
    const json1 = await response.json();
    console.log(json1);
    process.env.AcquieredTOKEN= json1.data[0].token;
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json1.data[0].token
    }));

})

app.get('/getinvoicescreated', async (req,res)=>{
    const hookUrl= `${Environment}/tokens`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "id": `${process.env.SIN}`
        }) 
    }
    console.log(options);
    console.log(process.env.SIN);
    const response = await Fetch(hookUrl, options)
    .then((resp)=>{
        console.log("***SUCCESS777***");
        console.log(resp);
        
        res.json(JSON.stringify(
            {
                status: "success",
                code: 200,
                url:{resp}
            })
        )
    })
    .catch((err)=>{
        console.log("***ERROR888***");
         res.json(JSON.stringify(
            {
                status: "fail",
                code: 201,
                error:err
            })
        )
    })
})
app.listen(app.get("port"),function(){
    console.log("server started on port " + app.get("port"));
});
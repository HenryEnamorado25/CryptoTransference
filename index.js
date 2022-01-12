const express = require("express");
const path = require("path");
const Fetch = require("node-fetch");
const util = require('util')
var app = express();
require('dotenv').config();
var bitauth = require('bitauth');
//change this to (https://bitpay.com) when it is ready for production
const Environment = "https://test.bitpay.com";
let signature;
// var routes =require("./routes");
var crypto = require("crypto");
let pairingCode;
app.set("port", process.env.PORT || 3000);




//Webhook to create a invoice
app.get('/createinvoice', async (req,res)=>{
    
    const hookUrl= `${Environment}/invoices`;
    //this should be content from the body
    //this body variable have to be separate in order to work
    let body= {"currency":"USD","price":5,"token":`${process.env.MerchantAPITOKEN}`};
    let dataToSign = hookUrl+JSON.stringify(body);
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json","X-Identity":bitauth.getPublicKeyFromPrivateKey(process.env.privateKey)
        ,"X-Signature":bitauth.sign(dataToSign,process.env.privateKey).toString('hex')},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify({
            "currency":"USD",
            "price":5,
            "token":`${process.env.MerchantAPITOKEN}`
        })
    }
    console.log(options);
    const response = await Fetch(hookUrl, options)
    const json = await response.json();
    console.log(json);
    // console.log(process.env.AcquieredTOKEN);
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json
    }));  
})

app.get('/payoutrecipient', async (req,res)=>{
   
    const hookUrl= `${Environment}/payouts`;
    let body= {"currency":"USD","price":5,"token":`${process.env.MerchantAPITOKEN}`};
    let dataToSign = hookUrl+JSON.stringify(body);
    
    console.log(dataToSign);
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json","X-Identity":bitauth.getPublicKeyFromPrivateKey(process.env.privateKey)
        ,"X-Signature":bitauth.sign(dataToSign,process.env.privateKey).toString('hex')},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify({
            "currency":"USD",
            "amount":5,
            "instructions":[{
                "amount":5,
                "recipientId":""
            }],
            "effectiveDate":"2021-05-24",
            "token":`${process.env.MerchantAPITOKEN}`
        })
    }
    console.log(options);
    const response = await Fetch(hookUrl, options)
    const json = await response.json();
    console.log(json);
    // console.log(process.env.AcquieredTOKEN);
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json
    }));  
})



//webhook to get API tokens to get in use in invoices creation
app.get('/gettoken', async (req,res)=>{
    const hookUrl= `${Environment}/tokens`;
    // getKeysAndSign(`${hookUrl}{"id":'${process.env.SIN}',"facade":"merchant","label":"test Investacard"}`);
    // ,"X-Identity":`${process.env.publicKey}`,"X-Signature":`${signature}`
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "id":`${process.env.SIN}`,
            "facade":"payroll",
            "label":"test payroll Investacard"
        }) 
    }
    console.log(options);
    console.log(process.env.SIN);
    const response = await Fetch(hookUrl, options)
    const json = await response.json();
    console.log(json);
    process.env.AcquieredTOKEN= json.data[0].token;
     pairingCode =json.data[0].pairingCode;
    console.log(process.env.AcquieredTOKEN);
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json.data[0].token
    }));
})

app.get('/gettokenaccepted', async (req,res)=>{
    const hookUrl= `${Environment}/tokens`;
    // getKeysAndSign(`${hookUrl}true`);
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json","X-Identity":`${process.env.publicKey}`,"X-Signature":`${signature}`},
        "method": "GET",
        //I MAY NEED JSON.stringify()
        "json":true
    }
    console.log(options);
    // console.log(process.env.SIN);
    const response = await Fetch(hookUrl, options)
    const json = await response.json();

    console.log(json);
    // process.env.AcquieredTOKEN= json.data[0].token;
    // console.log(process.env.AcquieredTOKEN);
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json
    }));
})

app.get('/getinvoicescreated', async (req,res)=>{
    const hookUrl= `${Environment}/tokens`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "json":true
    }
    console.log(options);
    console.log(process.env.SIN);
    const response = await Fetch(hookUrl, options)
    const json = await response.json();
    console.log(json);
    // console.log(process.env.AcquieredTOKEN);
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json
    }));
    // 
})
//this only work the the "payroll" facade
app.get('/inviterecipient', async (req,res)=>{
    const hookUrl= `${Environment}/recipients`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "recipient":[{
                "email": "henryenamo@gmail.com"
            }],
            "token":`${process.env.PoSAPITOKEN}`
        })
    }
    console.log(options);
    console.log(process.env.MERCHANT_TOKEN);
    const response = await Fetch(hookUrl, options)
    const json = await response.json();
    console.log(json);
    // console.log(process.env.AcquieredTOKEN);
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json
    }));
    // 
})
app.get('/retrievetokenapproved', async (req,res)=>{
    const hookUrl= `${Environment}/tokens`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "recipient":[{
                "email": "henryenamo@gmail.com"
            }],
            "token":`${process.env.POS}`
        })
    }
    console.log(options);
    console.log(process.env.MERCHANT_TOKEN);
    const response = await Fetch(hookUrl, options)
    const json = await response.json();
    console.log(json);
    // console.log(process.env.AcquieredTOKEN);
    res.json(JSON.stringify(
                {
                status: "success",
                code: 200,
                token: json
    }));
    // 
})
app.listen(app.get("port"),function(){
    console.log("server started on port " + app.get("port"));
});
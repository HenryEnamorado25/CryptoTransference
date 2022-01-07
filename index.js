const express = require("express");
const path = require("path");
const Fetch = require("node-fetch");
var app = express();
require('dotenv').config();
//change this to (https://bitpay.com) when it is ready for production
const Environment = "https://test.bitpay.com";
let signature;
// var routes =require("./routes");
var crypto = require("crypto");
let pairingCode;
app.set("port", process.env.PORT || 3000);



const getKeysAndSign=(combinedText)=>{
//Creating keys
const {publicKey,privateKey} = crypto.generateKeyPairSync("rsa",{
    //YES ITS NAME IS "modulusLength" :|
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "spki",
        format: "der"
    },
    privateKeyEncoding:{
        type: "pkcs8",
        format: "der"
    }
})
let x ={privateKey:privateKey.toString('base64')}
let y = {publicKey:publicKey.toString('base64')}
process.env.privateKey =x.privateKey;
process.env.publicKey=y.publicKey;
// console.log(x.privateKey);
/////////////////////////////////////////////////////////////////////////////
// Sign the string
let string =combinedText;
let privateKeyString= x.privateKey;
// console.log(privateKeyString);
privateKeyString = crypto.createPrivateKey({
    key: Buffer.from(privateKeyString,"base64"),
    type: "pkcs8",
    format: "der"
})
// console.log(privateKeyString);
const sign = crypto.createSign("SHA256")
sign.update(string)
sign.end()
signature= sign.sign(privateKeyString).toString("base64");

// console.log("777****"+signature);
////////////////////////////////////////////////////
}


//Webhook to create a invoice
app.get('/createinvoice', async (req,res)=>{
    getKeysAndSign("https://test.bitpay.com/invoices{'currency': 'USD','price': 5,'token':'TfBDiR6sC7X7r3xroD6T1zaiCvGkgzhKtGu'}");
    const hookUrl= `${Environment}/invoices`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json","X-Identity":`${process.env.publicKey}`
        ,"X-Signature":`${signature}`},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "currency": "USD",
            "price": 5,
            "token":`${process.env.AcquieredTOKEN}`
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

app.get('/gettokenpairing', async (req,res)=>{
    const hookUrl= `${Environment}/tokens`;
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "id": `${process.env.SIN}`,
            "pairingCode": `${pairingCode}`,
            "label": "test Investacard",
            "facade": "merchant"
        }) 
    }
    console.log(options);
    console.log(process.env.SIN);
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
        "body":JSON.stringify( {
            "id": `${process.env.SIN}`
        }) 
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
app.listen(app.get("port"),function(){
    console.log("server started on port " + app.get("port"));
});
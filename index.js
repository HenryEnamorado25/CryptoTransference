const express = require("express");
const path = require("path");
const Fetch = require("node-fetch");
const util = require('util')
var app = express();
require('dotenv').config();
var bitauth = require('bitauth');
console.log(bitauth);
//change this to (https://bitpay.com) when it is ready for production
const Environment = "https://test.bitpay.com";
let signature;
// var routes =require("./routes");
var crypto = require("crypto");
let pairingCode;
app.set("port", process.env.PORT || 3000);

let x = bitauth.generateSin();
process.env.GENERATEDTOKEN = x.priv;
console.log(util.inspect(x, false, null, true));




// const getKeysAndSign=(combinedText)=>{
// //Creating keys
// const {publicKey,privateKey} = crypto.generateKeyPairSync("rsa",{
//     //YES ITS NAME IS "modulusLength" :|
//     modulusLength: 2048,
//     publicKeyEncoding: {
//         type: "spki",
//         format: "der"
//     },
//     privateKeyEncoding:{
//         type: "pkcs8",
//         format: "der"
//     }
// })

// let x ={privateKey:privateKey.toString('hex')}
// let y = {publicKey:publicKey.toString('hex')}
// process.env.privateKey =x.privateKey;
// process.env.publicKey=y.publicKey;
// console.log(x);
// /////////////////////////////////////////////////////////////////////////////
// // Sign the string
// let string =combinedText;
// let privateKeyString= x.privateKey;
// // console.log(privateKeyString);
// privateKeyString = crypto.createPrivateKey({
//     key: Buffer.from(privateKeyString,"hex"),
//     type: "pkcs8",
//     format: "der"
// })
// // console.log(privateKeyString);
// const sign = crypto.createSign("SHA256")
// sign.update(string)
// sign.end()
// signature= sign.sign(privateKeyString).toString("hex");

// // console.log("777****"+signature);
// ////////////////////////////////////////////////////
// }


//Webhook to create a invoice
app.get('/createinvoice', async (req,res)=>{
    console.log(process.env.BITPAYPUBLICKEY);
    // getKeysAndSign(`https://test.bitpay.com/invoices{'currency':'USD','price':5,'token':'${process.env.TOKEN}'}`);
    const hookUrl= `${Environment}/invoices`;
    let dataToSign = hookUrl+`{"currency":"USD","price":5,"token":'${process.env.MERCHANT_TOKEN}'}`;
    // let signatureGen = bitauth.sign(dataToSign,process.env.MERCHANT_TOKEN);
    // console.log(process.env.SIN);
    const options = {
        "headers": { "X-Accept-Version": "2.0.0","Content-Type":"application/json"
        ,"X-Signature":bitauth.sign(dataToSign,process.env.BITPAYPUBLICKEY)},
        "method": "POST",
        //I MAY NEED JSON.stringify()
        "body":JSON.stringify( {
            "currency":"USD",
            "price":5,
            "token":`${process.env.MERCHANT_TOKEN}`
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
        "json":JSON.stringify( {
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
app.get('/sentcryptoinvitation', async (req,res)=>{
    const hookUrl= `${Environment}/recipients`;
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
const client =require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

let SID
module.exports = {
    otpSend : (phoneNumber)=>{
        client.verify.v2.services
        .create({friendlyName:'dorlaro otp verify'})
        .then((service) =>{
            SID=service.sid;
            client.verify.v2.services(service.sid)
            .verifications.create({to:'+91'+phoneNumber, channel: 'sms'})
            .then(verification => console.log(verification.status))

        }
        ).catch((err) =>{
            console.log(err)
        })
        
    },
    otpVerify : async(phoneNumber, otpNumber)=>{
        let validation
        try {
             await client.verify.v2.services(SID)
                .verificationChecks
                .create({to:'+91'+phoneNumber, code: otpNumber})
                .then((verification_check) => {
                validation= verification_check
            })
            return validation
        } catch (error) {
            console.log(error);
        }
    }
}
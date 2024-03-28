const otpGenerator = require("otp-generator");
exports.otp_generator = () => {
 const OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,  
    specialChars: false, 
  });

  return OTP;
};
 

// src/services/sms.service.ts
export const sendSms = async (phoneNumber: string, otp: string) => {
  // TODO: Sau này tích hợp Twilio, eSMS, ViettelBS ở đây
  console.log('=================================================');
  console.log(`📲 [SMS MOCK] Gửi đến: ${phoneNumber}`);
  console.log(`🔑 [SMS MOCK] Mã OTP:  ${otp}`);
  console.log('=================================================');
  return true; // Giả sử luôn gửi thành công
};
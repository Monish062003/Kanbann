import React, { useState } from "react";

function Concent() {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: any, value: any) => {
    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
    }
  };
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="w-[500px] flex justify-center items-center z-50 ">
        <div className="bg-white border border-green-400 rounded-lg shadow-md p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Customer Concent</h2>
          <p className="text-gray-700 mb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
            perspiciatis modi eligendi fugit rerum unde sequi nisi natus eveniet
            sit molestiae, molestias aut omnis. Aperiam.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 justify-center">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-8 h-8 text-center border border-purple-500 rounded-md focus:outline-none"
                />
              ))}
            </div>
            <div className="flex justify-center gap-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Resend OTP
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Validate OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Concent;

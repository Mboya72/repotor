import React from 'react'
import Image from 'next/image'
const verify = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <Image
                src={"/R 1.svg"}
                alt="logo"
                width={200} // Adjusted the width and height
                height={200}
            />
            <p className="text-orange-600 text-lg">A Verification email has been sent to your email.</p>
            <p className="text-orange-600 text-[20px]">Please check your email, yes, even the spam folder.</p>
        </div>
    )
}

export default verify
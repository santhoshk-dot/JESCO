import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          Welcome to <span className="font-semibold">JESCO</span>! 
          We are passionate about providing quality products and 
          delivering the best shopping experience for our customers. 
          Our goal is to bring you the latest trends at affordable prices.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you’re here to shop, explore categories, or just browse 
          our collections, we’re committed to making your journey enjoyable. 
          Thank you for trusting us!
        </p>
      </div>
    </div>
  );
};

export default About;

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
          <h2 className="text-xl font-semibold mb-4">Get in touch</h2>
          <p className="text-gray-600 mb-6">
            We would love to receive your feedbacks  </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="text-gray-700" />
              <span className="text-gray-800">contact@jesco.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-gray-700" />
              <span className="text-gray-800">+91 8072334528</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-gray-700" />
              <span className="text-gray-800">
                157-F, Sivakasi to Srivilliputhur Main Road, Opposite to Malli Police Station, Malli - 626141
              </span>
            </div>
          </div>

          {/* Map Embed (optional) */}
          <div className="mt-6">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23979.97082618281!2d77.68072963610305!3d9.493529836622548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06c50033b48503%3A0xdfa8b73d87ed8414!2sUNI%20360%20TURF%20-%20MINI%20STADIUM!5e1!3m2!1sen!2sus!4v1760026889991!5m2!1sen!2sus" 
              width="100%"
              height="200"
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

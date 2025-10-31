import { FaFacebook, FaTwitter, FaYoutube, FaPinterest, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold mb-4">JESCO</h2>
          <p className="text-sm text-gray-500 mb-4">
           The customer is at the heart of our unique business model, which includes design.
          </p>
          <div className="flex space-x-4 text-gray-600">
            <a href="#"><FaFacebook size={20} /></a>
            <a href="#"><FaTwitter size={20} /></a>
            <a href="#"><FaYoutube size={20} /></a>
            <a href="#"><FaPinterest size={20} /></a>
            <a href="#"><FaInstagram size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">QUICK LINKS</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-black">HOME</a></li>
            <li><a href="/about" className="hover:text-black">ABOUT</a></li>
            <li><a href="/services" className="hover:text-black">SERVICES</a></li>
            <li><a href="/single-item" className="hover:text-black">SINGLE ITEM</a></li>
            <li><a href="/contact" className="hover:text-black">CONTACT</a></li>
          </ul>
        </div>

        {/* Help & Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">HELP & INFO</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-black">TRACK YOUR ORDER</a></li>
            <li><a href="#" className="hover:text-black">RETURNS + EXCHANGES</a></li>
            <li><a href="#" className="hover:text-black">SHIPPING + DELIVERY</a></li>
            <li><a href="/contact" className="hover:text-black">CONTACT US</a></li>
            <li><a href="#" className="hover:text-black">FIND US EASY</a></li>
            <li><a href="#" className="hover:text-black">FAQS</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">CONTACT US</h3>
          <p className="text-sm text-gray-500 mb-2">
            Do you have any questions or suggestions?
          </p>
          <p className="text-sm font-medium">contact@jesco.com</p>

          <p className="text-sm text-gray-500 mt-4 mb-2">
            Do you need support? Give us a call.
          </p>
          <p className="text-sm font-medium">+91 8072334528</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t mt-8 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JESCO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 inline-block">
              Trackify
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Empowering organizations to manage complaints efficiently and transparently. Build trust with your users today.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Linkedin} />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/#features" label="Features" />
              <FooterLink to="/login" label="Login" />
              <FooterLink to="/register" label="Register" />
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <FooterLink to="/privacy" label="Privacy Policy" />
              <FooterLink to="/terms" label="Terms of Service" />
              <FooterLink to="/cookies" label="Cookie Policy" />
              <FooterLink to="/security" label="Security" />
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-indigo-400 shrink-0 mt-1" />
                <span>support@trackify.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-indigo-400 shrink-0 mt-1" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-indigo-400 shrink-0 mt-1" />
                <span>123 Innovation Dr, Tech City, TC 90210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Trackify. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex gap-6">
            <span>Made with ❤️ for better governance</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }) => (
  <motion.a
    href="#"
    whileHover={{ scale: 1.1, backgroundColor: "#4f46e5", color: "#ffffff" }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
  >
    <Icon size={20} />
  </motion.a>
);

const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to}>
      <motion.span
        className="inline-block"
        whileHover={{ x: 5, color: "#818cf8" }}
      >
        {label}
      </motion.span>
    </Link>
  </li>
);

export default Footer;

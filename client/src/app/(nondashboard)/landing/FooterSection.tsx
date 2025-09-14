"use client";
import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand & Contact */}
        <div>
          <Link href="/" className="text-2xl font-bold text-primary-700">
            PristinePrimer
          </Link>
          <p className="mt-4 text-gray-600 text-sm">
            Helping you buy, sell, or rent your next property in Kenya.
          </p>
          <div className="mt-6 text-gray-600 text-sm space-y-1">
            <p>
              <strong>Address:</strong> Nairobi, Kenya
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+254700000000" className="hover:underline">
                +254 700 000 000
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@rentiful.co.ke" className="hover:underline">
                info@pristineprimer.co.ke
              </a>
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get the latest property listings and market trends.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row sm:items-center"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="w-full sm:flex-1 px-4 py-2 mb-3 sm:mb-0 sm:mr-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              className="px-5 py-2 bg-primary-700 text-white rounded hover:bg-primary-800"
            >
              Subscribe
            </button>
          </form>
          <div className="flex space-x-4 mt-6">
            <a href="#" aria-label="Facebook" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faFacebook} className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-primary-600">
              <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} PristinePrimer. All rights reserved.
         <br />
Made by{" "}
<Link
  href="https://implimenta.tech"
  target="_blank"
  rel="noopener noreferrer"
  className="font-bold text-secondary-600 hover:text-secondary-800 hover:underline"
>
  Implimenta
</Link>

      </div>
    </footer>
  );
};

export default FooterSection;

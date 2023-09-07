import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="about">
        <h2>About Policy</h2>
        <p>
        Catering is the business of providing food service at a remote site or a site such as a hotel, hospital, pub, aircraft, cruise ship, park, filming site or studio, entertainment site, or event venue.By understanding the needs of our patrons in the best possible manner, we are readily engrossed in delivering On Site Catering Services.
        </p>
      </div>
      {/* <div className="header">
        <h2>Header</h2>
        <p>Link</p>
        <p>Link</p>
        <p>Link</p>
        <p>Link</p> 
      </div> */}

      <div className="contact-us">
        <h2>Contact Us</h2>
        <p> 
          <b>Address:</b>  001, Vigyan, Sector 17, Vashi, Navi Mumbai, Maharashtra, 400 703{" "}
        </p>
        <p>
          <b>Phone No:</b> +91-9892267499
        </p>
      </div>
    </div>
  );
};

export default Footer;

import React from "react";
import "./Footer.css";
// import heroimg from "../../assets/canteenhome.png"
import whatsapp from "../../assets/whatsapp.png"
import facebook from "../../assets/facebook.jpeg"
import instagram from "../../assets/instagram.jpeg"

const Footer = () => {
  return (
    <div className="footer">
      <div className="about">
        <h2>About Policy</h2>
        <p>
        Catering is the business of providing food service at a remote site or a site such as a hotel, hospital, pub, aircraft, cruise ship, park, filming site or studio, entertainment site, or event venue.By understanding the needs of our patrons in the best possible manner, we are readily engrossed in delivering On Site Catering Services.
        </p>
      </div>
      
      <div className="social_icon">
        <h2>Social Handels</h2>
        {/* <img src="{social}"</img> */}
        <img src={whatsapp} className="icons" alt="whatsapp" />
        <img src={facebook} className="icons" alt="facebook" />
        <img src={instagram} className="icons" alt="instagram" />
        {/* <img src={gmail} className="icons" alt="tea" /> */}
        
      </div>

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

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/auth/auth.actions";
import "./Navbar.css";
import { useState } from "react";



const Navbar = ({
  
  auth: { isAuthenticated, loading, user },
  logoutUser,
  cart,
}) => {

  const [toggle , setToggle] = useState(false)

  const LoggedOut = (
    <div  className={`nav-items${toggle ? 'show navbarshow':''}`}>
      <Link to="/signin" className="link">
        SignIn
      </Link>
      <Link to="/signup" className="link">
        SignUp
      </Link>
    </div>
  );

  const LoggedInUser = (
      
    <div  className={`nav-items${toggle ? 'show navbarshow':''}`}>
      
      <Link to="/signin" className="link">
        Home
      </Link>
      <Link to="/cart" className="link">
        Cart{" "}
        {cart?.length > 0 && <span className="cart-no">{cart?.length}</span>}
      </Link>

      <Link to="/dashboard" className="link">
        Dashboard
      </Link>
      <button className="link btn logOut" onClick={() => logoutUser()} href="#!">
        Logout
      </button>
    </div>

  );
  const LoggedInAdmin = (
    <div  className={`nav-items${toggle ? 'show navbarshow':''}`}>
      <Link to="/signin" className="link">
        Home
      </Link>
      <Link to="/add-food" className="link">
        Add Item
      </Link>
      <Link to="/dashboard" className="link">
        Dashboard
      </Link>
      <Link className="link btn logOut" onClick={() => logoutUser()}>
        Logout
      </Link>
    </div>
  );
  return (
  <>  
    <div className="navbar">
      <div className="hamburger-menu" onClick={()=>{setToggle((prev) => !prev); console.log("button Clicked!")}} >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>
        <div className="items">
      {isAuthenticated & !loading
        ? user?.isAdmin
          ? LoggedInAdmin
          : LoggedInUser
        : LoggedOut}
        </div>
      </div>
  </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  cart: state.cart.cartItems,
});
export default connect(mapStateToProps, { logoutUser })(Navbar);

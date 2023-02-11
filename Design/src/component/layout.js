import FooterComponent from "./Footer/footer";
import NavbarComponent from "./Navbar/navbar";

const Layout = (props) => {

    return (
        <>
            {/* <NavbarComponent/> */}
            
                  {props.children}
            
            <FooterComponent/>
        </>
    )
}

export default Layout;
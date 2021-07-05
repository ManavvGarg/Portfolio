import Credits from '../partials/credits';
import Navbar from '../partials/navbar2';
import MobileNav from '../partials/MobileNav';
import '../css/mobileNav.css';

const Player = () => {

    return(

        <html>
        <body>
          <Navbar player="active"/>
        <section id="projects" className="projects section-show">
            <br /><br /><br /><br /><br /><br /><br /><br /><br />
    <div className="container">

    <h2 style={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex"

    }} >Page is under construction! Please check back later!</h2>

    </div>
  </section>

  <MobileNav />
  <Credits />
        </body>
      </html>

    );

}

export default Player;
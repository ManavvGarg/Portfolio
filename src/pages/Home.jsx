/* eslint-disable react/style-prop-object */
import HeadData from '../partials/head';
import '../vendor/bootstrap/css/bootstrap.css';
import '../vendor/bootstrap-icons/bootstrap-icons.css';
import '../vendor/boxicons/css/boxicons.min.css';
import '../vendor/glightbox/css/glightbox.min.css';
import '../vendor/remixicon/remixicon.css';
import '../vendor/swiper/swiper-bundle.min.css';
import '../css/style.css';
import Credits from '../partials/credits';
import Navbar from '../partials/navbar';
import MobileNav from '../partials/MobileNav';
import '../css/mobileNav.css';

const Home = () => {



    return (

      <html lang="en">
             
             <HeadData 
             title="Home | Manav Garg"
             description="/*Hey! I'm Manav, Nice to meet you 👋. I'm a student as well as a software developer who is passionate about making awesome things.*/"
             keywords="Manav, Garg, Globa Sevak, Programming, Coder, ReactJS, Freelance, Python, MySql, PostgreSQL, HTML5, CSS3, SASS, PUG, RUBY, NODE, Javascript"
             url="https://manavgarg.tk/"
             />

      <body>
      <header id="header">
    <div className="container">

      <h1 style={{fontFamily: "'JetBrains Mono', monospace", fontSize: '2.2rem'}}><a href="/">Manav garg</a></h1>

      <div className="typing-container">
        <h2>I'm a passionate <span id="feature-text"></span><span className="input-cursor"></span> from India.</h2>
      </div>


      <Navbar />
      

      <div className="social-links">
        <a href="https://github.com/ManavvGarg" target="_blank" className="github" rel="noreferrer"><i className="bi bi-github"></i></a>
        <a href="https://twitter.com/manavvgarg__" target="_blank" className="twitter" rel="noreferrer"><i className="bi bi-twitter"></i></a>
        <a href="https://www.instagram.com/manavvgarg" target="_blank" className="instagram" rel="noreferrer"><i className="bi bi-instagram"></i></a>
        <a href="https://www.linkedin.com/in/manavvgarg/" target="_blank" className="youtube" rel="noreferrer"><i className="bi bi-linkedin"></i></a>
        <a href="https://www.youtube.com/channel/UCNNWJbXYSnfiKr-uayTW-eA" target="_blank" className="youtube" rel="noreferrer"><i className="bi bi-youtube"></i></a>
      </div>

    </div>
    
  </header>

  <MobileNav />
      <Credits />
      </body>



  </html>
      

    );
  }
   
  export default Home;
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'
import Navbar from '../Navbar/Navbar'
const Home = () => {
  const iplteams = [
    { name: 'CSK', fullname: "Chennai Super Kings", color: "#F5A800", text: "#1a1a2e" },
    { name: 'MI', fullname: "Mumbai Indians", color: "#004BA0", text: "#ffffff" },
    { name: 'RCB', fullname: "Royal Challengers Bangalore", color: "#C8102E", text: "#ffffff" },
    { name: 'KKR', fullname: "Kolkata Knight Riders", color: "#3A225D", text: "#FFD700" },
    { name: 'DC', fullname: "Delhi Capitals", color: "#0078BC", text: "#ffffff" },
    { name: 'SRH', fullname: "Sunrises Hyderabad", color: "#F7A721", text: "#1a1a2e" },
    { name: 'GT', fullname: "Gujarat Titans", color: "#1C2B5E", text: "#97CADB" },
    { name: 'LSG', fullname: "Lucknow Super Giants", color: "#A72B6C", text: "#97CADB" },
    { name: 'PBKS', fullname: "Punjab Kings", color: "#ED1B24", text: "#ffffff" },
    { name: 'RR', fullname: "Rajasthan Royals", color: "#EA1A85", text: "#ffffff" },
  ]
  const nav = useNavigate();
  const userName = localStorage.getItem("userName") || "Cricket Fan";
  const gotocategory = (categoryId) => {
    nav(`/products?categoryId=${categoryId}`)
  }
  const gototeam = (teamName) => {
    nav(`/products?teamName=${teamName}`);
  }
  return (
    <>
      <div className={styles.homepage}>
        <Navbar />
        <section className={styles.hero}>
          <div className={styles.herocontent}>
            <p className={styles.herotag}>🏏 Official IPL Merchandise</p>
            <h1 className={styles.herotitle}>Wear Your Team's <br /><span className={styles.herohighlight}>
              Pride & Passion</span></h1>
            <p className={styles.herosubtitle}>Shop authentic IPL jerseys and caps for all 10 teams. Show your Support!!!</p>
            <div className={styles.herobtns}>
              <button className={styles.herobtn} onClick={() => nav('/products')}>Shop Now</button>
              <button className={styles.herobtnol} onClick={() => gotocategory(1)}>View Jerseys</button>
            </div>
          </div>
          <div className={styles.herobadge}>
            <div className={styles.badge}>
              <span className={styles.badgenum}>10</span>
              <span className={styles.badgelabel}>Teams</span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgenum}>100%</span>
              <span className={styles.badgelabel}>Original</span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgenum}>Fast</span>
              <span className={styles.badgelabel}>Delivery</span>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionheader}>
            <h2 className={styles.sectiontitle}>Shop By Category</h2>
            <p className={styles.sectionsubtitle}>Choose What You Love</p>
          </div>
          <div className={styles.categorygrid}>
            <div className={styles.categorycard} onClick={() => gotocategory(1)}>
              <div className={styles.categoryimagebox}>
                <img src="http://localhost:8080/images/categoryjersey.jpeg" alt="IPL Jerseys"
                  className={styles.categoryimg} onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex"
                  }} />
                {/* if image not found error side this image will be shown flex */}
                <div className={styles.categoryem} style={{ display: "none" }}>👕</div>
              </div>
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryname}>IPL Jerseys</h3>
                <p classname={styles.categorydesc}>Official team jerseys for all 10 IPL teams</p>
                <button className={styles.categorybtn}>Shop Jerseys</button>
              </div>
            </div>
            <div className={styles.categorycard} onClick={() => gotocategory(2)}>
              <div className={styles.categoryimagebox}>
                <img src="http://localhost:8080/images/categorycap.jpeg" alt="IPL Caps" className={styles.categoryimg}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex"
                  }} />
              </div>
              <div className={styles.categoryem} style={{ display: "none" }}>🧢</div>
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryname}>IPL Caps</h3>
                <p classname={styles.categorydesc}>Official team caps-free size fits all or all</p>
                <button className={styles.categorybtn}>Shop Caps</button>
              </div>
            </div>
          </div>
        </section>
        <section className={`${styles.section} ${styles.teamSection}`}>
          <div className={styles.sectionheader}>
            <h2 className={styles.sectiontitle}>Shop By Team</h2>
            <p className={styles.sectionsubtitle}>Pick Your favorite Team</p>
          </div>
          <div className={styles.teamgrid}>
            {iplteams.map((team) => {
              return (
                <div key={team.name} className={styles.teamcard} style={{ background: team.color, color: team.text }}
                  onClick={() => gototeam(team.name)}>
                  <span className={styles.teamshort}>{team.name}</span>
                  <span className={styles.teamfull}>{team.fullname}</span>

                </div>
              )
            })}
          </div>
        </section>
        <section className={styles.combosection}>
          <div className={styles.combocontent}>
            <div className={styles.comboleft}>
              <span className={styles.combotag}>
                🔥Special Combo Offer
              </span>
              <h2 className={styles.combotitle}>Jersey+Cap Combo</h2>
              <p className={styles.combodesc}>Buy any jersey and cap of the same team and get the best deal
                on your favorite IPL Merchandise!!
              </p>
              <div className={styles.combopricing}>
                <div className={styles.comboprice}>
                  <span className={styles.pricelabel}>Jersey</span>
                  <span className={styles.pricevalue}>from ₹1199</span>
                </div>
                <span className={styles.plus}>+</span>
                <div className={styles.comboprice}>
                  <span className={styles.pricelabel}>Cap</span>
                  <span className={styles.pricevalue}>from ₹449</span>
                </div>
              </div>
              <button className={styles.combobtn} onClick={() => nav('/products')}>Grab Combo!!</button>
            </div>
            <div className={styles.comboright}>
              <div className={styles.comboem}><span>👕</span><span className={styles.plusign}>+</span>
                <span>🧢</span>
              </div>
              <p className={styles.combonote}>Available for all 10 IPL Teams</p>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionheader}>
            <h2 className={styles.sectiontitle}>Why Choose Us?</h2>
          </div>
          <div className={styles.featuregrid}>
            <div className={styles.featurecard}><span className={styles.featureicon}>✅</span><h4>100% Original</h4>
              <p>All Products are Official IPL Merchandise</p></div>
          </div>
          <div className={styles.featurecard}>
            <span className={styles.featureicon}>🚚</span><h4>Fast Delivery</h4>
            <p>Quick Delivery across India</p>
          </div>
          <div className={styles.featurecard}>
            <span className={styles.featureicon}>🔁</span><h4>Easy Returns</h4><p>Free Return Policy</p>
          </div>
          <div className={styles.featurecard}>
            <span className={styles.featureicon}>🏏</span><h4>All 10 IPL Teams</h4>
            <p>Complete Collection for every IPL team</p>
          </div>
        </section>
        <footer className={styles.footer}>
          <div className={styles.footertop}>
            <div className={styles.footerbrand}>
              <h3 className={styles.footerlogo}>🏏IPL Store</h3>
              <p className={styles.footerdesc}>Your shop for official IPL Jerseys and Caps</p>
            </div>
            <div className={styles.footerlinks}>
              <h5 className={styles.footerheading}>Quick Links</h5>
              <a onClick={() => nav('/home')} className={styles.footerlink}>Home</a>
              <a onClick={() => nav('/products')} className={styles.footerlink}>Products</a>
              <a onClick={() => gotocategory(1)} className={styles.footerlink}>Jerseys</a>
              <a onClick={() => gotocategory(2)} className={styles.footerlink}>Caps</a>

            </div>
            <div className={styles.footerlinks}>
              <h5 className={styles.footerheading}>Teams</h5>
              {iplteams.slice(0, 5).map((team) => {
                return (
                  <>
                    <a key={team.name} onClick={() => gototeam(team.name)} className={styles.footerlink}>{team.name}</a>
                  </>
                )
              })}
            </div>
            <div className={styles.footercontact}>
              <h5 className={styles.footerheading}>Contact</h5>
              <p className={styles.footertext}>🗨support@iplstore.com</p>
              <p className={styles.footertext}>📞999-999-9999</p>
              <p className={styles.footertext}>xyz,mumbai</p>
            </div>
          </div>
          <div className={styles.footerbottom}><p>&copy;2026 IPL STORE. All rights reserved</p></div>
        </footer>
      </div>
    </>
  )
}

export default Home
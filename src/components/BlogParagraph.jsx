import famSki from '../images/fam-ski.jpg';

export default function BlogParagraph({ styles }) {
  return (
    <div>
      <h3>Hi, I'm Dave Greensmith</h3>
      <br />
      <p>
        A Design Engineer with over ten years' experience managing clients across multiple industries and working with various design software including AutoCAD and bespoke back-office IT systems.
      </p>
      <br />
      <p>
        I have a passion for tech and how we use it in industry along with domestic applications. I am approachable and adaptable with excellent communication skills and a great attention to detail.
      </p>
      <br />
      <p>With a background in IT systems and finance I recently worked as a bookkeeper managing a portfolio of clients whilst continuing to keep my IT skills up to date with online qualifications.</p>
      <br />
      <p>Having undergone online courses in software development with freecodecamp.org and codecademy.com, I decided that I would pursue a career as a software developer.</p>
      <br />
      <p>
        This is when I found Northcoders and enrolled to study on the full time coding boot camp. I believe my strong mathematical, creative and problem solving skills from previous employment have
        helped tremendously, and find the challenges found in coding most rewarding, when overcome.
      </p>
      <br />
      <h4>Hobbies and Interests</h4>
      <br />
      <p>
        As a keen golfer, I play in my clubs competitions to a high standard. I have played for over 20 years, and have won many competitions with the most prestigious being “Captains Day” in 2019.
      </p>
      <br />
      <p>I have also represented my previous golf club in team competitions, notably the Manchester and District Golf Alliance “Archie Preston” which we won in 2012. </p>
      <br />
      <p>
        I am an accomplished skier & snowboarder, having enjoyed skiing from an early age, and later snowboarding . I continue to travel regularly with my young family and encourage along the way.
      </p>

      <img src={famSki} alt="skiing in the Alps" className={styles.famSki} />
      <br />
      <p>To unwind, I enjoy weekly angling trips at a local club I am part of. This allows some time away for some mental relaxation.</p>
    </div>
  );
}

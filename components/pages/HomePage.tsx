import React from "react";

export default function HomePage() {
  return (
    <div className="p-2 md:p-4 font-mono">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">About Me</h2>

      <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
        <p className="mb-4">
          Manav is a 21-year-old Software Developer and Machine Learning
          Engineer with expertise in graphic design and UI/UX. He possesses
          proficiency in multiple programming languages and technologies,
          including Python, Java, JavaScript, C/C++, TensorFlow, PyTorch,
          Scikit-Learn, Django, React, and Figma.
        </p>
        <p className="mb-4">
          His technical competencies extend to natural language processing,
          computer vision, data mining, and big data analytics. Manav
          demonstrates exceptional motivation and results-oriented work ethics,
          consistently exhibiting a collaborative mindset and an insatiable
          appetite for knowledge acquisition.
        </p>

        <p className="mb-4">
          <b>Achievements:</b>
          <br />
          • Secured a global rank within the top 3,000 in the all-India VIT
          entrance examination<br />
          • Developed strong communication and presentation skills complemented
          by an analytical mindset<br />
          • Established expertise in Data Structures, Algorithms, and Modern ML
          techniques<br />
          • Mastered full-stack development capabilities with end-to-end API
          integration<br />
          • Demonstrated proficiency in Python ML libraries including TensorFlow
          and OpenCV<br />
          • Cultivated professional skills in UI/UX design using Figma, Adobe
          Photoshop, and Illustrator
        </p>

        <div className="mb-4">
          <b>Professional Interests</b>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>
              🔬 Manav is deeply fascinated by the potential of data-driven
              technologies to address real-world challenges and facilitate
              intelligent decision-making through automation and insight.
            </li>

            <li>
              🧪 He aspires to contribute to research-oriented projects, with
              particular emphasis on practical ML applications, model
              interpretability, and responsible AI implementation.
            </li>

            <li>
              📚 Currently exploring domains such as natural language
              processing, computer vision, and reinforcement learning, while
              simultaneously strengthening his foundation in statistics,
              algorithms, and data analysis.
            </li>

            <li>
              🚀 His professional objective is to develop into a comprehensive
              machine learning engineer and data scientist, equipped with the
              technical capabilities to work on both production-grade systems
              and experimental prototypes.
            </li>
          </ul>
        </div>

        <p>
          <b>Beyond Technology</b>
          <br />
          Manav is also a self-taught designer, enthusiastic gamer, casual
          culinary enthusiast, and visual thinker — he firmly believes that
          creative expression complements and enhances analytical thinking in
          technology environments.
        </p>
      </div>
    </div>
  );
}

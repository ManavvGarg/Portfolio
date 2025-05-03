import React from "react";

export default function HomePage() {
  return (
    <div className="p-4 font-mono">
      <h2 className="text-xl font-bold mb-6">About Me</h2>

      <div className="space-y-4 text-sm">
        <p className="mb-4">
          Manav is a 21-year-old software developer and machine learning
          engineer with a passion for graphic design and UI/UX. He is proficient
          in a variety of programming languages and technologies, including
          Python, Java, JavaScript, C/C++, TensorFlow, PyTorch, Scikit-Learn,
          Django, React, and Figma.
        </p>

        <p className="mb-4">
          He is also familiar with natural language processing, computer vision,
          data mining, and big data analytics. Manav is a highly motivated and
          results-oriented individual who is always willing to help others and
          has a hungry attitude for learning new things.
        </p>

        <p className="mb-4">
          <b>Achievements:</b>
          <br />
          • Secured global rank in top 3k in all-India VIT entrance exam<br />
          • Strong communication and presentation skills with an analytical
          mindset<br />
          • Expertise in Data Structures, Algorithms, and Modern ML
          techniques<br />
          • Full-stack development capabilities with end-to-end API
          integration<br />
          • Proficient in Python ML libraries including TensorFlow and
          OpenCV<br />
          • Skilled in UI/UX design using Figma, Adobe Photoshop, and
          Illustrator
        </p>

        <div className="mb-4">
          <b>Few Facts about me!</b>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>
              🔬 I'm deeply fascinated by the potential of data-driven
              technologies to solve real-world problems and to enable smarter
              decision-making through automation and insight.
            </li>

            <li>
              🧪 I aim to contribute to research-oriented projects, with a focus
              on practical ML applications, model interpretability, and
              responsible AI.
            </li>

            <li>
              📚 Actively exploring areas like natural language processing,
              computer vision, and reinforcement learning, while also grounding
              myself in statistics, algorithms, and data analysis.
            </li>

            <li>
              🚀 My goal is to become a well-rounded machine learning engineer
              and data scientist, with the skill set to work on both
              production-grade systems and experimental prototypes.
            </li>
          </ul>
        </div>

        <p>
          <b>⚡ Fun Fact</b>
          <br />
          I’m also a self-taught designer, an avid gamer, a casual cook, and a
          visual thinker — I believe creativity complements analytical thinking
          in tech.
        </p>
      </div>
    </div>
  );
}

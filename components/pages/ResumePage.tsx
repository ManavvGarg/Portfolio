import React from "react";
import Link from "next/link";

export default function ResumePage() {
  return (
    <div className="p-4 font-mono">
      <h2 className="text-xl font-bold mb-6">My Resume</h2>

      <div className="text-sm">
        <p className="mb-6">
          You can download my full resume{" "}
          <Link href="/resume.pdf" target="_blank" className="underline">
            here
          </Link>.
        </p>

        <div className="space-y-4">
          <h1 className="font-medium text-xl">
            Summarized Resume Below ▼
          </h1>
          <section>
            <h3 className="font-bold text-base mb-2">Education</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">
                  <u>
                    <b>Vellore Institute of Technology, Chennai</b>
                  </u>
                </h4>
                <p>B.Tech, Computer Science Engineering • 2020–2025</p>
                <p>Specialization in AI/ML • Current CGPA: 8.49/10</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">Experience</h3>
            <div className="space-y-4">
              <div>
                <b>
                  <u>
                    <h4 className="font-medium">Intel Corporation</h4>
                  </u>
                </b>
                <p>Industrial Trainee • May–Aug 2024</p>
                <p>
                  Worked on Business Contract Validation using ML for clause
                  classification and deviation detection.
                </p>
              </div>
              <div>
                <b>
                  <u>
                    <h4 className="font-medium">Tisac Pvt. Ltd.</h4>
                  </u>
                </b>
                <p>Intern, Full Stack Developer & ML Engineer • May–Jun 2024</p>
                <p>
                  Developed LLM training platform using Docker, Firebase, and
                  Jupyter environments.
                </p>
              </div>
              <div>
                <b>
                  <u>
                    <h4 className="font-medium">
                      StudioX (Coca-Cola × Hogarth India)
                    </h4>
                  </u>
                </b>
                <p>Intern, Full Stack Developer • Aug–Oct 2023</p>
                <p>
                  Built web apps for ICC World Cup 2023 campaign (voting &
                  polling system).
                </p>
              </div>
              <div>
                <b>
                  <u>
                    <h4 className="font-medium">Wipro</h4>
                  </u>
                </b>
                <p>Intern, Android Developer & ML • Aug–Nov 2023</p>
                <p>
                  Built Android app for machine vision-based object detection
                  and logging.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">Skills</h3>
            <div className="space-y-1">
              <p>
                Python • JavaScript • C++ • Java • Dart • SQL • Bash • HTML5 •
                CSS3
              </p>
              <p>
                React • Next.js • Node.js • Express • Django • Flask • FastAPI •
                WordPress
              </p>
              <p>TensorFlow • PyTorch • Scikit-learn • EmoRoBERTa • OpenCV</p>
              <p>
                Pandas • NumPy • Matplotlib • Jupyter • Docker • Firebase •
                MongoDB • Git
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">Domains & Techniques</h3>
            <div className="space-y-1">
              <p>
                Machine Learning • Deep Learning • Natural Language Processing
              </p>
              <p>Computer Vision • Data Science • Data Analysis</p>
              <p>LLM Training & Fine-Tuning • ML-Ops • DevOps</p>
              <p>
                Full Stack Development • Android Development • Secure
                Authentication
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">Relevant Coursework</h3>
            <div className="space-y-2">
              <div>
                <p className="font-medium underline">
                  Computer Science Foundations
                </p>
                <p className="text-xs">
                  Data Structures & Algorithms • Object-Oriented Programming
                </p>
              </div>
              <div>
                <p className="font-medium  underline">
                  Artificial Intelligence
                </p>
                <p className="text-xs">
                  Artificial Intelligence • Machine Learning • Explainable AI
                </p>
              </div>
              <div>
                <p className="font-medium  underline">Mathematics</p>
                <p className="text-xs">
                  Linear Algebra • Calculus • Probability & Statistics
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

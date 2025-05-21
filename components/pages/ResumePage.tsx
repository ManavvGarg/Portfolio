import React from "react";
import Link from "next/link";

export default function ResumePage() {
  // Calculate total experience
  const experiences = [
    { start: new Date(2025, 0), end: new Date(2025, 5) }, // Jan-June 2025
    { start: new Date(2024, 4), end: new Date(2024, 7) }, // May-Aug 2024
    { start: new Date(2024, 4), end: new Date(2024, 5) }, // May-Jun 2024
    { start: new Date(2023, 7), end: new Date(2023, 9) }, // Aug-Oct 2023
    { start: new Date(2023, 7), end: new Date(2023, 10) }, // Aug-Nov 2023
  ];

  const totalMonths = experiences.reduce((total, exp) => {
    const months = (exp.end.getFullYear() - exp.start.getFullYear()) * 12 +
      (exp.end.getMonth() - exp.start.getMonth() + 1);
    return total + months;
  }, 0);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const experienceSummary = `(${
    years > 0 ? `${years} year${years !== 1 ? "s" : ""}` : ""
  }${years > 0 && months > 0 ? ", " : ""}${
    months > 0 ? `${months} month${months !== 1 ? "s" : ""}` : ""
  })`;

  return (
    <div className="p-2 md:p-4 font-mono">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">My Resume</h2>

      <div className="text-xs md:text-sm">
        <p className="mb-6">
          You can view and download my full resume{" "}
          <Link
            href="/Resume_Manav_Garg.pdf"
            target="_blank"
            className="underline"
          >
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
                <p>
                  Specialization in AI/ML • Current CGPA:{" "}
                  <span className="text-red-500 dark:text-red-400">
                    8.49
                  </span>/10 • Current Semester: 8th
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">
              Experience{" "}
              <span className="font-normal text-sm">{experienceSummary}</span>
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">
                  <u>
                    <b>IHX Pvt. Ltd. - A Perfios Company (Current)</b>
                  </u>
                </h4>
                <p>
                  <span className="text-blue-800 dark:text-blue-400 font-medium">
                    Data Scientist and Machine Learning Intern
                  </span>{" "}
                  • Jan–June 2025
                </p>
                <p>
                  Worked on tariff digitization initiatives. Led comprehensive
                  data mining, preparation, and cleansing processes. Developed
                  and Trained custom model architectures and implemented robust
                  backend APIs and deployment engines enabling scalable
                  production deployment of machine learning solutions.
                </p>
              </div>
              <div>
                <h4 className="font-medium">
                  <u>
                    <b>Intel Corporation</b>
                  </u>
                </h4>
                <p>
                  <span className="text-blue-800 dark:text-blue-400 font-medium">
                    Industrial Trainee
                  </span>{" "}
                  • May–Aug 2024
                </p>
                <p>
                  Worked on Business Contract Validation using ML for clause
                  classification and deviation detection.
                </p>
              </div>
              <div>
                <h4 className="font-medium">
                  <u>
                    <b>Tisac Pvt. Ltd.</b>
                  </u>
                </h4>
                <p>
                  <span className="text-blue-800 dark:text-blue-400 font-medium">
                    Intern, Full Stack Developer & ML Engineer
                  </span>{" "}
                  • May–Jun 2024
                </p>
                <p>
                  Developed LLM training platform using Docker, Firebase, and
                  Jupyter environments.
                </p>
              </div>
              <div>
                <h4 className="font-medium">
                  <u>
                    <b>StudioX (Coca-Cola × Hogarth India)</b>
                  </u>
                </h4>
                <p>
                  <span className="text-blue-800 dark:text-blue-400 font-medium">
                    Intern, Full Stack Developer
                  </span>{" "}
                  • Aug–Oct 2023
                </p>
                <p>
                  Built web apps for ICC World Cup 2023 campaign (voting &
                  polling system).
                </p>
              </div>
              <div>
                <h4 className="font-medium">
                  <u>
                    <b>Wipro</b>
                  </u>
                </h4>
                <p>
                  <span className="text-blue-800 dark:text-blue-400 font-medium">
                    Intern, Android Developer & ML
                  </span>{" "}
                  • Aug–Nov 2023
                </p>
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
                <p className="font-medium underline">
                  Artificial Intelligence
                </p>
                <p className="text-xs">
                  Artificial Intelligence • Machine Learning • Explainable AI
                </p>
              </div>
              <div>
                <p className="font-medium underline">Mathematics</p>
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

// import React, { useRef, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

// const NEXT_PUBLIC_FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
// const NEXT_PUBLIC_RECAPTCHA_SITE_KEY =
//   process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// export default function ContactPage() {
//   const [status, setStatus] = useState({
//     submitted: false,
//     submitting: false,
//     info: { error: false, msg: null as string | null },
//   });

//   const [inputs, setInputs] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const [captchaToken, setCaptchaToken] = useState<string | null>(null);
//   const recaptchaRef = useRef<ReCAPTCHA>(null);

//   const handleServerResponse = ({ ok, msg }: { ok: boolean; msg: string }) => {
//     if (ok) {
//       setStatus({
//         submitted: true,
//         submitting: false,
//         info: { error: false, msg },
//       });
//       setInputs({ name: "", email: "", message: "" });
//       setCaptchaToken(null);
//       recaptchaRef.current?.reset();
//     } else {
//       setStatus({
//         submitted: false,
//         submitting: false,
//         info: { error: true, msg },
//       });
//     }
//   };

//   const handleOnChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setInputs((prev) => ({
//       ...prev,
//       [e.target.id]: e.target.value,
//     }));
//     setStatus({
//       submitted: false,
//       submitting: false,
//       info: { error: false, msg: null },
//     });
//   };

//   const handleOnCaptchaChange = (token: string | null) => {
//     setCaptchaToken(token);
//   };

//   const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!captchaToken) {
//       handleServerResponse({ ok: false, msg: "Please complete the CAPTCHA." });
//       return;
//     }

//     setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

//     const payload = {
//       ...inputs,
//       "g-recaptcha-response": captchaToken,
//     };

//     try {
//       const res = await fetch(
//         `https://formspree.io/f/${NEXT_PUBLIC_FORMSPREE_ID}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );

//       const text = await res.text();
//       handleServerResponse({ ok: res.ok, msg: text });
//     } catch (error) {
//       handleServerResponse({
//         ok: false,
//         msg: "Network error. Please check your connection and try again.",
//       });
//     }
//   };

//   return (
//     <div className="p-4 font-mono">
//       <h2 className="text-xl font-bold mb-6">Get in Touch</h2>
//       <p className="mb-4">
//         You can reach out to me using the form below or connect with me on{" "}
//         <a
//           href="https://www.linkedin.com/in/manavvgarg"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="underline hover:text-gray-600 dark:hover:text-gray-300"
//         >
//           LinkedIn
//         </a>.
//       </p>
//       <form onSubmit={handleOnSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block mb-1">Name</label>
//           <input
//             type="text"
//             id="name"
//             value={inputs.name}
//             onChange={handleOnChange}
//             required
//             className="w-full border border-black dark:border-white bg-transparent p-2"
//           />
//         </div>

//         <div>
//           <label htmlFor="email" className="block mb-1">Email</label>
//           <input
//             type="email"
//             id="email"
//             value={inputs.email}
//             onChange={handleOnChange}
//             required
//             pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
//             title="Please enter a valid email address (e.g. name@example.com)"
//             className="w-full border border-black dark:border-white bg-transparent p-2"
//           />

//           {/* Basic email format validation */}
//           {inputs.email &&
//             !inputs.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i) && (
//             <p className="text-red-500 text-sm mt-1">
//               Please enter a valid email address
//             </p>
//           )}
//         </div>

//         <div>
//           <label htmlFor="message" className="block mb-1">Message</label>
//           <textarea
//             id="message"
//             rows={4}
//             value={inputs.message}
//             onChange={handleOnChange}
//             required
//             className="w-full border border-black dark:border-white bg-transparent p-2"
//           />
//         </div>

//         {NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
//           <ReCAPTCHA
//             sitekey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
//             onChange={handleOnCaptchaChange}
//             ref={recaptchaRef}
//           />
//         )}

//         <button
//           type="submit"
//           disabled={status.submitting || !captchaToken}
//           className="border border-black dark:border-white px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50"
//         >
//           {status.submitting ? "Sending..." : "Send Message"}
//         </button>

//         {status.submitted && (
//           <p className="text-green-600 dark:text-green-400">
//             Message sent successfully!
//           </p>
//         )}
//         {status.info.error && (
//           <p className="text-red-600 dark:text-red-400">
//             {status.info.msg || "Error sending message."}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }

// // CODE BELOW IS THE ENHANCED VERSION WITH EMAIL VALIDATION AND RECAPTCHA BUT IS INCOMPLTE.
// // IT IS COMMENTED OUT FOR NOW

// // import React, { useRef, useState } from "react";
// // import ReCAPTCHA from "react-google-recaptcha";
// // import isDisposableEmail, {
// //   EmailValidationResult,
// // } from "../isDisposableEmailCheck";

// // const NEXT_PUBLIC_FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
// // const NEXT_PUBLIC_RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// // export default function ContactPage() {
// //   const [status, setStatus] = useState({
// //     submitted: false,
// //     submitting: false,
// //     info: { error: false, msg: null as string | null },
// //   });

// //   const [inputs, setInputs] = useState({
// //     name: "",
// //     email: "",
// //     message: "",
// //   });

// //   const [captchaToken, setCaptchaToken] = useState<string | null>(null);
// //   const recaptchaRef = useRef<ReCAPTCHA>(null);

// //   // Enhanced email validation state
// //   const [emailState, setEmailState] = useState({
// //     isChecking: false,
// //     isDisposable: false,
// //     didYouMean: null as string | null,
// //     result: "",
// //     reason: "",
// //     success: false,
// //   });

// //   const handleServerResponse = ({ ok, msg }: { ok: boolean; msg: string }) => {
// //     if (ok) {
// //       setStatus({
// //         submitted: true,
// //         submitting: false,
// //         info: { error: false, msg },
// //       });
// //       setInputs({ name: "", email: "", message: "" });
// //       setCaptchaToken(null);
// //       recaptchaRef.current?.reset();
// //     } else {
// //       setStatus({
// //         submitted: false,
// //         submitting: false,
// //         info: { error: true, msg },
// //       });
// //     }
// //   };

// //   const handleOnChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
// //   ) => {
// //     setInputs((prev) => ({
// //       ...prev,
// //       [e.target.id]: e.target.value,
// //     }));
// //     setStatus({
// //       submitted: false,
// //       submitting: false,
// //       info: { error: false, msg: null },
// //     });
// //   };

// //   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     handleOnChange(e);

// //     const email = e.target.value;

// //     // Only check valid emails
// //     if (email && email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)) {
// //       // Show checking state
// //       setEmailState((prev) => ({ ...prev, isChecking: true }));

// //       // Make API call to check email and utilize full response
// //       isDisposableEmail(email).then((result: EmailValidationResult) => {
// //         setEmailState({
// //           isChecking: false,
// //           isDisposable: result.isDisposable,
// //           didYouMean: result.didYouMean,
// //           result: result.result,
// //           reason: result.reason || "",
// //           success: result.success,
// //         });
// //       });
// //     } else {
// //       // Reset email validation state
// //       setEmailState({
// //         isChecking: false,
// //         isDisposable: false,
// //         didYouMean: null,
// //         result: "",
// //         reason: "",
// //         success: false,
// //       });
// //     }
// //   };

// //   const handleOnCaptchaChange = (token: string | null) => {
// //     setCaptchaToken(token);
// //   };

// //   const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();

// //     if (!captchaToken) {
// //       handleServerResponse({ ok: false, msg: "Please complete the CAPTCHA." });
// //       return;
// //     }

// //     // Enhanced email validation checks
// //     if (emailState.isDisposable) {
// //       handleServerResponse({
// //         ok: false,
// //         msg: "Please use a permanent email address, not a temporary one.",
// //       });
// //       return;
// //     }

// //     if (
// //       emailState.result === "undeliverable" || emailState.result === "risky"
// //     ) {
// //       let errorMsg = "This email address may not be deliverable.";

// //       // Provide more specific error messages based on reason
// //       switch (emailState.reason) {
// //         case "invalid_domain":
// //           errorMsg = "This email domain does not exist.";
// //           break;
// //         case "rejected_email":
// //           errorMsg = "This email address does not exist.";
// //           break;
// //         case "low_quality":
// //           errorMsg = "This email appears to be low-quality or risky.";
// //           break;
// //         case "low_deliverability":
// //           errorMsg = "This email has deliverability issues.";
// //           break;
// //       }

// //       handleServerResponse({
// //         ok: false,
// //         msg: errorMsg,
// //       });
// //       return;
// //     }

// //     setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

// //     const payload = {
// //       ...inputs,
// //       "g-recaptcha-response": captchaToken,
// //     };

// //     try {
// //       const res = await fetch(`https://formspree.io/f/${NEXT_PUBLIC_FORMSPREE_ID}`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       const text = await res.text();
// //       handleServerResponse({ ok: res.ok, msg: text });
// //     } catch (error) {
// //       handleServerResponse({
// //         ok: false,
// //         msg: "Network error. Please check your connection and try again.",
// //       });
// //     }
// //   };

// //   // Check if the email is valid for submission
// //   const isEmailValid = !emailState.isDisposable &&
// //     emailState.result !== "undeliverable" &&
// //     emailState.result !== "risky";

// //   // Helper function to get the email validation message
// //   const getEmailValidationMessage = () => {
// //     if (emailState.isChecking) {
// //       return { text: "Checking email...", color: "text-gray-500" };
// //     }

// //     if (emailState.isDisposable) {
// //       return {
// //         text: "Please use a permanent email address, not a temporary one",
// //         color: "text-red-500",
// //       };
// //     }

// //     if (emailState.didYouMean) {
// //       return {
// //         text: `Did you mean ${emailState.didYouMean}?`,
// //         color: "text-amber-500",
// //         isSuggestion: true,
// //       };
// //     }

// //     if (emailState.result === "undeliverable") {
// //       switch (emailState.reason) {
// //         case "invalid_domain":
// //           return {
// //             text: "This email domain does not exist",
// //             color: "text-red-500",
// //           };
// //         case "rejected_email":
// //           return {
// //             text: "This email address does not exist",
// //             color: "text-red-500",
// //           };
// //         default:
// //           return {
// //             text: "This email address appears to be undeliverable",
// //             color: "text-red-500",
// //           };
// //       }
// //     }

// //     if (emailState.result === "risky") {
// //       if (emailState.reason === "low_quality") {
// //         return {
// //           text: "This email has quality issues that may make it risky",
// //           color: "text-amber-500",
// //         };
// //       }
// //       if (emailState.reason === "low_deliverability") {
// //         return {
// //           text: "This email has deliverability issues",
// //           color: "text-amber-500",
// //         };
// //       }
// //       return {
// //         text: "This email address appears to be risky",
// //         color: "text-amber-500",
// //       };
// //     }

// //     return null;
// //   };

// //   const validationMessage = getEmailValidationMessage();

// //   return (
// //     <div className="p-4 font-mono">
// //       <h2 className="text-xl font-bold mb-6">Get in Touch</h2>

// //       <form onSubmit={handleOnSubmit} className="space-y-4">
// //         <div>
// //           <label htmlFor="name" className="block mb-1">Name</label>
// //           <input
// //             type="text"
// //             id="name"
// //             value={inputs.name}
// //             onChange={handleOnChange}
// //             required
// //             className="w-full border border-black dark:border-white bg-transparent p-2"
// //           />
// //         </div>

// //         <div>
// //           <label htmlFor="email" className="block mb-1">Email</label>
// //           <input
// //             type="email"
// //             id="email"
// //             value={inputs.email}
// //             onChange={handleEmailChange}
// //             required
// //             pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
// //             title="Please enter a valid email address (e.g. name@example.com)"
// //             className="w-full border border-black dark:border-white bg-transparent p-2"
// //           />

// //           {/* Basic email format validation */}
// //           {inputs.email &&
// //             !inputs.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i) && (
// //             <p className="text-red-500 text-sm mt-1">
// //               Please enter a valid email address
// //             </p>
// //           )}

// //           {/* Enhanced email validation messages */}
// //           {inputs.email && validationMessage && (
// //             <p className={`${validationMessage.color} text-sm mt-1`}>
// //               {validationMessage.isSuggestion
// //                 ? (
// //                   <>
// //                     Did you mean{" "}
// //                     <span
// //                       className="font-medium underline cursor-pointer"
// //                       onClick={() =>
// //                         setInputs((prev) => ({
// //                           ...prev,
// //                           email: emailState.didYouMean || "",
// //                         }))}
// //                     >
// //                       {emailState.didYouMean}
// //                     </span>?
// //                   </>
// //                 )
// //                 : (
// //                   validationMessage.text
// //                 )}
// //             </p>
// //           )}
// //         </div>

// //         <div>
// //           <label htmlFor="message" className="block mb-1">Message</label>
// //           <textarea
// //             id="message"
// //             rows={4}
// //             value={inputs.message}
// //             onChange={handleOnChange}
// //             required
// //             className="w-full border border-black dark:border-white bg-transparent p-2"
// //           />
// //         </div>

// //         {NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
// //           <ReCAPTCHA
// //             sitekey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
// //             onChange={handleOnCaptchaChange}
// //             ref={recaptchaRef}
// //           />
// //         )}

// //         <button
// //           type="submit"
// //           disabled={status.submitting || !isEmailValid || !captchaToken}
// //           className="border border-black dark:border-white px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50"
// //         >
// //           {status.submitting ? "Sending..." : "Send Message"}
// //         </button>

// //         {status.submitted && (
// //           <p className="text-green-600 dark:text-green-400">
// //             Message sent successfully!
// //           </p>
// //         )}
// //         {status.info.error && (
// //           <p className="text-red-600 dark:text-red-400">
// //             {status.info.msg || "Error sending message."}
// //           </p>
// //         )}
// //       </form>
// //     </div>
// //   );
// // }

// Update the form to be more mobile-friendly
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const NEXT_PUBLIC_FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const NEXT_PUBLIC_RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function ContactPage() {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null as string | null },
  });

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleServerResponse = ({ ok, msg }: { ok: boolean; msg: string }) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
      setInputs({ name: "", email: "", message: "" });
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } else {
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg },
      });
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleOnCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      handleServerResponse({ ok: false, msg: "Please complete the CAPTCHA." });
      return;
    }

    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    const payload = {
      ...inputs,
      "g-recaptcha-response": captchaToken,
    };

    try {
      const res = await fetch(
        `https://formspree.io/f/${NEXT_PUBLIC_FORMSPREE_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const text = await res.text();
      handleServerResponse({ ok: res.ok, msg: text });
    } catch (error) {
      handleServerResponse({
        ok: false,
        msg: "Network error. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="p-2 md:p-4 font-mono">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
        Get in Touch
      </h2>
      <p className="mb-4 text-xs md:text-sm">
        You can reach out to me using the form below or connect with me on{" "}
        <a
          href="https://www.linkedin.com/in/manavvgarg"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600 dark:hover:text-gray-300"
        >
          LinkedIn
        </a>.
      </p>
      <form onSubmit={handleOnSubmit} className="space-y-3 md:space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-xs md:text-sm">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={inputs.name}
            onChange={handleOnChange}
            required
            className="w-full border border-black dark:border-white bg-transparent p-2 text-xs md:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-xs md:text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={inputs.email}
            onChange={handleOnChange}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address (e.g. name@example.com)"
            className="w-full border border-black dark:border-white bg-transparent p-2 text-xs md:text-sm"
          />

          {/* Basic email format validation */}
          {inputs.email &&
            !inputs.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i) && (
            <p className="text-red-500 text-xs mt-1">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block mb-1 text-xs md:text-sm">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={inputs.message}
            onChange={handleOnChange}
            required
            className="w-full border border-black dark:border-white bg-transparent p-2 text-xs md:text-sm"
          />
        </div>

        {/* Make reCAPTCHA responsive */}
        <div className="flex justify-center md:justify-start overflow-hidden">
          {NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <ReCAPTCHA
              sitekey={NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={handleOnCaptchaChange}
              ref={recaptchaRef}
              size="compact"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={status.submitting || !captchaToken}
          className="border border-black dark:border-white px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50 text-xs md:text-sm"
        >
          {status.submitting ? "Sending..." : "Send Message"}
        </button>

        {status.submitted && (
          <p className="text-green-600 dark:text-green-400 text-xs md:text-sm">
            Message sent successfully!
          </p>
        )}
        {status.info.error && (
          <p className="text-red-600 dark:text-red-400 text-xs md:text-sm">
            {status.info.msg || "Error sending message."}
          </p>
        )}
      </form>
    </div>
  );
}

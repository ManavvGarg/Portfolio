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

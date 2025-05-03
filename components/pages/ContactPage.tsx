import React, { useState } from "react";

// Using environment variables in Next.js
// The environment variable should be named NEXT_PUBLIC_FORMSPREE_ID in your .env file
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

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

  interface ServerResponseHandlerParams {
    ok: boolean;
    msg: string;
  }

  const handleServerResponse = (
    { ok, msg }: ServerResponseHandlerParams,
  ): void => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg },
      });
      setInputs({
        name: "",
        email: "",
        message: "",
      });
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
  ): void => {
    e.persist();
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

  interface ServerResponse {
    ok: boolean;
    msg: string;
  }

  interface FormInputs {
    name: string;
    email: string;
    message: string;
  }

  const handleOnSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));

    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });

    const text = await res.text();
    handleServerResponse({ ok: res.ok, msg: text });
  };

  return (
    <div className="p-4 font-mono">
      <h2 className="text-xl font-bold mb-6">Get in Touch</h2>

      <div className="text-sm">
        <p>
          Feel free to reach out via email using the form below, or connect with
          me on LinkedIn.
        </p>

        <form onSubmit={handleOnSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={inputs.name}
              onChange={handleOnChange}
              required
              className="w-full border border-black dark:border-white bg-transparent p-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={inputs.email}
              onChange={handleOnChange}
              required
              className="w-full border border-black dark:border-white bg-transparent p-2"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1">Message</label>
            <textarea
              id="message"
              rows={4}
              value={inputs.message}
              onChange={handleOnChange}
              required
              className="w-full border border-black dark:border-white bg-transparent p-2"
            />
          </div>

          <button
            type="submit"
            disabled={status.submitting}
            className="border border-black dark:border-white px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50"
          >
            {status.submitting ? "Sending..." : "Send Message"}
          </button>

          {status.submitted && (
            <p className="text-green-600 dark:text-green-400">
              Message sent successfully!
            </p>
          )}

          {status.info.error && (
            <p className="text-red-600 dark:text-red-400">
              Error sending message. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

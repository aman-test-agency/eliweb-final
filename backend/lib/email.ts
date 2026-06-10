import { Resend } from "resend";

const TO_EMAIL = "eliweb.in@gmail.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  const resend = getResend();
  await resend.emails.send({
    from: "EliWeb.in <onboarding@resend.dev>",
    to: TO_EMAIL,
    replyTo: data.email,
    subject: `New Contact Form Submission – ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  });
}

export async function sendEnquiryEmail(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const resend = getResend();
  await resend.emails.send({
    from: "EliWeb.in <onboarding@resend.dev>",
    to: TO_EMAIL,
    replyTo: data.email,
    subject: `New Enquiry Form Submission – ${data.name}`,
    html: `
      <h2>New Enquiry Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone ?? "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  });
}

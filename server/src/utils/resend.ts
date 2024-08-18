import { env } from '@config';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const getFromEmail = () => (env.isDev ? 'onboarding@resend.dev' : env.EMAIL_SENDER);

const getToEmail = (to: string) => (env.isDev ? 'delivered@resend.dev' : to);

export const sendMail = async ({ to, subject, text, html }: Params) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });

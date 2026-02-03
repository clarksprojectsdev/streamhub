import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl, CONTACT_EMAIL, LAST_LEGAL_UPDATE } from "@/lib/site";

export const metadata: Metadata = {
  title: "DMCA Takedown Policy",
  description: "DMCA takedown policy and procedures for copyright infringement claims.",
  alternates: { canonical: `${getBaseUrl()}/legal/dmca` },
};

export default function DMCAPage() {
  return (
    <>
      <h1>DMCA Takedown Policy</h1>
      <p className="text-sm text-zinc-400 mt-2">Last updated: {LAST_LEGAL_UPDATE}</p>

      <p>
        This website does not host, store, or transmit any audiovisual content. We operate as an
        affiliate and linking service that directs users to third-party content providers. We are
        committed to respecting intellectual property rights and responding to valid claims under
        the Digital Millennium Copyright Act (17 U.S.C. § 512).
      </p>

      <h2>Designated Agent</h2>
      <p>
        To submit a DMCA takedown notice or counter-notice, contact our designated agent at{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:text-accentHover">{CONTACT_EMAIL}</Link>.
      </p>

      <h2>Filing a Takedown Notice</h2>
      <p>
        If you believe that material on this website—or linked from this website—infringes your
        copyright, you may send a written notification to our designated agent. Your notice must
        include:
      </p>
      <ul>
        <li>Your physical or electronic signature</li>
        <li>Identification of the copyrighted work you claim has been infringed</li>
        <li>Identification of the material that is claimed to be infringing and information
            reasonably sufficient to permit us to locate the material (e.g., URL)</li>
        <li>Your contact information (address, telephone number, email)</li>
        <li>A statement that you have a good-faith belief that use of the material is not
            authorized by the copyright owner, its agent, or the law</li>
        <li>A statement that the information in the notification is accurate and, under penalty
            of perjury, that you are authorized to act on behalf of the copyright owner</li>
      </ul>

      <h2>Our Response</h2>
      <p>
        We will review valid notices and, where appropriate, remove or disable access to
        allegedly infringing material. Where content is hosted by third parties, we may remove
        or disable links to such content. We reserve the right to forward the notice and your
        contact information to any third party involved. We may terminate access for repeat
        infringers where applicable.
      </p>

      <h2>Counter-Notification</h2>
      <p>
        If you believe that material you posted was removed or disabled by mistake or
        misidentification, you may submit a counter-notification to our designated agent. The
        counter-notification must include your physical or electronic signature, identification
        of the material that was removed and its location before removal, a statement under
        penalty of perjury that you have a good-faith belief the material was removed by
        mistake, your name and contact information, and consent to the jurisdiction of the
        federal court for your judicial district (or if outside the United States, any judicial
        district in which we may be found).
      </p>

      <h2>No Legal Advice</h2>
      <p>
        This policy is for informational purposes only and does not constitute legal advice.
        Consult an attorney for advice specific to your situation.
      </p>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl, CONTACT_EMAIL, LAST_LEGAL_UPDATE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service governing use of this website.",
  alternates: { canonical: `${getBaseUrl()}/legal/terms` },
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Service</h1>
      <p className="text-sm text-zinc-400 mt-2">Last updated: {LAST_LEGAL_UPDATE}</p>

      <p>
        These Terms of Service (“Terms”) govern your access to and use of this website. By
        accessing or using the site, you agree to these Terms. If you do not agree, do not
        use the site.
      </p>

      <h2>Age Restriction</h2>
      <p>
        This website is intended only for adults. You must be at least 18 years of age (or
        the age of majority in your jurisdiction, if higher) to access or use this site. By
        using the site, you represent and warrant that you meet this age requirement. We
        do not knowingly collect information from anyone under 18. If you are under 18, you
        must leave this site immediately. We reserve the right to block access and to
        cooperate with authorities in the event of suspected underage use.
      </p>

      <h2>Nature of the Service</h2>
      <p>
        This website does not host, store, or stream any audiovisual content. We operate as
        an affiliate and linking service. We provide links, thumbnails, and descriptions that
        direct you to third-party websites and platforms. We do not control and are not
        responsible for the content, policies, or practices of those third-party sites. Your
        use of third-party sites is at your own risk and subject to their terms and policies.
      </p>

      <h2>Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the site if you are under 18 or the age of majority in your jurisdiction</li>
        <li>Violate any applicable law or regulation</li>
        <li>Infringe the intellectual property or other rights of others</li>
        <li>Transmit malware, spam, or any harmful or unlawful content</li>
        <li>Attempt to gain unauthorized access to the site, its systems, or any third-party
            data</li>
        <li>Use the site for any purpose that is illegal or prohibited by these Terms</li>
      </ul>

      <h2>Disclaimer of Warranties</h2>
      <p>
        The site and all content and links are provided “as is” and “as available” without
        warranties of any kind, express or implied. We disclaim all warranties, including
        implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement. We do not warrant that the site will be uninterrupted, error-free,
        or free of harmful components. Your use of the site and any third-party links is at
        your sole risk.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, we and our affiliates, officers, directors,
        employees, and agents shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or any loss of profits, data, or use, arising
        from or related to your use of the site or any linked third-party content, even if we
        have been advised of the possibility of such damages. Our total liability for any
        claims arising from these Terms or your use of the site shall not exceed the amount
        you paid to us, if any, in the twelve (12) months preceding the claim, or one
        hundred dollars ($100), whichever is greater. Some jurisdictions do not allow the
        exclusion or limitation of certain damages; in such jurisdictions, our liability
        will be limited to the maximum extent permitted by law.
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless the operator of this site and its
        affiliates, officers, directors, employees, and agents from and against any claims,
        damages, losses, liabilities, and expenses (including reasonable attorneys’ fees)
        arising from your use of the site, your violation of these Terms, or your violation
        of any third-party rights.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        The site contains links to third-party websites. We do not endorse and are not
        responsible for the content, privacy practices, or terms of those sites. Your
        interactions with third parties are solely between you and them.
      </p>

      <h2>Changes to the Terms</h2>
      <p>
        We may modify these Terms at any time. The “Last updated” date will be revised when
        changes are posted. Your continued use of the site after changes constitutes
        acceptance of the revised Terms. If you do not agree to the new Terms, you must stop
        using the site.
      </p>

      <h2>General</h2>
      <p>
        These Terms constitute the entire agreement between you and us regarding the site.
        If any provision is held unenforceable, the remaining provisions will remain in
        effect. Our failure to enforce any right does not waive that right. Applicable
        law and jurisdiction apply.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these Terms, please contact us at{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:text-accentHover">{CONTACT_EMAIL}</Link>.
      </p>
    </>
  );
}

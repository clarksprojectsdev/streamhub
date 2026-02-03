import type { Metadata } from "next";
import Link from "next/link";
import { getBaseUrl, CONTACT_EMAIL, LAST_LEGAL_UPDATE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy describing how we collect, use, and protect your information.",
  alternates: { canonical: `${getBaseUrl()}/legal/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-zinc-400 mt-2">Last updated: {LAST_LEGAL_UPDATE}</p>

      <p>
        This Privacy Policy describes how we collect, use, and disclose information when you
        use this website. We do not host adult content; we provide links and referrals to
        third-party content providers. By using this site, you agree to the practices described
        below.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect information you provide directly (e.g., if you contact us) and
        information collected automatically when you visit, such as device and browser
        information, IP address, and usage data.
      </p>

      <h2>Cookies</h2>
      <p>
        We and our service providers may use cookies and similar technologies (e.g., local
        storage) to operate the site, remember your preferences (such as age verification
        status), and analyze traffic. You can control cookies through your browser settings;
        disabling certain cookies may limit site functionality.
      </p>

      <h2>Analytics</h2>
      <p>
        We may use third-party analytics services to understand how visitors use the site
        (e.g., pages viewed, referral sources). These services may collect identifiers and
        usage data and may use cookies. Analytics data is used in aggregated form to improve
        the site and is not sold to third parties for marketing.
      </p>

      <h2>Affiliate Links</h2>
      <p>
        This site contains affiliate links to third-party content providers. When you click
        an affiliate link and visit or transact on a third-party site, that third party may
        collect information about you and may set its own cookies. We may receive referral or
        commission data (e.g., that a visit or conversion occurred) from affiliate programs,
        but we do not receive or store your personal data from those third-party sites. The
        privacy practices of linked sites are governed by their own policies; we encourage
        you to read them.
      </p>

      <h2>How We Use Information</h2>
      <p>
        We use collected information to operate and improve the site, enforce our terms,
        comply with law, and for the purposes described above (e.g., analytics, age
        verification).
      </p>

      <h2>Sharing and Disclosure</h2>
      <p>
        We may share information with service providers that assist in operating the site
        (e.g., hosting, analytics), as required by law, or to protect rights and safety. We
        do not sell your personal information.
      </p>

      <h2>Data Retention and Security</h2>
      <p>
        We retain information as long as needed for the purposes described in this policy or
        as required by law. We use reasonable measures to protect data; no method of
        transmission or storage is completely secure.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your
        data or to object to certain processing. Contact us at{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:text-accentHover">{CONTACT_EMAIL}</Link> for
        requests.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last updated” date at the
        top will be revised when changes are made. Continued use of the site after changes
        constitutes acceptance of the updated policy.
      </p>
    </>
  );
}

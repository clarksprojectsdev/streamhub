import type { Metadata } from "next";
import { getBaseUrl, LAST_LEGAL_UPDATE } from "@/lib/site";

export const metadata: Metadata = {
  title: "18 U.S.C. § 2257 Compliance Statement",
  description: "Statement regarding 18 U.S.C. § 2257 and record-keeping requirements.",
  alternates: { canonical: `${getBaseUrl()}/legal/2257` },
};

export default function Compliance2257Page() {
  return (
    <>
      <h1>18 U.S.C. § 2257 Compliance Statement</h1>
      <p className="text-sm text-zinc-400 mt-2">Last updated: {LAST_LEGAL_UPDATE}</p>

      <p>
        This statement describes the nature of this website’s operations and its position with
        respect to the federal record-keeping requirements under 18 U.S.C. § 2257 and the
        associated regulations.
      </p>

      <h2>Nature of This Website</h2>
      <p>
        This website does <strong>not</strong> produce, create, or publish any visual depictions
        of actual or simulated sexually explicit conduct. This website does <strong>not</strong>{" "}
        host, store, or stream any video or other media content. We operate solely as an
        affiliate and linking service. We provide links, thumbnails, and descriptions that
        direct users to third-party websites and platforms where content is hosted and
        displayed.
      </p>

      <h2>No Custody or Control of Content</h2>
      <p>
        All audiovisual content accessible through third-party links from this site is produced,
        hosted, and made available by those third parties. We have no custody or control over
        such content. We do not determine, supervise, or participate in the creation,
        storage, or distribution of that content.
      </p>

      <h2>Compliance Responsibility</h2>
      <p>
        Compliance with 18 U.S.C. § 2257 and its implementing regulations, including the
        maintenance and availability of required records (e.g., performer identity and age
        documentation), is the sole responsibility of the third-party content producers and
        content providers that create and host such materials. Any inquiries regarding
        record-keeping or compliance for specific content should be directed to those
        third-party producers or hosting platforms.
      </p>

      <h2>Disclaimer</h2>
      <p>
        This statement is made for the purpose of clarifying our role and is not intended as
        legal advice. Requirements may vary by jurisdiction. If you have questions about
        compliance obligations, please consult qualified legal counsel.
      </p>
    </>
  );
}

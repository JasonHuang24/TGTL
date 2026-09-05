import type { Hotline } from "@/content/hotlines";

function contactHref(contact: string): string | null {
  if (contact.startsWith("findahelpline")) return "https://findahelpline.com/";
  // Dialable if it's mostly digits/spaces/dashes/parens.
  const digits = contact.replace(/[^0-9]/g, "");
  if (digits.length >= 3 && /^[0-9()\-\s.]+$/.test(contact)) {
    return "tel:" + digits;
  }
  return null;
}

/**
 * Renders hotline numbers from the fixture (§5.1). Numbers are prominent; a
 * phone number becomes a `tel:` link (a sanctioned contact link) and
 * findahelpline.com becomes a web link the reader chooses to follow.
 */
export function HotlineList({ hotlines }: { hotlines: Hotline[] }) {
  return (
    <ul className="hotline-list">
      {hotlines.map((h) => {
        const href = contactHref(h.contact);
        return (
          <li key={h.id} className="hotline">
            <span className="hotline-contact">
              {href ? (
                <a href={href} rel="noopener noreferrer">
                  {h.contact}
                </a>
              ) : (
                h.contact
              )}
            </span>
            <span className="hotline-detail">
              <span className="hotline-label">{h.label}</span>
              <span className="hotline-regions">
                {h.regions}
                {h.availability ? ` · ${h.availability}` : ""}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, MessageCircle } from "lucide-react";
import { useSiteConfig } from "@/hooks/useAdminData";

const Footer = () => {
  const { data: siteConfig } = useSiteConfig();
  const logoUrl = siteConfig?.logo_url || "/logo-nityodin.svg";
  const siteTitle = siteConfig?.site_title || "নিত্যদিন Nityodin";
  const siteDescription = siteConfig?.site_description || "";
  const phoneNumber = siteConfig?.phone_number || "";
  const whatsappNumber = siteConfig?.whatsapp_number || "";
  const whatsappDigits = whatsappNumber.replace(/[^\d]/g, "");
  const facebookLink = siteConfig?.facebook_link || "";

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoUrl} alt={siteTitle} className="w-10 h-10 rounded-full" />
              <div>
                <h2 className="text-lg font-bold text-primary">{siteTitle}</h2>
                <p className="text-[10px] text-muted-foreground">{siteDescription}</p>
              </div>
            </Link>
            {siteDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {siteDescription}
              </p>
            )}
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {facebookLink && (
                <a
                  href={facebookLink}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2.5">
              {[
                { name: "সকল পণ্য", href: "/shop" },
                { name: "আমাদের সম্পর্কে", href: "/about" },
                { name: "যোগাযোগ", href: "/contact" },
                { name: "ব্লগ", href: "/blog" },
              ]
                .concat(
                  siteConfig?.show_faq_link !== false
                    ? [{ name: "FAQ", href: "/faq" }]
                    : [],
                )
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">গ্রাহক সেবা</h3>
            <ul className="space-y-2.5">
              {[
                { name: "আমার অর্ডার", href: "/account" },
                { name: "অর্ডার ট্র্যাকিং", href: "/track-order" },
                { name: "রিটার্ন পলিসি", href: "/return-policy" },
                { name: "শিপিং পলিসি", href: "/shipping-policy" },
                { name: "টার্মস & কন্ডিশন", href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">যোগাযোগ</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={phoneNumber ? `tel:${phoneNumber}` : "#"}
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{phoneNumber}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappDigits ? `https://wa.me/${whatsappDigits}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{whatsappNumber ? `WhatsApp: ${whatsappNumber}` : ""}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@organicstore.com"
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>info@organicstore.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
            
            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground mb-2">পেমেন্ট পদ্ধতি</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">ক্যাশ অন ডেলিভারি</span>
                <span className="px-2 py-1 bg-muted rounded">bKash</span>
                <span className="px-2 py-1 bg-muted rounded">Nagad</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>
              {siteConfig?.footer_copyright
                ? siteConfig.footer_copyright
                : `© ${new Date().getFullYear()} ${siteTitle}। সর্বস্বত্ব সংরক্ষিত।`}
            </p>
            <p className="text-xs">ডেভলাপার - ইফতিকার রহমান</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

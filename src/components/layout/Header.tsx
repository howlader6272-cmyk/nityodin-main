import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, Phone, PackageSearch, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopNotificationBar from "@/components/layout/TopNotificationBar";
import { useSiteConfig } from "@/hooks/useAdminData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  cartCount?: number;
}

const Header = ({ cartCount = 0 }: HeaderProps) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: siteConfig } = useSiteConfig();

  const phoneNumber = siteConfig?.phone_number || "";
  const whatsappNumber = siteConfig?.whatsapp_number || "";
  const whatsappDigits = useMemo(
    () => whatsappNumber.replace(/[^\d]/g, ""),
    [whatsappNumber],
  );
  const logoUrl = siteConfig?.logo_url || "/logo-nityodin.svg";
  const siteTitle = siteConfig?.site_title || "নিত্যদিন Nityodin";
  const siteDescription = siteConfig?.site_description || "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "হোম", href: "/" },
    { name: "সকল পণ্য", href: "/shop" },
    { name: "আমাদের সম্পর্কে", href: "/about" },
    { name: "যোগাযোগ", href: "/contact" },
    { name: "অর্ডার ট্র্যাক", href: "/track-order", icon: PackageSearch },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <TopNotificationBar />
      {/* Contact bar */}
      <div className="hidden md:block bg-muted/50 border-b border-border">
        <div className="container flex items-center justify-between py-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <a
              href={phoneNumber ? `tel:${phoneNumber}` : "#"}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{phoneNumber}</span>
            </a>
            <a
              href={whatsappDigits ? `https://wa.me/${whatsappDigits}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{whatsappNumber ? `WhatsApp: ${whatsappNumber}` : ""}</span>
            </a>
          </div>
          <p className="text-xs">{siteDescription}</p>
        </div>
      </div>

      {/* Main header */}
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <img src={logoUrl} alt={siteTitle} className="h-6 w-6 rounded-full" />
                  {siteTitle}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logoUrl} alt={siteTitle} className="w-10 h-10 rounded-full" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary leading-tight">{siteTitle}</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">{siteDescription}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
              <Input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                className="w-64 pr-10 bg-muted/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3">
                <Search className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </form>

            {/* Search - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account */}
            <Link to="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="lg:hidden pb-4 animate-slide-in-up">
            <div className="relative">
              <Input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                className="w-full pr-10 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};

export default Header;

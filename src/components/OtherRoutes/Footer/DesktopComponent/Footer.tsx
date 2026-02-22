"use client"
import "../Footer.css"
import { footerContent } from "../CommonValues"
import Link from "next/link"
const Footer = () => {
    // Social icon helper
    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "instagram":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                );
            case "facebook":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                );
            case "twitter":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                );
            case "youtube":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.42-5.58z"></path>
                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
                    </svg>
                );
            default:
                return null;
        }
    };
    // Payment icon helper
    const getPaymentIcon = (iconName: string) => {
        switch (iconName.toLowerCase()) {
            case "visa":
                return (
                    <svg viewBox="0 0 24 24" fill="#1A1F71">
                        <path d="M13.8 15h.6l.4-2.5h-.6l-.4 2.5zm1.5-2.5c-.3 0-.5.1-.6.3l-1.1 2.2h.7l.2-.5h.8l.1.5h.7l-.8-2.5zm-2.8 0h.7l.4 2.5h-.7L12.5 12.5zm-2 0l-.3 1.7-.8-1.7h-.8l1.3 2.5h.7l1-2.5h-.8z" />
                        <path d="M1 4h22v16H1V4zm21 15V5H2v14h20z" />
                    </svg>
                );
            case "mastercard":
                return (
                    <svg viewBox="0 0 24 24">
                        <circle cx="9" cy="12" r="5" fill="#EB001B" />
                        <circle cx="15" cy="12" r="5" fill="#F79E1B" fillOpacity="0.8" />
                    </svg>
                );
            case "amex":
                return (
                    <svg viewBox="0 0 24 24" fill="#007BC1">
                        <rect width="24" height="24" rx="2" />
                        <text x="2" y="15" fill="white" fontSize="8" fontWeight="bold">AMEX</text>
                    </svg>
                );
            case "gpay":
                return (
                    <svg viewBox="0 0 24 24">
                        <path d="M12 4.14c1.85 0 3.09.79 3.8 1.45L18.47 3c-1.74-1.61-4.01-2.59-6.47-2.59C7.48.41 3.51 3.31 1.78 7.5l3.52 2.74C6.13 7.03 8.84 4.14 12 4.14z" fill="#EA4335" />
                        <path d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.51-1.13 2.78-2.4 3.63l3.74 2.9c2.19-2.02 3.45-5 3.45-8.66z" fill="#4285F4" />
                        <path d="M5.3 13.76c-.23-.69-.36-1.43-.36-2.19 0-.76.13-1.5.36-2.19L1.78 6.64c-.79 1.59-1.24 3.38-1.24 5.27s.45 3.68 1.24 5.27l3.52-2.74z" fill="#FBBC05" />
                        <path d="M12 23.59c3.12 0 5.73-1.03 7.64-2.8l-3.74-2.9c-1.04.7-2.38 1.11-3.9 1.11-3.16 0-5.87-2.15-6.84-5.06l-3.52 2.74c1.73 4.18 5.7 7.08 10.27 7.08z" fill="#34A853" />
                    </svg>
                );
            case "phonepe":
                return (
                    <svg viewBox="0 0 24 24" fill="#5f259f">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V8c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z" />
                    </svg>
                );
            case "paytm":
                return (
                    <svg viewBox="0 0 24 24">
                        <path d="M2 4h20v16H2V4z" fill="#00BAF2" />
                        <text x="4" y="16" fill="white" fontSize="8" fontWeight="bold">Paytm</text>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <footer id="MainFooter" className="PaddingTop30 PaddingBottom20">
            <div className="MaxWidthComponent MarginAuto">
                <div className="FooterTopGrid PaddingBottom30">
                    {/* Brand Section */}
                    <div className="FooterBrandCol">
                        <div className="FooterLogoContainer">
                            <img src={footerContent.brand.logo} alt="Bucketlistt Logo" className="FooterLogo" />
                        </div>
                        <p className="FooterBrandDesc">{footerContent.brand.description}</p>
                        <p className="FooterBrandSlogan">"{footerContent.brand.slogan}"</p>
                        <div className="FooterSocials">
                            {footerContent.socials.map((social) => (
                                <Link key={social.platform} href={social.href} target="_blank" rel="noopener noreferrer" className="SocialIcon">
                                    {getSocialIcon(social.platform)}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerContent.sections.map((section) => (
                        <div key={section.title} className="FooterNavCol">
                            <h4 className="FooterColHeading">{section.title}</h4>
                            <ul className="FooterLinkList">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="FooterLink">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Column */}
                    <div className="FooterNavCol">
                        <h4 className="FooterColHeading">{footerContent.contact.title}</h4>
                        <div className="FooterContactInfo">
                            <p className="ContactItem">
                                <strong>Email:</strong> {footerContent.contact.email}
                            </p>
                            <p className="ContactItem">
                                <strong>Phone:</strong> {footerContent.contact.phone}
                            </p>
                            <p className="ContactItem">
                                <strong>Address:</strong> <br /> {footerContent.contact.address}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="FooterBottomBar">
                    <div className="FooterBottomLeft">
                        <p className="CopyrightText">{footerContent.copyright}</p>
                        <div className="BottomLinks">
                            {footerContent.bottomLinks.map((link) => (
                                <Link key={link.label} href={link.href} className="BottomLink">{link.label}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="FooterBottomRight">
                        <div className="PaymentIcons">
                            {footerContent.paymentIcons.map((pay) => (
                                <div key={pay.name} className={`PaymentIcon ${pay.icon}`}>
                                    {getPaymentIcon(pay.icon)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

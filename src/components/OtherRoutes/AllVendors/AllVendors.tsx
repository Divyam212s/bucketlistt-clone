"use client";

import VendorCard from "@/components/CommonComponents/VendorCard/VendorCard";
import { allVendorsSectionTitle, allVendorsCards } from "./CommonValues";
import "@/components/CommonComponents/VendorCard/VendorCard.css";

export default function AllVendors() {
    return (
        <section className="MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom50">
            <h2 className="SecondaryHeadingFont MarginBottom20">{allVendorsSectionTitle}</h2>
            <div className="VendorCardsGrid">
                {allVendorsCards.map((card) => (
                    <VendorCard
                        key={card.id}
                        imageUrl={card.imageUrl}
                        title={card.title}
                        description={card.description}
                        price={card.price}
                        href={card.href}
                    />
                ))}
            </div>
        </section>
    );
}

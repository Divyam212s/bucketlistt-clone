"use client";

import {
  CREATORS_HEADING_LINE1,
  CREATORS_HEADING_LINE2,
  CREATORS_ILLUSTRATION_CAPTION,
  CREATORS_RIGHT_CAPTION,
  CREATORS_BODY,
  CREATORS_PRIMARY_CTA,
  CREATORS_SECONDARY_CTA,
  CREATORS_COUNT,
  CREATORS_AVATARS,
  CREATORS_RIGHT_IMAGES,
} from "./CommonValues";
import "./CreatorsSection.css";
import Link from "next/link";

export default function CreatorsSection() {
  return (
    <section className="CreatorsSection">
      <div className="CreatorsSectionInner MaxWidthComponent MarginAuto">
        {/* Left: Heading + Adventure illustration */}
        <div className="CreatorsSectionLeft">
          <h2 className="SecondaryHeadingFont">{CREATORS_HEADING_LINE1}<br />{CREATORS_HEADING_LINE2}</h2>
          <div className="CreatorsSectionIllustrationWrap">
            {/* Floating decorative elements */}
            <div className="CreatorsSectionFloat CreatorsSectionFloat1" aria-hidden />
            <div className="CreatorsSectionFloat CreatorsSectionFloat2" aria-hidden />
            <div className="CreatorsSectionCircle">
              <span className="CreatorsSectionCirclePlay" aria-hidden>▶</span>
              <span className="CreatorsSectionCircleText">no limit for enjoy set</span>
            </div>
            <div className="CreatorsSectionCurve" aria-hidden>
              <svg viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M 0 35 Q 40 5 80 10" />
              </svg>
              <span className="CreatorsSectionPointer">☞</span>
            </div>
            {/* Central illustration: adventure activities */}
            <div className="CreatorsSectionIllustrationBlock">
              <img
                src="/CreatorsSectionIllustration.png"
                alt="Creators section - Experience the world's best adventure activities: ziplining, canoeing and hiking"
                className="CreatorsSectionIllustrationImg"
              />
              {/* <div className="CreatorsSectionBadge">
                <span className="CreatorsSectionBadgeCaption">{CREATORS_ILLUSTRATION_CAPTION}</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right: Content + creator circles + buttons */}
        <div className="CreatorsSectionRight">
          <div className="CreatorsSectionImageCluster">
            {CREATORS_RIGHT_IMAGES.map((src, i) => (
              <div key={i} className="CreatorsSectionImageCard" style={{ zIndex: CREATORS_RIGHT_IMAGES.length - i }}>
                <img src={src} alt={`Creators section - anywhere you gather destination ${i + 1}`} />
              </div>
            ))}
          </div>
          <p className="CreatorsSectionRightCaption">{CREATORS_RIGHT_CAPTION}</p>
          <div className="CreatorsSectionCreatorsRow">
            <div className="CreatorsSectionAvatars">
              {CREATORS_AVATARS.map((src, i) => (
                <div key={i} className="CreatorsSectionAvatar" style={{ marginLeft: i > 0 ? -10 : 0 }}>
                  <img src={src} alt={`Creators section - community member ${i + 1}`} />
                </div>
              ))}
            </div>
            <div className="CreatorsSectionCountBadge">{CREATORS_COUNT}</div>
          </div>
          <p className="CreatorsSectionBody">{CREATORS_BODY}</p>
          <div className="CreatorsSectionActions">
            <Link href="/creators"><button type="button" className="CreatorsSectionPrimaryBtn">{CREATORS_PRIMARY_CTA}</button></Link>
            {/* <button type="button" className="CreatorsSectionSecondaryBtn">{CREATORS_SECONDARY_CTA}</button> */}
          </div>
        </div>
      </div>
    </section>
  );
}

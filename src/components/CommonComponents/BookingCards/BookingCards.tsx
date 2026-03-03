"use client";

import type { BookingActivityItem, PerActivityBooking, ParticipantDetails } from "@/app/experiences/cart/CommonValues";
import { formatPriceShort, getDiscountPercent, TIME_SLOTS } from "@/app/experiences/cart/CommonValues";
import "./BookingCards.css";

export interface BookingCardProps {
  activity: BookingActivityItem;
  index: number;
  booking: PerActivityBooking;
  datePills: { value: string; day: string; label: string }[];
  onUpdateDate: (activityId: string, date: string) => void;
  onUpdateSlot: (activityId: string, slot: string) => void;
  onOpenCalendar: (activityId: string) => void;
  onAddParticipant: (activityId: string, activityTitle: string) => void;
  onEditParticipant: (activityId: string, activityTitle: string, participantIndex: number) => void;
  onRemoveParticipant: (activityId: string, participantIndex: number) => void;
  onRemoveActivity?: (activityId: string, activityTitle: string) => void;
  onTicketCountChange?: (activityId: string, delta: number) => void;
  onCopyFromFirst?: (activityId: string) => void;
  isFirst: boolean;
}

function hasParticipantDetails(p: ParticipantDetails): boolean {
  return !!(p.userName?.trim() && p.userEmail?.trim() && p.userPhone?.trim());
}

export default function BookingCard({
  activity,
  index,
  booking,
  datePills,
  onUpdateDate,
  onUpdateSlot,
  onOpenCalendar,
  onAddParticipant,
  onEditParticipant,
  onRemoveParticipant,
  onRemoveActivity,
  onTicketCountChange,
  onCopyFromFirst,
  isFirst,
}: BookingCardProps) {
  const participants = booking.participants ?? [];
  const ticketCount = Math.max(1, booking.ticketCount ?? 1);
  const singleParticipant = participants[0];
  const hasParticipant = singleParticipant && hasParticipantDetails(singleParticipant);

  return (
    <div className="BookingActivityCard">
      <div className="BookingActivityCardHead">
        <div className="BookingActivityCardHeadTop">
          <span className="BookingActivityCardBadge">Activity {index + 1}</span>
          {onRemoveActivity && (
            <button
              type="button"
              className="BookingActivityRemoveCardBtn"
              onClick={() => onRemoveActivity(activity.id, activity.title)}
              aria-label="Remove activity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <div className="BookingActivityCardSummary">
          <div className="BookingActivityCardThumb">
            <img src={activity.image} alt={`Booking - ${activity.title}${activity.location ? ` in ${activity.location}` : ""}`} />
          </div>
          <div className="BookingActivityCardInfo">
            <span className="BookingActivityCardCategory">{activity.category}</span>
            <h2 className="BookingActivityCardTitle">{activity.title}</h2>
            <p className="BookingActivityCardLocation">{activity.location}</p>
            <div className="BookingActivityCardPrice">
              <div className="BookingActivityCardPriceLeft">
                <span className="BookingActivityCardPriceOriginal">₹{activity.originalPrice.toLocaleString()}</span>
                <span className="BookingActivityCardPriceCurrent">{formatPriceShort(activity.price)}</span>
              </div>
              {getDiscountPercent(activity.originalPrice, activity.price) != null && (
                <span className="BookingActivityCardDiscountTag">
                  {getDiscountPercent(activity.originalPrice, activity.price)}% off
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="BookingActivityCardBody">
        <div className="BookingActivityDateSection">
          <span className="BookingActivitySectionLabel">Select a date</span>
          <div className="BookingActivityDateRow">
            <div className="BookingActivityDatePills">
              {datePills.map((pill) => (
                <button
                  key={pill.value}
                  type="button"
                  className={`BookingActivityDatePill ${booking.date === pill.value ? "BookingActivityDatePillSelected" : ""}`}
                  onClick={() => onUpdateDate(activity.id, pill.value)}
                >
                  <span className="BookingActivityDatePillDay">{pill.day}</span>
                  <span className="BookingActivityDatePillDate">{pill.label}</span>
                </button>
              ))}
            </div>
            <button type="button" className="BookingActivityMoreDates" onClick={() => onOpenCalendar(activity.id)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>More dates</span>
            </button>
          </div>
        </div>

        <div className="BookingActivitySlotSection">
          <span className="BookingActivitySectionLabel">Select time slot</span>
          {!booking.date && (
            <p className="BookingActivitySlotHint">Select a date above to unlock time slots</p>
          )}
          <div className={`BookingActivitySlotChips ${!booking.date ? "BookingActivitySlotChipsLocked" : ""}`}>
            {TIME_SLOTS.map((slot) => {
              const slotsLocked = !booking.date;
              return (
                <button
                  key={slot}
                  type="button"
                  className={`BookingActivitySlotChip ${booking.slot === slot ? "BookingActivitySlotChipSelected" : ""} ${slotsLocked ? "BookingActivitySlotChipLocked" : ""}`}
                  onClick={() => !slotsLocked && onUpdateSlot(activity.id, slot)}
                  disabled={slotsLocked}
                  title={slotsLocked ? "Select a date first" : undefined}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="BookingActivityParticipantSection">
          <span className="BookingActivitySectionLabel">Participant details</span>
          <div className="BookingActivityParticipantList">
            {hasParticipant ? (
              <div className="BookingActivityParticipantSummary">
                <span className="BookingActivityParticipantSummaryName">{singleParticipant!.userName}</span>
                <span className="BookingActivityParticipantSummaryContact">{singleParticipant!.userEmail} · {singleParticipant!.userPhone}</span>
                <div className="BookingActivityParticipantSummaryActions">
                  <button
                    type="button"
                    className="BookingActivityParticipantEdit"
                    onClick={() => onEditParticipant(activity.id, activity.title, 0)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="BookingActivityParticipantDelete"
                    onClick={() => onRemoveParticipant(activity.id, 0)}
                    aria-label="Remove participant"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : null}
            {hasParticipant && onTicketCountChange && (
              <div className="BookingActivityTicketCounter">
                <span className="BookingActivitySectionLabel">Tickets</span>
                <div className="BookingActivityTicketCounterControls">
                  <button
                    type="button"
                    className="BookingActivityTicketCounterBtn"
                    onClick={() => onTicketCountChange(activity.id, -1)}
                    disabled={ticketCount <= 1}
                    aria-label="Decrease tickets"
                  >
                    −
                  </button>
                  <span className="BookingActivityTicketCounterValue">{ticketCount}</span>
                  <button
                    type="button"
                    className="BookingActivityTicketCounterBtn"
                    onClick={() => onTicketCountChange(activity.id, 1)}
                    disabled={ticketCount >= 99}
                    aria-label="Increase tickets"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <div className="BookingActivityParticipantActions">
              {!hasParticipant && (
                <button
                  type="button"
                  className="BookingActivityParticipantBtn"
                  onClick={() => onAddParticipant(activity.id, activity.title)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  Add participant details
                </button>
              )}
              {!isFirst && onCopyFromFirst && (
                <button type="button" className="BookingActivityCopyBtn" onClick={() => onCopyFromFirst(activity.id)}>
                  Same as Activity 1
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

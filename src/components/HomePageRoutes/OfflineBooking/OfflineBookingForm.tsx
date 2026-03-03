"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import {
  getDatePills,
  getMonthGrid,
  toISODate,
  isPastDate,
  DAYS,
  MONTHS_FULL,
} from "@/app/experiences/cart/CommonValues";
import {
  OFFLINE_ACTIVITIES,
  OFFLINE_TIMESLOTS,
  DUMMY_ACTIVITY_IMAGE,
  defaultSingleActivityBooking,
  type SingleActivityBooking,
} from "./CommonValues";
import "./OfflineBookingForm.css";

function formatRupee(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatDateDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}
function isValidIndianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  const n = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  return n.length === 10 && /^\d{10}$/.test(n);
}

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.7 2.81 2.11 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function OfflineBookingForm() {
  const router = useRouter();
  const [bookings, setBookings] = useState<SingleActivityBooking[]>(() => [
    defaultSingleActivityBooking(),
  ]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());
  const [calendarForIndex, setCalendarForIndex] = useState(0);

  const datePills = getDatePills(7);

  const updateBooking = (index: number, patch: Partial<SingleActivityBooking>) => {
    setBookings((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  const addBooking = () => setBookings((prev) => [...prev, defaultSingleActivityBooking()]);

  const removeBooking = (index: number) => {
    if (bookings.length <= 1) return;
    setBookings((prev) => prev.filter((_, i) => i !== index));
  };

  const copyFromFirst = (index: number) => {
    if (index === 0 || !bookings[0]) return;
    const first = bookings[0];
    updateBooking(index, { fullName: first.fullName, phone: first.phone, email: first.email });
  };

  const openCalendar = (index: number) => {
    const b = bookings[index];
    if (b?.date) {
      const [y, m] = b.date.split("-").map(Number);
      setCalendarViewDate(new Date(y, m - 1, 1));
    } else setCalendarViewDate(new Date());
    setCalendarForIndex(index);
    setCalendarOpen(true);
  };

  const handleCalendarDateSelect = (isoDate: string) => {
    updateBooking(calendarForIndex, { date: isoDate, slot: "" });
    setCalendarOpen(false);
  };

  const calendarPrevMonths = () => setCalendarViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const calendarNextMonths = () => setCalendarViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));

  const validateBooking = (b: SingleActivityBooking): { fullName: string; phone: string; email: string } => {
    const fullName = !b.fullName.trim() ? "Required" : "";
    const phone = !b.phone.trim() ? "Required" : !isValidIndianPhone(b.phone) ? "Valid 10-digit number" : "";
    const email = b.email.trim() && !isValidEmail(b.email) ? "Valid email" : "";
    return { fullName, phone, email };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    bookings.forEach((b, i) => {
      const err = validateBooking(b);
      if (err.fullName || err.phone || err.email) valid = false;
    });
    if (!valid) return; // Could set per-card errors; for now just block submit
    router.replace("/bookings");
  };

  const grandTotal = bookings.reduce((sum, b) => sum + (b.amountPerPerson ?? 0) * b.participants, 0);

  return (
    <div className="OfflineBookingForm MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom50">
      <div className="OfflineBookingFormHeader">
        <h1 className="OfflineBookingFormTitle">Create Offline Booking</h1>
        <p className="OfflineBookingFormSubtitle">Fill the form below to create an offline booking.</p>
      </div>

      <form onSubmit={handleSubmit} className="OfflineBookingFormMultiGrid">
        <div className="OfflineBookingFormCardsWrap">
          <div className="OfflineBookingActivityCardsGrid">
          {bookings.map((booking, index) => {
            const exp = OFFLINE_ACTIVITIES.find((a) => a.id === booking.activityId);
            const variants = exp?.variants ?? [];
            const variantLabel = variants.find((v) => v.id === booking.variantId)?.label ?? exp?.label ?? "";
            const activityTypeSelected = variants.length > 0 ? !!booking.variantId : !!booking.activityId;
            const dateEnabled = activityTypeSelected;
            const slotsEnabled = !!booking.date.trim();
            const amountPerPerson = booking.amountPerPerson ?? 0;

            return (
              <div key={index} className="OfflineBookingActivityCard">
                <div className="OfflineBookingActivityCardHead">
                  <span className="OfflineBookingActivityCardBadge">ACTIVITY {index + 1}</span>
                  {bookings.length > 1 && (
                    <button type="button" className="OfflineBookingActivityCardRemove" onClick={() => removeBooking(index)} aria-label="Remove activity">
                      ×
                    </button>
                  )}
                </div>
                <div className="OfflineBookingActivityCardTop">
                  <div className="OfflineBookingActivityCardThumb">
                    <img src={exp?.image ?? DUMMY_ACTIVITY_IMAGE} alt="" />
                  </div>
                  <div className="OfflineBookingActivityCardTopFields">
                    <div className="OfflineBookingFormField">
                      <label className="OfflineBookingFormLabel">Select experience</label>
                      <select
                        className="OfflineBookingFormSelect"
                        value={booking.activityId}
                        onChange={(e) => {
                          const id = e.target.value;
                          const act = OFFLINE_ACTIVITIES.find((a) => a.id === id);
                          updateBooking(index, { activityId: id, variantId: act?.variants?.[0]?.id ?? "", date: "", slot: "", amountPerPerson: act?.basePricePerPerson ?? 0 });
                        }}
                      >
                        <option value="">Select experience</option>
                        {OFFLINE_ACTIVITIES.map((a) => (
                          <option key={a.id} value={a.id}>{a.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="OfflineBookingFormField">
                      <label className="OfflineBookingFormLabel">Select activity</label>
                      <select
                        className="OfflineBookingFormSelect"
                        value={booking.variantId}
                        onChange={(e) => updateBooking(index, { variantId: e.target.value, date: "", slot: "" })}
                        disabled={!booking.activityId}
                      >
                        <option value="">Select activity</option>
                        {variants.map((v) => (
                          <option key={v.id} value={v.id}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="OfflineBookingActivityCardBody">
                  <div className="OfflineBookingFormField">
                    <label className="OfflineBookingFormLabel">Select a date</label>
                    <div className={`OfflineBookingFormDateRow ${!dateEnabled ? "OfflineBookingFormDateRowDisabled" : ""}`}>
                      <div className="OfflineBookingFormDatePills">
                        {datePills.map((pill) => (
                          <button
                            key={pill.value}
                            type="button"
                            className={`OfflineBookingFormDatePill ${booking.date === pill.value ? "OfflineBookingFormDatePillSelected" : ""}`}
                            onClick={() => dateEnabled && updateBooking(index, { date: pill.value, slot: "" })}
                            disabled={!dateEnabled}
                            title=""
                          >
                            <span className="OfflineBookingFormDatePillDay">{pill.day}</span>
                            <span className="OfflineBookingFormDatePillDate">{pill.label}</span>
                          </button>
                        ))}
                      </div>
                      <button type="button" className="OfflineBookingFormMoreDates" onClick={() => dateEnabled && openCalendar(index)} disabled={!dateEnabled} title="">
                        <IconCalendar /><span>More dates</span>
                      </button>
                    </div>
                  </div>
                  <div className="OfflineBookingFormField">
                    <label className="OfflineBookingFormLabel OfflineBookingFormLabelWithIcon"><IconClock /> Select time slot</label>
                    <select
                      className="OfflineBookingFormSelect"
                      value={booking.slot}
                      onChange={(e) => slotsEnabled && updateBooking(index, { slot: e.target.value })}
                      disabled={!slotsEnabled}
                    >
                      <option value="">Select time slot</option>
                      {OFFLINE_TIMESLOTS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  {index > 0 && (
                    <button type="button" className="OfflineBookingSameAsFirst" onClick={() => copyFromFirst(index)}>
                      Same as Activity 1
                    </button>
                  )}
                  <h4 className="OfflineBookingFormSectionHeading">CUSTOMER INFORMATION</h4>
                  <div className="OfflineBookingFormCustomerCard">
                    <div className="OfflineBookingFormRow">
                      <div className="OfflineBookingFormField">
                        <label className="OfflineBookingFormLabel">Full Name *</label>
                        <input type="text" className="OfflineBookingFormInput" value={booking.fullName} onChange={(e) => updateBooking(index, { fullName: e.target.value })} placeholder="Full name" />
                      </div>
                      <div className="OfflineBookingFormField">
                        <label className="OfflineBookingFormLabel">Phone Number *</label>
                        <input type="tel" className="OfflineBookingFormInput" value={booking.phone} onChange={(e) => updateBooking(index, { phone: e.target.value })} placeholder="10-digit" />
                      </div>
                    </div>
                    <div className="OfflineBookingFormField">
                      <label className="OfflineBookingFormLabel">Email Address</label>
                      <input type="email" className="OfflineBookingFormInput" value={booking.email} onChange={(e) => updateBooking(index, { email: e.target.value })} placeholder="Optional" />
                    </div>
                  </div>
                  <div className="OfflineBookingFormRow OfflineBookingFormRowSection">
                    <div className="OfflineBookingFormField">
                      <h4 className="OfflineBookingFormSectionHeading">PARTICIPANTS</h4>
                      <div className="OfflineBookingFormParticipantWrap">
                        <button type="button" className="OfflineBookingFormParticipantBtn" onClick={() => updateBooking(index, { participants: Math.max(1, booking.participants - 1) })} aria-label="Decrease">−</button>
                        <span className="OfflineBookingFormParticipantCount">{booking.participants}</span>
                        <button type="button" className="OfflineBookingFormParticipantBtn" onClick={() => updateBooking(index, { participants: booking.participants + 1 })} aria-label="Increase">+</button>
                      </div>
                    </div>
                    <div className="OfflineBookingFormField">
                      <h4 className="OfflineBookingFormSectionHeading OfflineBookingFormSectionHeadingRight">AMOUNT PER PERSON</h4>
                      <input type="number" min={0} step={1} className="OfflineBookingFormInput OfflineBookingFormAmountInput" value={amountPerPerson || ""} onChange={(e) => updateBooking(index, { amountPerPerson: Number(e.target.value) || 0 })} placeholder="0" />
                    </div>
                  </div>
                  <div className="OfflineBookingFormField">
                    <h4 className="OfflineBookingFormSectionHeading">ADVANCE AMOUNT</h4>
                    <input type="number" min={0} step={1} className="OfflineBookingFormInput OfflineBookingFormAmountInput" value={booking.advanceAmount ?? 0} onChange={(e) => updateBooking(index, { advanceAmount: Number(e.target.value) || 0 })} placeholder="0" />
                  </div>
                  <div className="OfflineBookingFormField">
                    <input type="text" className="OfflineBookingFormInput" value={booking.noteForGuide} onChange={(e) => updateBooking(index, { noteForGuide: e.target.value })} placeholder="Note for Guide (Optional)" />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
          <button type="button" className="OfflineBookingAddAnother" onClick={addBooking}>
            + Create another booking
          </button>
        </div>

        <aside className="OfflineBookingFormSummary">
          <h3 className="OfflineBookingFormSummaryTitle">BOOKING SUMMARY</h3>
          <p className="OfflineBookingFormSummaryCount">{bookings.length} activit{bookings.length === 1 ? "y" : "ies"} added</p>
          {bookings.map((booking, index) => {
            const exp = OFFLINE_ACTIVITIES.find((a) => a.id === booking.activityId);
            const variants = exp?.variants ?? [];
            const variantLabel = variants.find((v) => v.id === booking.variantId)?.label ?? exp?.label ?? "—";
            const amount = (booking.amountPerPerson ?? 0) * booking.participants;
            return (
              <div key={index} className="OfflineBookingFormSummaryBlock">
                <div className="OfflineBookingFormSummaryRow">
                  <span className="OfflineBookingFormSummaryLabel">Activity {index + 1}</span>
                  <span className="OfflineBookingFormSummaryValue">{variantLabel}</span>
                </div>
                <div className="OfflineBookingFormSummaryRow">
                  <span className="OfflineBookingFormSummaryLabel">Experience</span>
                  <span className="OfflineBookingFormSummaryValue">{exp?.label ?? "—"}</span>
                </div>
                <div className="OfflineBookingFormSummaryRow">
                  <span className="OfflineBookingFormSummaryLabel">Date</span>
                  <span className="OfflineBookingFormSummaryValue">{booking.date ? formatDateDisplay(booking.date) : "—"}</span>
                </div>
                <div className="OfflineBookingFormSummaryRow">
                  <span className="OfflineBookingFormSummaryLabel">Participants</span>
                  <span className="OfflineBookingFormSummaryValue">{booking.participants}</span>
                </div>
                <div className="OfflineBookingFormSummaryRow">
                  <span className="OfflineBookingFormSummaryLabel">Amount</span>
                  <span className="OfflineBookingFormSummaryValue">{formatRupee(amount)}</span>
                </div>
              </div>
            );
          })}
          <div className="OfflineBookingFormSummaryBlock OfflineBookingFormSummaryTotals">
            <div className="OfflineBookingFormSummaryRow">
              <span className="OfflineBookingFormSummaryLabel">Total</span>
              <span className="OfflineBookingFormSummaryValue OfflineBookingFormSummaryDueValue">{formatRupee(grandTotal)}</span>
            </div>
          </div>
          <button type="submit" className="OfflineBookingFormSummarySubmit">
            Create Booking
          </button>
        </aside>
      </form>

      <Modal open={calendarOpen} onCancel={() => setCalendarOpen(false)} title="Select a date" centered width={720} maskClosable destroyOnClose footer={null} closable className="OfflineBookingFormCalendarModalWrap" styles={{ body: { paddingTop: 8 } }}>
        <div className="OfflineBookingFormCalendarModal">
          {(() => {
            const y1 = calendarViewDate.getFullYear();
            const m1 = calendarViewDate.getMonth();
            const y2 = m1 === 11 ? y1 + 1 : y1;
            const m2 = m1 === 11 ? 0 : m1 + 1;
            const grid1 = getMonthGrid(y1, m1);
            const grid2 = getMonthGrid(y2, m2);
            const selectedDate = bookings[calendarForIndex]?.date ?? "";
            return (
              <>
                <div className="OfflineBookingFormCalendarNav">
                  <button type="button" className="OfflineBookingFormCalendarNavBtn" onClick={calendarPrevMonths} aria-label="Previous">←</button>
                  <div className="OfflineBookingFormCalendarNavTitles">
                    <span className="OfflineBookingFormCalendarNavTitle">{MONTHS_FULL[m1]} {y1}</span>
                    <span className="OfflineBookingFormCalendarNavTitle">{MONTHS_FULL[m2]} {y2}</span>
                  </div>
                  <button type="button" className="OfflineBookingFormCalendarNavBtn" onClick={calendarNextMonths} aria-label="Next">→</button>
                </div>
                <div className="OfflineBookingFormCalendarMonths">
                  {[grid1, grid2].map((grid, g) => {
                    const y = g === 0 ? y1 : y2;
                    const m = g === 0 ? m1 : m2;
                    return (
                      <div key={g} className="OfflineBookingFormCalendarMonth">
                        <div className="OfflineBookingFormCalendarWeekdays">
                          {DAYS.map((d) => <span key={d} className="OfflineBookingFormCalendarWeekday">{d}</span>)}
                        </div>
                        <div className="OfflineBookingFormCalendarGrid">
                          {grid.map((day, i) => {
                            if (day === null) return <div key={`e-${i}`} className="OfflineBookingFormCalendarCell OfflineBookingFormCalendarCellEmpty" />;
                            const iso = toISODate(y, m, day);
                            const selected = selectedDate === iso;
                            const past = isPastDate(y, m, day);
                            return (
                              <button key={day} type="button" className={`OfflineBookingFormCalendarCell ${selected ? "OfflineBookingFormCalendarCellSelected" : ""} ${past ? "OfflineBookingFormCalendarCellPast" : ""}`} onClick={() => !past && handleCalendarDateSelect(iso)} disabled={past}>{day}</button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Modal, Button } from "antd";
import BookingCard from "@/components/CommonComponents/BookingCards/BookingCards";
import ConfirmationModal from "@/components/CommonComponents/ConfirmationModal/ConfirmationModal";
import {
  DUMMY_ACTIVITIES,
  initialBooking,
  getDatePills,
  getMonthGrid,
  toISODate,
  isPastDate,
  DAYS,
  MONTHS_FULL,
  type PerActivityBooking,
  type ParticipantDetails,
} from "./CommonValues";
import "./BookingActivity.css";

const BookingActivityContent = () => {
  const [bookings, setBookings] = useState<Record<string, PerActivityBooking>>(() => {
    const next: Record<string, PerActivityBooking> = {};
    DUMMY_ACTIVITIES.forEach((a) => {
      next[a.id] = initialBooking();
    });
    return next;
  });
  const [participantModal, setParticipantModal] = useState<{
    activityId: string;
    activityTitle: string;
    participantIndex: number | null;
  } | null>(null);
  const [calendarModal, setCalendarModal] = useState<{ activityId: string } | null>(null);
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());
  const [draftParticipant, setDraftParticipant] = useState<ParticipantDetails>({ userName: "", userEmail: "", userPhone: "" });
  const [removedActivityIds, setRemovedActivityIds] = useState<Set<string>>(new Set());
  const [confirmRemoveActivity, setConfirmRemoveActivity] = useState<{ activityId: string; activityTitle: string } | null>(null);

  const updateBookingDate = (activityId: string, date: string) => {
    setBookings((prev) => ({ ...prev, [activityId]: { ...prev[activityId], date } }));
  };

  const updateBookingSlot = (activityId: string, slot: string) => {
    setBookings((prev) => ({ ...prev, [activityId]: { ...prev[activityId], slot } }));
  };

  const getParticipant = (activityId: string, index: number): ParticipantDetails => {
    const list = bookings[activityId]?.participants ?? [];
    return list[index] ?? { userName: "", userEmail: "", userPhone: "" };
  };

  const setParticipant = (activityId: string, participantIndex: number | null, p: ParticipantDetails) => {
    setBookings((prev) => {
      const current = prev[activityId];
      const list = current?.participants ?? [];
      const newList = participantIndex === null || participantIndex >= list.length ? [p] : list.map((x, i) => (i === participantIndex ? p : x));
      const ticketCount = current?.ticketCount ?? 1;
      return { ...prev, [activityId]: { ...current, participants: newList, ticketCount: newList.length ? Math.max(1, ticketCount) : 1 } };
    });
  };

  const openParticipantModal = (activityId: string, activityTitle: string, participantIndex: number | null) => {
    setParticipantModal({ activityId, activityTitle, participantIndex });
    if (participantIndex === null) {
      setDraftParticipant({ userName: "", userEmail: "", userPhone: "" });
    }
  };

  const closeParticipantModal = () => setParticipantModal(null);

  const saveParticipantAndClose = () => {
    if (!participantModal) return;
    const { activityId, participantIndex } = participantModal;
    if (participantIndex === null) {
      if (draftParticipant.userName?.trim() && draftParticipant.userEmail?.trim() && draftParticipant.userPhone?.trim()) {
        setParticipant(activityId, null, draftParticipant);
        setParticipantModal(null);
      }
    } else {
      const p = getParticipant(activityId, participantIndex);
      if (p.userName?.trim() && p.userEmail?.trim() && p.userPhone?.trim()) {
        setParticipantModal(null);
      }
    }
  };

  const updateParticipantField = (activityId: string, participantIndex: number, field: keyof ParticipantDetails, value: string) => {
    setBookings((prev) => {
      const list = [...(prev[activityId]?.participants ?? [])];
      const existing = list[participantIndex] ?? { userName: "", userEmail: "", userPhone: "" };
      list[participantIndex] = { ...existing, [field]: value };
      return { ...prev, [activityId]: { ...prev[activityId], participants: list } };
    });
  };

  const removeParticipant = (activityId: string, participantIndex: number) => {
    setBookings((prev) => ({
      ...prev,
      [activityId]: { ...prev[activityId], participants: [], ticketCount: 1 },
    }));
    if (participantModal?.activityId === activityId && participantModal?.participantIndex === participantIndex) {
      setParticipantModal(null);
    }
  };

  const updateTicketCount = (activityId: string, delta: number) => {
    setBookings((prev) => {
      const current = prev[activityId];
      const ticketCount = Math.max(1, Math.min(99, (current?.ticketCount ?? 1) + delta));
      return { ...prev, [activityId]: { ...current, ticketCount } };
    });
  };

  const openCalendarModal = (activityId: string) => {
    setCalendarModal({ activityId });
    const current = bookings[activityId]?.date;
    if (current) {
      const [y, m] = current.split("-").map(Number);
      setCalendarViewDate(new Date(y, m - 1, 1));
    } else {
      setCalendarViewDate(new Date());
    }
  };

  const closeCalendarModal = () => setCalendarModal(null);

  const handleCalendarDateSelect = (activityId: string, isoDate: string) => {
    updateBookingDate(activityId, isoDate);
    setCalendarModal(null);
  };

  const calendarPrevMonths = () => {
    setCalendarViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const calendarNextMonths = () => {
    setCalendarViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const copyFromFirst = (activityId: string) => {
    const firstId = DUMMY_ACTIVITIES[0]?.id;
    if (!firstId || activityId === firstId) return;
    const firstParticipants = bookings[firstId]?.participants ?? [];
    const firstTicketCount = bookings[firstId]?.ticketCount ?? 1;
    if (firstParticipants.length === 0) return;
    setBookings((prev) => ({
      ...prev,
      [activityId]: { ...prev[activityId], participants: [{ ...firstParticipants[0] }], ticketCount: firstTicketCount },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeActivities = DUMMY_ACTIVITIES.filter((a) => !removedActivityIds.has(a.id));
    console.log("Booking payload:", { activities: activeActivities.map((a) => ({ ...a, booking: bookings[a.id] })) });
  };

  const openRemoveActivityConfirm = (activityId: string, activityTitle: string) => {
    setConfirmRemoveActivity({ activityId, activityTitle });
  };

  const confirmRemoveActivityAction = () => {
    if (!confirmRemoveActivity) return;
    setRemovedActivityIds((prev) => new Set(prev).add(confirmRemoveActivity.activityId));
    setConfirmRemoveActivity(null);
  };

  const activeActivities = DUMMY_ACTIVITIES.filter((a) => !removedActivityIds.has(a.id));
  const totalAmount = activeActivities.reduce((sum, a) => sum + a.price * (bookings[a.id]?.ticketCount ?? 1), 0);
  const datePills = getDatePills(7);

  return (
    <section className="BookingActivity MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom50">
      <header className="BookingActivityHeader">
        <h1 className="BookingActivityTitle SecondaryHeadingFont">Book your activities</h1>
        <p className="BookingActivitySubtitle">Choose date, slot & participant for each activity.</p>
      </header>

      <form onSubmit={handleSubmit} className="BookingActivityForm">
        <div className="BookingActivityGrid">
          {activeActivities.map((activity, index) => (
            <BookingCard
              key={activity.id}
              activity={activity}
              index={index}
              booking={bookings[activity.id]}
              datePills={datePills}
              onUpdateDate={updateBookingDate}
              onUpdateSlot={updateBookingSlot}
              onOpenCalendar={openCalendarModal}
              onAddParticipant={(id, title) => openParticipantModal(id, title, null)}
              onEditParticipant={(id, title, participantIndex) => openParticipantModal(id, title, participantIndex)}
              onRemoveParticipant={removeParticipant}
              onRemoveActivity={openRemoveActivityConfirm}
              onTicketCountChange={updateTicketCount}
              onCopyFromFirst={copyFromFirst}
              isFirst={index === 0}
            />
          ))}
        </div>

        <div className="BookingActivityFooter">
          <div className="BookingActivityTotal">
            <span className="BookingActivityTotalLabel">Total</span>
            <span className="BookingActivityTotalAmount">₹{totalAmount.toLocaleString()}</span>
          </div>
          <button type="submit" className="BookingActivitySubmitBtn" disabled={activeActivities.length === 0}>
            Proceed to payment
          </button>
        </div>
      </form>

      <ConfirmationModal
        open={!!confirmRemoveActivity}
        onCancel={() => setConfirmRemoveActivity(null)}
        onConfirm={confirmRemoveActivityAction}
        title="Remove activity?"
        content={
          confirmRemoveActivity ? (
            <p>
              Are you sure you want to remove <strong>{confirmRemoveActivity.activityTitle}</strong> from your booking?
            </p>
          ) : null
        }
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        width={420}
      />

      <Modal
        open={!!participantModal}
        onCancel={closeParticipantModal}
        title={participantModal ? (participantModal.participantIndex === null ? "Add participant" : "Edit participant") : ""}
        centered
        width={400}
        maskClosable
        destroyOnClose
        footer={
          <div className="BookingActivityModalFooter">
            <Button onClick={closeParticipantModal}>Cancel</Button>
            <Button type="primary" onClick={saveParticipantAndClose} style={{ background: "var(--brand-color)", borderColor: "var(--brand-color)" }}>
              Save
            </Button>
          </div>
        }
        className="BookingActivityParticipantModal"
      >
        {participantModal && (() => {
          const { activityId, activityTitle, participantIndex } = participantModal;
          const isNew = participantIndex === null;
          const p = isNew ? draftParticipant : getParticipant(activityId, participantIndex!);
          return (
            <>
              <p className="BookingActivityModalSubtitle">{activityTitle}</p>
              <div className="BookingActivityModalBody">
                <div className="BookingActivityModalRow">
                  <label className="BookingActivityModalLabel">Full name</label>
                  <input
                    type="text"
                    className="BookingActivityModalInput"
                    placeholder="Enter full name"
                    value={p.userName}
                    onChange={(e) => {
                      if (isNew) setDraftParticipant((d) => ({ ...d, userName: e.target.value }));
                      else updateParticipantField(activityId, participantIndex!, "userName", e.target.value);
                    }}
                  />
                </div>
                <div className="BookingActivityModalRow">
                  <label className="BookingActivityModalLabel">Email</label>
                  <input
                    type="email"
                    className="BookingActivityModalInput"
                    placeholder="your@email.com"
                    value={p.userEmail}
                    onChange={(e) => {
                      if (isNew) setDraftParticipant((d) => ({ ...d, userEmail: e.target.value }));
                      else updateParticipantField(activityId, participantIndex!, "userEmail", e.target.value);
                    }}
                  />
                </div>
                <div className="BookingActivityModalRow">
                  <label className="BookingActivityModalLabel">Phone</label>
                  <input
                    type="tel"
                    className="BookingActivityModalInput"
                    placeholder="10-digit mobile number"
                    value={p.userPhone}
                    onChange={(e) => {
                      if (isNew) setDraftParticipant((d) => ({ ...d, userPhone: e.target.value }));
                      else updateParticipantField(activityId, participantIndex!, "userPhone", e.target.value);
                    }}
                  />
                </div>
              </div>
            </>
          );
        })()}
      </Modal>

      <Modal
        open={!!calendarModal}
        onCancel={closeCalendarModal}
        title="Select a date"
        centered
        width={720}
        maskClosable
        destroyOnClose
        footer={null}
        closable
        className="BookingActivityCalendarModalWrap"
        styles={{ body: { paddingTop: 8 } }}
      >
        {calendarModal && (() => {
          const y1 = calendarViewDate.getFullYear();
          const m1 = calendarViewDate.getMonth();
          const y2 = m1 === 11 ? y1 + 1 : y1;
          const m2 = m1 === 11 ? 0 : m1 + 1;
          const grid1 = getMonthGrid(y1, m1);
          const grid2 = getMonthGrid(y2, m2);
          const selectedDate = bookings[calendarModal.activityId]?.date ?? "";

          return (
            <div className="BookingActivityCalendarModal">
              <div className="BookingActivityCalendarNav">
                <button type="button" className="BookingActivityCalendarNavBtn" onClick={calendarPrevMonths} aria-label="Previous months">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <div className="BookingActivityCalendarNavTitles">
                  <span className="BookingActivityCalendarNavTitle">{MONTHS_FULL[m1]} {y1}</span>
                  <span className="BookingActivityCalendarNavTitle">{MONTHS_FULL[m2]} {y2}</span>
                </div>
                <button type="button" className="BookingActivityCalendarNavBtn" onClick={calendarNextMonths} aria-label="Next months">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
              <div className="BookingActivityCalendarMonths">
                <div className="BookingActivityCalendarMonth">
                  <div className="BookingActivityCalendarWeekdays">
                    {DAYS.map((d) => <span key={d} className="BookingActivityCalendarWeekday">{d}</span>)}
                  </div>
                  <div className="BookingActivityCalendarGrid">
                    {grid1.map((day, i) => {
                      if (day === null) return <div key={`e1-${i}`} className="BookingActivityCalendarCell BookingActivityCalendarCellEmpty" />;
                      const iso = toISODate(y1, m1, day);
                      const selected = selectedDate === iso;
                      const past = isPastDate(y1, m1, day);
                      return (
                        <button
                          key={`1-${day}`}
                          type="button"
                          className={`BookingActivityCalendarCell ${selected ? "BookingActivityCalendarCellSelected" : ""} ${past ? "BookingActivityCalendarCellPast" : ""}`}
                          onClick={() => !past && handleCalendarDateSelect(calendarModal.activityId, iso)}
                          disabled={past}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="BookingActivityCalendarMonth">
                  <div className="BookingActivityCalendarWeekdays">
                    {DAYS.map((d) => <span key={d} className="BookingActivityCalendarWeekday">{d}</span>)}
                  </div>
                  <div className="BookingActivityCalendarGrid">
                    {grid2.map((day, i) => {
                      if (day === null) return <div key={`e2-${i}`} className="BookingActivityCalendarCell BookingActivityCalendarCellEmpty" />;
                      const iso = toISODate(y2, m2, day);
                      const selected = selectedDate === iso;
                      const past = isPastDate(y2, m2, day);
                      return (
                        <button
                          key={`2-${day}`}
                          type="button"
                          className={`BookingActivityCalendarCell ${selected ? "BookingActivityCalendarCellSelected" : ""} ${past ? "BookingActivityCalendarCellPast" : ""}`}
                          onClick={() => !past && handleCalendarDateSelect(calendarModal.activityId, iso)}
                          disabled={past}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </section>
  );
};

export default BookingActivityContent;

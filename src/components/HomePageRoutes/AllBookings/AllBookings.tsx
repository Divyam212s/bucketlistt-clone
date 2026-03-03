"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ALL_BOOKINGS, type AllBookingRow } from "@/components/HomePageRoutes/HomeReview/CommonValues";
import "./AllBookings.css";

const DEFAULT_COLUMN_WIDTH = 120;
const MIN_COLUMN_WIDTH = 60;
const MAX_COLUMN_WIDTH = 400;
const ACTIONS_COLUMN_WIDTH = 120;

type SortDir = "asc" | "desc";

type ColumnConfig = { key: keyof AllBookingRow; label: string; format?: "currency" | "date" | "dateOnly" };

const INITIAL_COLUMNS: ColumnConfig[] = [
    { key: "title", label: "Title" },
    { key: "activity", label: "Activity" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "contactName", label: "Contact Name" },
    { key: "email", label: "Email" },
    { key: "referredBy", label: "Referred by" },
    { key: "timeslot", label: "Timeslot" },
    { key: "activityDate", label: "Activity Date", format: "dateOnly" },
    { key: "numberOfParticipants", label: "No. Of Participants" },
    { key: "notesForGuides", label: "Notes for guides" },
    { key: "bookingType", label: "Booking Type" },
    { key: "officialPrice", label: "Official Price/ Original Price", format: "currency" },
    { key: "b2bPrice", label: "B2B Price", format: "currency" },
    { key: "commissionAsPerVendor", label: "Commission as per vendor", format: "currency" },
    { key: "websitePrice", label: "Website Price", format: "currency" },
    { key: "discountCoupon", label: "Discount Coupon" },
    { key: "ticketPrice", label: "Ticket Price (customer cost)", format: "currency" },
    { key: "advancePaid", label: "Advance paid", format: "currency" },
    { key: "pendingAmount", label: "Pending amount from customer", format: "currency" },
    { key: "netCommission", label: "Net Commission", format: "currency" },
    { key: "netFromAgentToAgent", label: "(- Net from agent) / to agent", format: "currency" },
    { key: "advancePlusDiscount", label: "Advance + discount", format: "currency" },
    { key: "bookingCreatedAt", label: "Booking Created At", format: "date" },
    { key: "adminNote", label: "Admin Note" },
];

function formatCell(value: unknown, format?: "currency" | "date" | "dateOnly"): string {
    if (value === null || value === undefined) return "—";
    if (format === "currency" && typeof value === "number") return `₹${value.toLocaleString("en-IN")}`;
    if ((format === "date" || format === "dateOnly") && typeof value === "string") {
        try {
            const d = new Date(value);
            if (format === "dateOnly") return d.toLocaleDateString("en-IN");
            return d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
        } catch {
            return String(value);
        }
    }
    return String(value);
}

function getCellValueForSort(row: AllBookingRow, key: keyof AllBookingRow): string | number {
    const v = row[key];
    if (typeof v === "number") return v;
    return v == null ? "" : String(v);
}

function getCellDisplayForFilter(row: AllBookingRow, key: keyof AllBookingRow, format?: "currency" | "date" | "dateOnly"): string {
    return formatCell(row[key], format);
}

const UNIQUE_TIMESLOTS = [...new Set(ALL_BOOKINGS.map((r) => r.timeslot))].sort();
const UNIQUE_ACTIVITIES = [...new Set(ALL_BOOKINGS.map((r) => r.activity))].sort();

function isTodayDate(isoDate: string): boolean {
    const d = new Date(isoDate.slice(0, 10));
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export default function AllBookings() {
    const router = useRouter();
    const [columns, setColumns] = useState<ColumnConfig[]>(() => [...INITIAL_COLUMNS]);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<{ key: string; dir: SortDir } | null>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);
    const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
    const [todayBookingsOnly, setTodayBookingsOnly] = useState(false);
    const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(() => new Set(INITIAL_COLUMNS.map((c) => c.key)));
    const [selectedTimeslots, setSelectedTimeslots] = useState<Set<string>>(() => new Set());
    const [selectedActivities, setSelectedActivities] = useState<Set<string>>(() => new Set());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openTopFilter, setOpenTopFilter] = useState<"columns" | "timeslots" | "activities" | null>(null);
    const resizeRef = useRef<{ key: string; startX: number; startW: number } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const topFiltersRef = useRef<HTMLDivElement | null>(null);

    const getWidth = useCallback((key: string) => columnWidths[key] ?? DEFAULT_COLUMN_WIDTH, [columnWidths]);

    const displayColumns = columns.filter((c) => visibleColumnKeys.has(c.key));

    const filteredAndSortedData = useCallback(() => {
        let rows = ALL_BOOKINGS;
        if (todayBookingsOnly) {
            rows = rows.filter((row) => isTodayDate(row.activityDate));
        }
        if (selectedTimeslots.size > 0) {
            rows = rows.filter((row) => selectedTimeslots.has(row.timeslot));
        }
        if (selectedActivities.size > 0) {
            rows = rows.filter((row) => selectedActivities.has(row.activity));
        }
        if (startDate) {
            rows = rows.filter((row) => row.activityDate >= startDate);
        }
        if (endDate) {
            rows = rows.filter((row) => row.activityDate <= endDate);
        }
        rows = rows.filter((row) => {
            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                const filterText = columnFilters[col.key]?.trim().toLowerCase();
                if (!filterText) continue;
                const display = getCellDisplayForFilter(row, col.key, col.format).toLowerCase();
                if (!display.includes(filterText)) return false;
            }
            return true;
        });
        if (sortBy) {
            const key = sortBy.key as keyof AllBookingRow;
            rows = [...rows].sort((a, b) => {
                const va = getCellValueForSort(a, key);
                const vb = getCellValueForSort(b, key);
                const isNum = typeof va === "number" && typeof vb === "number";
                let cmp = 0;
                if (isNum) cmp = (va as number) - (vb as number);
                else cmp = String(va).localeCompare(String(vb));
                return sortBy.dir === "asc" ? cmp : -cmp;
            });
        }
        return rows;
    }, [columns, columnFilters, sortBy, todayBookingsOnly, selectedTimeslots, selectedActivities, startDate, endDate])();

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const r = resizeRef.current;
            if (!r) return;
            const delta = e.clientX - r.startX;
            const newW = Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, r.startW + delta));
            setColumnWidths((prev) => ({ ...prev, [r.key]: newW }));
        };
        const onUp = () => {
            resizeRef.current = null;
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    useEffect(() => {
        if (openColumnMenu === null) return;
        const onDocClick = (e: MouseEvent) => {
            const el = e.target as Node;
            if (menuRef.current?.contains(el)) return;
            if ((el as HTMLElement).closest?.(".AllBookingsThSortFilterTrigger")) return;
            setOpenColumnMenu(null);
            setMenuAnchor(null);
        };
        document.addEventListener("mousedown", onDocClick, true);
        return () => document.removeEventListener("mousedown", onDocClick, true);
    }, [openColumnMenu]);

    useEffect(() => {
        if (openTopFilter === null) return;
        const onDocClick = (e: MouseEvent) => {
            if (topFiltersRef.current?.contains(e.target as Node)) return;
            setOpenTopFilter(null);
        };
        document.addEventListener("mousedown", onDocClick, true);
        return () => document.removeEventListener("mousedown", onDocClick, true);
    }, [openTopFilter]);

    const handleResizeStart = useCallback((e: React.MouseEvent, key: string) => {
        e.preventDefault();
        e.stopPropagation();
        resizeRef.current = { key, startX: e.clientX, startW: getWidth(key) };
    }, [getWidth]);

    const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
        if (resizeRef.current !== null) {
            e.preventDefault();
            return;
        }
        const target = e.target as HTMLElement;
        if (target.closest?.(".AllBookingsThSortFilterTrigger, .AllBookingsColumnMenu, .AllBookingsThMenuWrap")) {
            e.preventDefault();
            return;
        }
        setDraggedIndex(index);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        setDragOverIndex(index);
    }, [draggedIndex]);

    const handleDragLeave = useCallback(() => {
        setDragOverIndex(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        setDragOverIndex(null);
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }
        const fromKey = displayColumns[draggedIndex].key;
        const toKey = displayColumns[dropIndex].key;
        const fromIdx = columns.findIndex((c) => c.key === fromKey);
        const toIdx = columns.findIndex((c) => c.key === toKey);
        if (fromIdx === -1 || toIdx === -1) {
            setDraggedIndex(null);
            return;
        }
        setColumns((prev) => {
            const next = [...prev];
            const [removed] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, removed);
            return next;
        });
        setDraggedIndex(null);
    }, [draggedIndex, displayColumns, columns]);

    const toggleColumnVisibility = useCallback((key: string) => {
        setVisibleColumnKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                if (next.size <= 1) return prev;
                next.delete(key);
            } else next.add(key);
            return next;
        });
    }, []);

    const toggleTimeslot = useCallback((slot: string) => {
        setSelectedTimeslots((prev) => {
            const next = new Set(prev);
            if (next.has(slot)) next.delete(slot);
            else next.add(slot);
            return next;
        });
    }, []);

    const toggleActivity = useCallback((activity: string) => {
        setSelectedActivities((prev) => {
            const next = new Set(prev);
            if (next.has(activity)) next.delete(activity);
            else next.add(activity);
            return next;
        });
    }, []);

    const tableMinWidth = displayColumns.reduce((sum, col) => sum + getWidth(col.key), 0) + ACTIONS_COLUMN_WIDTH;
    const hasActiveFilters = Object.values(columnFilters).some((v) => v.trim() !== "");
    const filteredCount = filteredAndSortedData.length;

    return (
        <section className="AllBookings MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom50">
            <header className="AllBookingsHeader">
                <div className="AllBookingsHeaderLeft">
                    <h2 className="AllBookingsTitle SecondaryHeadingFont">All Bookings</h2>
                    <p className="AllBookingsSubtitle">Manage activity bookings, participant details, and payments. Showing {filteredCount} booking{filteredCount !== 1 ? "s" : ""}.</p>
                </div>
                <div className="AllBookingsHeaderRight">
                    <button
                        type="button"
                        className="AllBookingsHeaderBtn AllBookingsHeaderBtnSecondary"
                        onClick={() => { /* TODO: open Create Offline Booking modal/form */ }}
                    >
                        Export Excel
                    </button>
                    <button
                        type="button"
                        className="AllBookingsHeaderBtn AllBookingsHeaderBtnPrimary"
                        onClick={() => router.push("/offline-booking")}
                    >
                        Create Offline Booking
                    </button>
                </div>
            </header>
            <div className="AllBookingsFiltersBar" ref={topFiltersRef}>
                <button
                    type="button"
                    className={`AllBookingsTopFilterBtn ${todayBookingsOnly ? "AllBookingsTopFilterBtnActive" : ""}`}
                    onClick={() => setTodayBookingsOnly((prev) => !prev)}
                >
                    Today&apos;s Bookings
                </button>
                <div className="AllBookingsTopFilterWrap">
                    <button
                        type="button"
                        className={`AllBookingsTopFilterBtn ${openTopFilter === "columns" ? "AllBookingsTopFilterBtnOpen" : ""}`}
                        onClick={() => setOpenTopFilter((prev) => (prev === "columns" ? null : "columns"))}
                    >
                        Columns ▾
                    </button>
                    {openTopFilter === "columns" && (
                        <div className="AllBookingsTopFilterDropdown">
                            {INITIAL_COLUMNS.map((col) => (
                                <label key={col.key} className="AllBookingsTopFilterCheck">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumnKeys.has(col.key)}
                                        onChange={() => toggleColumnVisibility(col.key)}
                                    />
                                    <span>{col.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="AllBookingsTopFilterWrap">
                    <button
                        type="button"
                        className={`AllBookingsTopFilterBtn ${openTopFilter === "timeslots" ? "AllBookingsTopFilterBtnOpen" : ""} ${selectedTimeslots.size > 0 ? "AllBookingsTopFilterBtnActive" : ""}`}
                        onClick={() => setOpenTopFilter((prev) => (prev === "timeslots" ? null : "timeslots"))}
                    >
                        Timeslots {selectedTimeslots.size > 0 ? `(${selectedTimeslots.size})` : ""} ▾
                    </button>
                    {openTopFilter === "timeslots" && (
                        <div className="AllBookingsTopFilterDropdown">
                            {UNIQUE_TIMESLOTS.map((slot) => (
                                <label key={slot} className="AllBookingsTopFilterCheck">
                                    <input type="checkbox" checked={selectedTimeslots.has(slot)} onChange={() => toggleTimeslot(slot)} />
                                    <span>{slot}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="AllBookingsTopFilterWrap">
                    <button
                        type="button"
                        className={`AllBookingsTopFilterBtn ${openTopFilter === "activities" ? "AllBookingsTopFilterBtnOpen" : ""} ${selectedActivities.size > 0 ? "AllBookingsTopFilterBtnActive" : ""}`}
                        onClick={() => setOpenTopFilter((prev) => (prev === "activities" ? null : "activities"))}
                    >
                        Activity names {selectedActivities.size > 0 ? `(${selectedActivities.size})` : ""} ▾
                    </button>
                    {openTopFilter === "activities" && (
                        <div className="AllBookingsTopFilterDropdown">
                            {UNIQUE_ACTIVITIES.map((activity) => (
                                <label key={activity} className="AllBookingsTopFilterCheck">
                                    <input type="checkbox" checked={selectedActivities.has(activity)} onChange={() => toggleActivity(activity)} />
                                    <span>{activity}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="AllBookingsDateRangeWrap">
                    <span className="AllBookingsDateRangeLabel">Date range</span>
                    <div className="AllBookingsDateRangeInputs">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="AllBookingsDateRangeInput"
                            placeholder="Start"
                            title="Start date"
                        />
                        <span className="AllBookingsDateRangeSep" aria-hidden>→</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="AllBookingsDateRangeInput"
                            placeholder="End"
                            title="End date"
                        />
                    </div>
                </div>
            </div>
            <div className="AllBookingsTableWrap">
                <table className="AllBookingsTable" style={{ minWidth: tableMinWidth }}>
                    <colgroup>
                        {displayColumns.map((col) => (
                            <col key={col.key} style={{ width: getWidth(col.key) }} />
                        ))}
                        <col style={{ width: ACTIONS_COLUMN_WIDTH }} />
                    </colgroup>
                    <thead>
                        <tr>
                            {displayColumns.map((col, index) => (
                                <th
                                    key={col.key}
                                    className={`AllBookingsTh ${draggedIndex === index ? "AllBookingsThDragging" : ""} ${dragOverIndex === index ? "AllBookingsThDragOver" : ""} ${sortBy?.key === col.key ? "AllBookingsThSorted" : ""}`}
                                    style={{ width: getWidth(col.key), minWidth: getWidth(col.key), maxWidth: getWidth(col.key) }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index)}
                                >
                                    <span className="AllBookingsThContent">
                                        <span className="AllBookingsThGrip" aria-hidden title="Drag to reorder">⋮⋮</span>
                                        {col.label}
                                    </span>
                                    <div className="AllBookingsThMenuWrap">
                                        <button
                                            type="button"
                                            className="AllBookingsThSortFilterTrigger"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                setMenuAnchor({ x: rect.left, y: rect.bottom + 4 });
                                                setOpenColumnMenu((prev) => (prev === col.key ? null : col.key));
                                            }}
                                            title="Sort & filter"
                                            aria-label="Sort and filter column"
                                            aria-expanded={openColumnMenu === col.key}
                                        >
                                            {sortBy?.key === col.key ? (sortBy.dir === "asc" ? "↑" : "↓") : "▾"}
                                            {columnFilters[col.key]?.trim() ? " ●" : ""}
                                        </button>
                                    </div>
                                    <span
                                        className="AllBookingsResizeHandle"
                                        role="separator"
                                        aria-label="Resize column"
                                        onMouseDown={(e) => handleResizeStart(e, col.key)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </th>
                            ))}
                            <th className="AllBookingsTh AllBookingsThActions" style={{ width: ACTIONS_COLUMN_WIDTH, minWidth: ACTIONS_COLUMN_WIDTH }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedData.map((row) => (
                            <tr key={row.id} className="AllBookingsTr">
                                {displayColumns.map((col) => (
                                    <td key={col.key} className="AllBookingsTd" style={{ maxWidth: getWidth(col.key) }}>
                                        {formatCell(row[col.key], col.format)}
                                    </td>
                                ))}
                                <td className="AllBookingsTd AllBookingsTdActions">
                                    <div className="AllBookingsActionsCell">
                                        <span className="AllBookingsActionsPrimary">
                                            <button type="button" className="AllBookingsActionBtn" title="View">View</button>
                                            <button type="button" className="AllBookingsActionBtn" title="Edit">Edit</button>
                                        </span>
                                        <span className="AllBookingsActionsHoverShow" title={`Ticket: ${formatCell(row.ticketPrice, "currency")}`}>
                                            {formatCell(row.ticketPrice, "currency")}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {typeof document !== "undefined" &&
                openColumnMenu &&
                menuAnchor &&
                createPortal(
                    <div
                        className="AllBookingsColumnMenu AllBookingsColumnMenuPortal"
                        ref={menuRef}
                        style={{ left: menuAnchor.x, top: menuAnchor.y }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(() => {
                            const col = columns.find((c) => c.key === openColumnMenu);
                            if (!col) return null;
                            return (
                                <>
                                    <div className="AllBookingsColumnMenuSection">
                                        <span className="AllBookingsColumnMenuLabel">Sort</span>
                                        <button type="button" onClick={() => { setSortBy({ key: col.key, dir: "asc" }); setOpenColumnMenu(null); setMenuAnchor(null); }}>A → Z</button>
                                        <button type="button" onClick={() => { setSortBy({ key: col.key, dir: "desc" }); setOpenColumnMenu(null); setMenuAnchor(null); }}>Z → A</button>
                                        <button type="button" onClick={() => { setSortBy(null); setOpenColumnMenu(null); setMenuAnchor(null); }}>Clear sort</button>
                                    </div>
                                    <div className="AllBookingsColumnMenuSection">
                                        <span className="AllBookingsColumnMenuLabel">Filter</span>
                                        <input
                                            type="text"
                                            placeholder={`Filter ${col.label}...`}
                                            value={columnFilters[col.key] ?? ""}
                                            onChange={(e) => setColumnFilters((prev) => ({ ...prev, [col.key]: e.target.value }))}
                                            className="AllBookingsColumnMenuInput"
                                        />
                                        {(columnFilters[col.key]?.trim() ?? "") && (
                                            <button type="button" onClick={() => setColumnFilters((prev) => ({ ...prev, [col.key]: "" }))}>Clear</button>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </div>,
                    document.body
                )}
        </section>
    );
}

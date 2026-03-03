"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
    ALL_CREATOR_SUBMISSIONS,
    type CreatorSubmissionRow,
    type CreatorStatus,
} from "@/components/AllCreators/CommonValues";
import "./AllCreators.css";

const DEFAULT_COLUMN_WIDTH = 110;
const MIN_COLUMN_WIDTH = 60;
const MAX_COLUMN_WIDTH = 280;
const ACTIONS_COLUMN_WIDTH = 160;

type SortDir = "asc" | "desc";

const COLUMN_KEYS = [
    "name",
    "instagramProfile",
    "email",
    "phone",
    "dateOfArrival",
    "deliverableDates",
    "aadharAttachment",
    "agreementAttachment",
    "description",
    "status",
] as const;

const COLUMN_LABELS: Record<(typeof COLUMN_KEYS)[number], string> = {
    name: "Name",
    instagramProfile: "Instagram",
    email: "Email",
    phone: "Phone",
    dateOfArrival: "Date of arrival",
    deliverableDates: "Deliverables",
    aadharAttachment: "Aadhar",
    agreementAttachment: "Agreement",
    description: "Description",
    status: "Status",
};

function formatDate(str: string): string {
    if (!str) return "—";
    try {
        return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
        return str;
    }
}

function getCellDisplay(row: CreatorSubmissionRow, key: (typeof COLUMN_KEYS)[number]): string {
    const v = row[key];
    if (v == null || v === "") return "—";
    if (key === "dateOfArrival") return formatDate(v);
    return String(v);
}

function getCellValueForSort(row: CreatorSubmissionRow, key: string): string | number {
    const v = row[key as keyof CreatorSubmissionRow];
    return v == null ? "" : String(v);
}

const STATUS_OPTIONS: CreatorStatus[] = ["pending", "selected", "rejected"];

function isTodayDate(isoDate: string): boolean {
    const d = new Date(isoDate.slice(0, 10));
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export default function AllCreators() {
    const [rows, setRows] = useState<CreatorSubmissionRow[]>(() => [...ALL_CREATOR_SUBMISSIONS]);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [sortBy, setSortBy] = useState<{ key: string; dir: SortDir } | null>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);
    const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
    const [todayOnly, setTodayOnly] = useState(false);
    const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(() => new Set(COLUMN_KEYS as unknown as string[]));
    const [selectedStatuses, setSelectedStatuses] = useState<Set<CreatorStatus>>(() => new Set());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openTopFilter, setOpenTopFilter] = useState<"columns" | "status" | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ row: CreatorSubmissionRow; status: CreatorStatus } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const topFiltersRef = useRef<HTMLDivElement | null>(null);

    const getWidth = useCallback((key: string) => columnWidths[key] ?? DEFAULT_COLUMN_WIDTH, [columnWidths]);
    const displayColumns = COLUMN_KEYS.filter((k) => visibleColumnKeys.has(k));

    const filteredAndSortedData = useMemo(() => {
        let data = rows;
        if (todayOnly) data = data.filter((r) => isTodayDate(r.createdAt));
        if (selectedStatuses.size > 0) data = data.filter((r) => selectedStatuses.has(r.status));
        if (startDate) data = data.filter((r) => r.createdAt >= startDate);
        if (endDate) data = data.filter((r) => r.createdAt.slice(0, 10) <= endDate);
        data = data.filter((row) => {
            for (const col of displayColumns) {
                const filterText = columnFilters[col]?.trim().toLowerCase();
                if (!filterText) continue;
                const display = getCellDisplay(row, col).toLowerCase();
                if (!display.includes(filterText)) return false;
            }
            return true;
        });
        if (sortBy && displayColumns.includes(sortBy.key as (typeof COLUMN_KEYS)[number])) {
            const key = sortBy.key;
            data = [...data].sort((a, b) => {
                const va = getCellValueForSort(a, key);
                const vb = getCellValueForSort(b, key);
                const cmp = String(va).localeCompare(String(vb));
                return sortBy.dir === "asc" ? cmp : -cmp;
            });
        }
        return data;
    }, [rows, columnFilters, sortBy, todayOnly, selectedStatuses, startDate, endDate, displayColumns]);

    useEffect(() => {
        if (openColumnMenu === null) return;
        const onDocClick = (e: MouseEvent) => {
            const el = e.target as Node;
            if (menuRef.current?.contains(el)) return;
            if ((el as HTMLElement).closest?.(".AllCreatorsThSortFilterTrigger")) return;
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

    const toggleColumn = useCallback((key: string) => {
        setVisibleColumnKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                if (next.size <= 1) return prev;
                next.delete(key);
            } else next.add(key);
            return next;
        });
    }, []);

    const toggleStatus = useCallback((status: CreatorStatus) => {
        setSelectedStatuses((prev) => {
            const next = new Set(prev);
            if (next.has(status)) next.delete(status);
            else next.add(status);
            return next;
        });
    }, []);

    const handleConfirmAction = useCallback(() => {
        if (!confirmAction) return;
        setRows((prev) =>
            prev.map((r) => (r.id === confirmAction.row.id ? { ...r, status: confirmAction.status } : r))
        );
        setConfirmAction(null);
    }, [confirmAction]);

    const tableMinWidth = displayColumns.reduce((sum, col) => sum + getWidth(col), 0) + ACTIONS_COLUMN_WIDTH;

    return (
        <section className="AllCreators MaxWidthComponent MarginAuto PaddingTop50 PaddingBottom50">
            <div className="AllCreatorsBg" aria-hidden />
            <div className="AllCreatorsOverlay" aria-hidden />
            <div className="AllCreatorsContainer">
                <header className="AllCreatorsHeader">
                    <h1 className="AllCreatorsTitle">All creator submissions</h1>
                    <p className="AllCreatorsSubtitle">
                        Manage creator applications. Showing {filteredAndSortedData.length} submission{filteredAndSortedData.length !== 1 ? "s" : ""}.
                    </p>
                </header>
                <div className="AllCreatorsFiltersBar" ref={topFiltersRef}>
                    <button
                        type="button"
                        className={`AllCreatorsTopFilterBtn ${todayOnly ? "AllCreatorsTopFilterBtnActive" : ""}`}
                        onClick={() => setTodayOnly((p) => !p)}
                    >
                        Today&apos;s entries
                    </button>
                    <div className="AllCreatorsTopFilterWrap">
                        <button
                            type="button"
                            className={`AllCreatorsTopFilterBtn ${openTopFilter === "columns" ? "AllCreatorsTopFilterBtnOpen" : ""}`}
                            onClick={() => setOpenTopFilter((p) => (p === "columns" ? null : "columns"))}
                        >
                            Columns ▾
                        </button>
                        {openTopFilter === "columns" && (
                            <div className="AllCreatorsTopFilterDropdown">
                                {COLUMN_KEYS.map((col) => (
                                    <label key={col} className="AllCreatorsTopFilterCheck">
                                        <input type="checkbox" checked={visibleColumnKeys.has(col)} onChange={() => toggleColumn(col)} />
                                        <span>{COLUMN_LABELS[col]}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="AllCreatorsTopFilterWrap">
                        <button
                            type="button"
                            className={`AllCreatorsTopFilterBtn ${openTopFilter === "status" ? "AllCreatorsTopFilterBtnOpen" : ""} ${selectedStatuses.size > 0 ? "AllCreatorsTopFilterBtnActive" : ""}`}
                            onClick={() => setOpenTopFilter((p) => (p === "status" ? null : "status"))}
                        >
                            Status {selectedStatuses.size > 0 ? `(${selectedStatuses.size})` : ""} ▾
                        </button>
                        {openTopFilter === "status" && (
                            <div className="AllCreatorsTopFilterDropdown">
                                {STATUS_OPTIONS.map((s) => (
                                    <label key={s} className="AllCreatorsTopFilterCheck">
                                        <input type="checkbox" checked={selectedStatuses.has(s)} onChange={() => toggleStatus(s)} />
                                        <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="AllCreatorsDateRangeWrap">
                        <span className="AllCreatorsDateRangeLabel">Created</span>
                        <div className="AllCreatorsDateRangeInputs">
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="AllCreatorsDateRangeInput" title="Start" />
                            <span className="AllCreatorsDateRangeSep">→</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="AllCreatorsDateRangeInput" title="End" />
                        </div>
                    </div>
                </div>
                <div className="AllCreatorsTableWrap">
                    <table className="AllCreatorsTable" style={{ minWidth: tableMinWidth }}>
                        <colgroup>
                            {displayColumns.map((col) => (
                                <col key={col} style={{ width: getWidth(col) }} />
                            ))}
                            <col style={{ width: ACTIONS_COLUMN_WIDTH }} />
                        </colgroup>
                        <thead>
                            <tr>
                                {displayColumns.map((col) => (
                                    <th key={col} className={`AllCreatorsTh ${sortBy?.key === col ? "AllCreatorsThSorted" : ""}`} style={{ width: getWidth(col), minWidth: getWidth(col), maxWidth: getWidth(col) }}>
                                        <span className="AllCreatorsThContent">{COLUMN_LABELS[col]}</span>
                                        <div className="AllCreatorsThMenuWrap">
                                            <button
                                                type="button"
                                                className="AllCreatorsThSortFilterTrigger"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                    setMenuAnchor({ x: rect.left, y: rect.bottom + 4 });
                                                    setOpenColumnMenu((p) => (p === col ? null : col));
                                                }}
                                                title="Sort & filter"
                                                aria-label={`Sort and filter ${COLUMN_LABELS[col]}`}
                                                aria-expanded={openColumnMenu === col}
                                            >
                                                {sortBy?.key === col ? (sortBy.dir === "asc" ? "↑" : "↓") : "▾"}
                                                {columnFilters[col]?.trim() ? " ●" : ""}
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                <th className="AllCreatorsTh AllCreatorsThActions" style={{ width: ACTIONS_COLUMN_WIDTH, minWidth: ACTIONS_COLUMN_WIDTH }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedData.map((row, index) => (
                                <tr key={row.id} className={`AllCreatorsTr ${index % 2 === 1 ? "AllCreatorsTrAlt" : ""}`}>
                                    {displayColumns.map((col) => (
                                        <td key={col} className="AllCreatorsTd" style={{ maxWidth: getWidth(col) }} title={getCellDisplay(row, col)}>
                                            {getCellDisplay(row, col)}
                                        </td>
                                    ))}
                                    <td className="AllCreatorsTd AllCreatorsTdActions">
                                        <div className="AllCreatorsActionBtns">
                                            <button type="button" className="AllCreatorsActionBtn AllCreatorsActionBtnSelected" onClick={() => setConfirmAction({ row, status: "selected" })} disabled={row.status === "selected"}>
                                                Selected
                                            </button>
                                            <button type="button" className="AllCreatorsActionBtn AllCreatorsActionBtnRejected" onClick={() => setConfirmAction({ row, status: "rejected" })} disabled={row.status === "rejected"}>
                                                Rejected
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {typeof document !== "undefined" && openColumnMenu && menuAnchor &&
                createPortal(
                    <div className="AllCreatorsColumnMenu AllCreatorsColumnMenuPortal" ref={menuRef} style={{ left: menuAnchor.x, top: menuAnchor.y }} onClick={(e) => e.stopPropagation()}>
                        <div className="AllCreatorsColumnMenuSection">
                            <span className="AllCreatorsColumnMenuLabel">Sort</span>
                            <button type="button" onClick={() => { setSortBy({ key: openColumnMenu, dir: "asc" }); setOpenColumnMenu(null); setMenuAnchor(null); }}>A → Z</button>
                            <button type="button" onClick={() => { setSortBy({ key: openColumnMenu, dir: "desc" }); setOpenColumnMenu(null); setMenuAnchor(null); }}>Z → A</button>
                            <button type="button" onClick={() => { setSortBy(null); setOpenColumnMenu(null); setMenuAnchor(null); }}>Clear sort</button>
                        </div>
                        <div className="AllCreatorsColumnMenuSection">
                            <span className="AllCreatorsColumnMenuLabel">Filter</span>
                            <input
                                type="text"
                                placeholder={`Filter ${COLUMN_LABELS[openColumnMenu as (typeof COLUMN_KEYS)[number]]}...`}
                                value={columnFilters[openColumnMenu] ?? ""}
                                onChange={(e) => setColumnFilters((prev) => ({ ...prev, [openColumnMenu]: e.target.value }))}
                                className="AllCreatorsColumnMenuInput"
                            />
                            {(columnFilters[openColumnMenu]?.trim() ?? "") && (
                                <button type="button" onClick={() => setColumnFilters((prev) => ({ ...prev, [openColumnMenu]: "" }))}>Clear</button>
                            )}
                        </div>
                    </div>,
                    document.body
                )}

            {confirmAction && (
                <div className="AllCreatorsConfirmOverlay" onClick={() => setConfirmAction(null)}>
                    <div className="AllCreatorsConfirmModal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="AllCreatorsConfirmTitle">
                            {confirmAction.status === "selected" ? "Mark as Selected?" : "Mark as Rejected?"}
                        </h3>
                        <p className="AllCreatorsConfirmText">
                            {confirmAction.status === "selected"
                                ? `This will mark "${confirmAction.row.name}" as selected.`
                                : `This will mark "${confirmAction.row.name}" as rejected.`}
                        </p>
                        <div className="AllCreatorsConfirmActions">
                            <button type="button" className="AllCreatorsConfirmBtn AllCreatorsConfirmCancel" onClick={() => setConfirmAction(null)}>Cancel</button>
                            <button type="button" className="AllCreatorsConfirmBtn AllCreatorsConfirmOk" onClick={handleConfirmAction}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

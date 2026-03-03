"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ALL_USERS } from "@/components/HomePageRoutes/Users/CommonValues";
import type { UserRow } from "@/components/HomePageRoutes/Users/CommonValues";
import "./Users.css";

const DEFAULT_COLUMN_WIDTH = 120;
const MIN_COLUMN_WIDTH = 60;
const MAX_COLUMN_WIDTH = 320;
const ACTIONS_COLUMN_WIDTH = 90;

type SortDir = "asc" | "desc";

type ColumnConfig = { key: keyof UserRow; label: string; format?: "dateOnly" };

const INITIAL_COLUMNS: ColumnConfig[] = [
    { key: "name", label: "User" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Created", format: "dateOnly" },
];

function formatCreated(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
        return "—";
    }
}

function formatCell(row: UserRow, key: keyof UserRow, format?: "dateOnly"): string {
    const v = row[key];
    if (key === "createdAt" && format === "dateOnly" && typeof v === "string") return formatCreated(v);
    if (v == null || v === "") return "—";
    return String(v);
}

function getCellValueForSort(row: UserRow, key: keyof UserRow): string | number {
    const v = row[key];
    if (typeof v === "number") return v;
    return v == null ? "" : String(v);
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function nameToFirstLast(name: string): { first: string; last: string } {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return { first: "", last: "" };
    if (parts.length === 1) return { first: parts[0], last: "" };
    return { first: parts[0], last: parts.slice(1).join(" ") };
}

const UNIQUE_ROLES = [...new Set(ALL_USERS.map((r) => r.role))].sort();

function isTodayDate(isoDate: string): boolean {
    const d = new Date(isoDate.slice(0, 10));
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

const MODAL_TRANSITION_MS = { enter: 280, exit: 220 };

export default function Users() {
    const [columns, setColumns] = useState<ColumnConfig[]>(() => [...INITIAL_COLUMNS]);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<{ key: string; dir: SortDir } | null>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [openColumnMenu, setOpenColumnMenu] = useState<string | null>(null);
    const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
    const [todayUsersOnly, setTodayUsersOnly] = useState(false);
    const [visibleColumnKeys, setVisibleColumnKeys] = useState<Set<string>>(() => new Set(INITIAL_COLUMNS.map((c) => c.key)));
    const [selectedRoles, setSelectedRoles] = useState<Set<string>>(() => new Set());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openTopFilter, setOpenTopFilter] = useState<"columns" | "roles" | null>(null);
    const [editUser, setEditUser] = useState<UserRow | null>(null);
    const [formFirstName, setFormFirstName] = useState("");
    const [formLastName, setFormLastName] = useState("");
    const [formPhone, setFormPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const editingUserRef = useRef<UserRow | null>(null);
    const resizeRef = useRef<{ key: string; startX: number; startW: number } | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const topFiltersRef = useRef<HTMLDivElement | null>(null);

    const getWidth = useCallback((key: string) => columnWidths[key] ?? DEFAULT_COLUMN_WIDTH, [columnWidths]);
    const displayColumns = columns.filter((c) => visibleColumnKeys.has(c.key));

    const filteredAndSortedData = useMemo(() => {
        let rows = ALL_USERS;
        if (todayUsersOnly) rows = rows.filter((r) => isTodayDate(r.createdAt));
        if (selectedRoles.size > 0) rows = rows.filter((r) => selectedRoles.has(r.role));
        if (startDate) rows = rows.filter((r) => r.createdAt >= startDate);
        if (endDate) rows = rows.filter((r) => r.createdAt.slice(0, 10) <= endDate);
        rows = rows.filter((row) => {
            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];
                const filterText = columnFilters[col.key]?.trim().toLowerCase();
                if (!filterText) continue;
                const display = formatCell(row, col.key, col.format).toLowerCase();
                if (!display.includes(filterText)) return false;
            }
            return true;
        });
        if (sortBy) {
            const key = sortBy.key as keyof UserRow;
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
    }, [columns, columnFilters, sortBy, todayUsersOnly, selectedRoles, startDate, endDate]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const r = resizeRef.current;
            if (!r) return;
            const delta = e.clientX - r.startX;
            const newW = Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, r.startW + delta));
            setColumnWidths((prev) => ({ ...prev, [r.key]: newW }));
        };
        const onUp = () => { resizeRef.current = null; };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, []);

    useEffect(() => {
        if (openColumnMenu === null) return;
        const onDocClick = (e: MouseEvent) => {
            const el = e.target as Node;
            if (menuRef.current?.contains(el)) return;
            if ((el as HTMLElement).closest?.(".UsersThSortFilterTrigger")) return;
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
        if (resizeRef.current !== null) { e.preventDefault(); return; }
        const target = e.target as HTMLElement;
        if (target.closest?.(".UsersThSortFilterTrigger, .UsersColumnMenu, .UsersThMenuWrap")) { e.preventDefault(); return; }
        setDraggedIndex(index);
    }, []);

    const handleDragEnd = useCallback(() => { setDraggedIndex(null); setDragOverIndex(null); }, []);
    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        setDragOverIndex(index);
    }, [draggedIndex]);
    const handleDragLeave = useCallback(() => { setDragOverIndex(null); }, []);

    const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        setDragOverIndex(null);
        if (draggedIndex === null || draggedIndex === dropIndex) { setDraggedIndex(null); return; }
        const fromKey = displayColumns[draggedIndex].key;
        const toKey = displayColumns[dropIndex].key;
        const fromIdx = columns.findIndex((c) => c.key === fromKey);
        const toIdx = columns.findIndex((c) => c.key === toKey);
        if (fromIdx === -1 || toIdx === -1) { setDraggedIndex(null); return; }
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
            if (next.has(key)) { if (next.size <= 1) return prev; next.delete(key); }
            else next.add(key);
            return next;
        });
    }, []);

    const toggleRole = useCallback((role: string) => {
        setSelectedRoles((prev) => {
            const next = new Set(prev);
            if (next.has(role)) next.delete(role);
            else next.add(role);
            return next;
        });
    }, []);

    const tableMinWidth = displayColumns.reduce((sum, col) => sum + getWidth(col.key), 0) + ACTIONS_COLUMN_WIDTH;

    const openEdit = useCallback((row: UserRow) => {
        setEditUser(row);
        editingUserRef.current = row;
        setSaving(false);
        const { first, last } = nameToFirstLast(row.name);
        setFormFirstName(first);
        setFormLastName(last);
        setFormPhone(row.phoneNumber === "-" ? "" : row.phoneNumber);
    }, []);

    const closeEdit = useCallback(() => {
        if (saving) return;
        setEditUser(null);
        setSaving(false);
    }, [saving]);

    const handleSave = useCallback(() => {
        setSaving(true);
        // Simulate persist; in a real app you would call an API here
        setTimeout(() => {
            setSaving(false);
            setEditUser(null);
        }, 1000);
    }, []);

    return (
        <section className="Users PaddingTop50 PaddingBottom50">
            <div className="MaxWidthComponent MarginAuto">
                <header className="UsersHeader">
                    <div className="UsersHeaderLeft">
                        <h1 className="UsersTitle">Users Management</h1>
                        <p className="UsersSubtitle">Manage and edit user information. Showing {filteredAndSortedData.length} user{filteredAndSortedData.length !== 1 ? "s" : ""}.</p>
                    </div>
                </header>
                <div className="UsersFiltersBar" ref={topFiltersRef}>
                    <button
                        type="button"
                        className={`UsersTopFilterBtn ${todayUsersOnly ? "UsersTopFilterBtnActive" : ""}`}
                        onClick={() => setTodayUsersOnly((prev) => !prev)}
                    >
                        Today&apos;s users
                    </button>
                    <div className="UsersTopFilterWrap">
                        <button
                            type="button"
                            className={`UsersTopFilterBtn ${openTopFilter === "columns" ? "UsersTopFilterBtnOpen" : ""}`}
                            onClick={() => setOpenTopFilter((prev) => (prev === "columns" ? null : "columns"))}
                        >
                            Columns ▾
                        </button>
                        {openTopFilter === "columns" && (
                            <div className="UsersTopFilterDropdown">
                                {INITIAL_COLUMNS.map((col) => (
                                    <label key={col.key} className="UsersTopFilterCheck">
                                        <input type="checkbox" checked={visibleColumnKeys.has(col.key)} onChange={() => toggleColumnVisibility(col.key)} />
                                        <span>{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="UsersTopFilterWrap">
                        <button
                            type="button"
                            className={`UsersTopFilterBtn ${openTopFilter === "roles" ? "UsersTopFilterBtnOpen" : ""} ${selectedRoles.size > 0 ? "UsersTopFilterBtnActive" : ""}`}
                            onClick={() => setOpenTopFilter((prev) => (prev === "roles" ? null : "roles"))}
                        >
                            Roles {selectedRoles.size > 0 ? `(${selectedRoles.size})` : ""} ▾
                        </button>
                        {openTopFilter === "roles" && (
                            <div className="UsersTopFilterDropdown">
                                {UNIQUE_ROLES.map((role) => (
                                    <label key={role} className="UsersTopFilterCheck">
                                        <input type="checkbox" checked={selectedRoles.has(role)} onChange={() => toggleRole(role)} />
                                        <span>{role}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="UsersDateRangeWrap">
                        <span className="UsersDateRangeLabel">Created</span>
                        <div className="UsersDateRangeInputs">
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="UsersDateRangeInput" title="Start date" />
                            <span className="UsersDateRangeSep" aria-hidden>→</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="UsersDateRangeInput" title="End date" />
                        </div>
                    </div>
                </div>
                <div className="UsersTableWrap">
                    <table className="UsersTable" style={{ minWidth: tableMinWidth }}>
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
                                        className={`UsersTh ${draggedIndex === index ? "UsersThDragging" : ""} ${dragOverIndex === index ? "UsersThDragOver" : ""} ${sortBy?.key === col.key ? "UsersThSorted" : ""}`}
                                        style={{ width: getWidth(col.key), minWidth: getWidth(col.key), maxWidth: getWidth(col.key) }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, index)}
                                    >
                                        <span className="UsersThContent">
                                            <span className="UsersThGrip" aria-hidden title="Drag to reorder">⋮⋮</span>
                                            {col.label}
                                        </span>
                                        <div className="UsersThMenuWrap">
                                            <button
                                                type="button"
                                                className="UsersThSortFilterTrigger"
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
                                        <span className="UsersResizeHandle" role="separator" aria-label="Resize column" onMouseDown={(e) => handleResizeStart(e, col.key)} onClick={(e) => e.stopPropagation()} />
                                    </th>
                                ))}
                                <th className="UsersTh UsersThActions" style={{ width: ACTIONS_COLUMN_WIDTH, minWidth: ACTIONS_COLUMN_WIDTH }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedData.map((row, index) => (
                                <tr key={row.id} className={`UsersTr ${index % 2 === 1 ? "UsersTrAlt" : ""}`}>
                                    {displayColumns.map((col) => (
                                        <td key={col.key} className="UsersTd" style={{ maxWidth: getWidth(col.key) }}>
                                            {col.key === "name" ? (
                                                <div className="UsersUserCell">
                                                    <span className="UsersAvatar" aria-hidden>{getInitials(row.name)}</span>
                                                    <span className="UsersName">{row.name}</span>
                                                </div>
                                            ) : col.key === "email" ? (
                                                <div className="UsersEmailCell">
                                                    <svg className="UsersIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                        <polyline points="22,6 12,13 2,6" />
                                                    </svg>
                                                    <span>{row.email}</span>
                                                </div>
                                            ) : col.key === "phoneNumber" ? (
                                                <div className="UsersPhoneCell">
                                                    <svg className="UsersIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                    </svg>
                                                    <span>{row.phoneNumber}</span>
                                                </div>
                                            ) : col.key === "role" ? (
                                                <span className="UsersRoleBadge">{row.role}</span>
                                            ) : (
                                                formatCell(row, col.key, col.format)
                                            )}
                                        </td>
                                    ))}
                                    <td className="UsersTd UsersTdActions">
                                        <button type="button" className="UsersActionBtn" title="Edit user" aria-label="Edit user" onClick={() => openEdit(row)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {typeof document !== "undefined" && openColumnMenu && menuAnchor && createPortal(
                <div className="UsersColumnMenu UsersColumnMenuPortal" ref={menuRef} style={{ left: menuAnchor.x, top: menuAnchor.y }} onClick={(e) => e.stopPropagation()}>
                    {(() => {
                        const col = columns.find((c) => c.key === openColumnMenu);
                        if (!col) return null;
                        return (
                            <>
                                <div className="UsersColumnMenuSection">
                                    <span className="UsersColumnMenuLabel">Sort</span>
                                    <button type="button" onClick={() => { setSortBy({ key: col.key, dir: "asc" }); setOpenColumnMenu(null); setMenuAnchor(null); }}>A → Z</button>
                                    <button type="button" onClick={() => { setSortBy({ key: col.key, dir: "desc" }); setOpenColumnMenu(null); setMenuAnchor(null); }}>Z → A</button>
                                    <button type="button" onClick={() => { setSortBy(null); setOpenColumnMenu(null); setMenuAnchor(null); }}>Clear sort</button>
                                </div>
                                <div className="UsersColumnMenuSection">
                                    <span className="UsersColumnMenuLabel">Filter</span>
                                    <input
                                        type="text"
                                        placeholder={`Filter ${col.label}...`}
                                        value={columnFilters[col.key] ?? ""}
                                        onChange={(e) => setColumnFilters((prev) => ({ ...prev, [col.key]: e.target.value }))}
                                        className="UsersColumnMenuInput"
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

            <Modal
                open={!!editUser}
                onClose={closeEdit}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        transitionDuration: MODAL_TRANSITION_MS,
                        sx: { backgroundColor: "rgba(0,0,0,0.4)" },
                    },
                }}
                className="EditUserMuiModal"
                aria-labelledby="EditUserModalTitle"
                aria-describedby="EditUserModalSubtitle"
            >
                <Fade in={!!editUser} timeout={MODAL_TRANSITION_MS}>
                    <div className="EditUserModal" tabIndex={-1}>
                        {saving && (
                            <div className="EditUserModalLoader" aria-live="polite">
                                <CircularProgress size={40} sx={{ color: "#fff" }} />
                                <span className="EditUserModalLoaderText">Saving...</span>
                            </div>
                        )}
                        <div className="EditUserModalHeader">
                            <div>
                                <h2 id="EditUserModalTitle" className="EditUserModalTitle">Edit User Information</h2>
                                <p id="EditUserModalSubtitle" className="EditUserModalSubtitle">Update user&apos;s personal information. Email cannot be changed.</p>
                            </div>
                            <button type="button" className="EditUserModalClose" onClick={closeEdit} disabled={saving} aria-label="Close modal">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form className="EditUserModalForm" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div className="EditUserField">
                                <label htmlFor="edit-user-email" className="EditUserLabel">Email</label>
                                <input
                                    id="edit-user-email"
                                    type="email"
                                    className="EditUserInput EditUserInputDisabled"
                                    value={(editUser ?? editingUserRef.current)?.email ?? ""}
                                    disabled
                                    readOnly
                                    aria-describedby="edit-user-email-helper"
                                />
                                <span id="edit-user-email-helper" className="EditUserHelper">Email cannot be modified.</span>
                            </div>
                            <div className="EditUserField">
                                <label htmlFor="edit-user-first" className="EditUserLabel">First Name</label>
                                <input
                                    id="edit-user-first"
                                    type="text"
                                    className="EditUserInput"
                                    placeholder="Enter first name"
                                    value={formFirstName}
                                    onChange={(e) => setFormFirstName(e.target.value)}
                                    disabled={saving}
                                />
                            </div>
                            <div className="EditUserField">
                                <label htmlFor="edit-user-last" className="EditUserLabel">Last Name</label>
                                <input
                                    id="edit-user-last"
                                    type="text"
                                    className="EditUserInput"
                                    placeholder="Enter last name"
                                    value={formLastName}
                                    onChange={(e) => setFormLastName(e.target.value)}
                                    disabled={saving}
                                />
                            </div>
                            <div className="EditUserField">
                                <label htmlFor="edit-user-phone" className="EditUserLabel">Phone Number</label>
                                <input
                                    id="edit-user-phone"
                                    type="tel"
                                    className="EditUserInput"
                                    placeholder="Enter phone number"
                                    value={formPhone}
                                    onChange={(e) => setFormPhone(e.target.value)}
                                    disabled={saving}
                                />
                            </div>
                            <div className="EditUserModalActions">
                                <button type="button" className="EditUserBtn EditUserBtnCancel" onClick={closeEdit} disabled={saving}>
                                    Cancel
                                </button>
                                <button type="submit" className="EditUserBtn EditUserBtnSave" disabled={saving}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </section>
    );
}

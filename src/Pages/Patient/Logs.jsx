import { useState, useEffect } from "react";

import NavBar from "../../Components/NavBar";
import NavButton from "../../Components/NavButton";
import BackButton from "../../Components/BackButton";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import {
  FiSearch,
  FiEye,
  FiCalendar,
  FiActivity,
  FiUser,
  FiTag,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { API_BASE_URL } from "../../config/api";
import { Card } from "../../Components/ui/Card";
import { Badge } from "../../Components/ui/Badge";
import { Modal } from "../../Components/ui/Modal";
import { EmptyState } from "../../Components/ui/EmptyState";
import { Skeleton } from "../../Components/ui/Skeleton";

export default function Logs() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, shc_code } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const parseLog = (logItem) => {
    if (!logItem) return null;

    const logStr = (typeof logItem === "string" ? logItem : logItem.raw || "").trim();
    if (!logStr) return null;

    // Pattern: "ISO_TIMESTAMP - ROLE [USER_ID] ACTION_DESCRIPTION"
    const regex = /^([^\s]+)\s*-\s*([A-Za-z0-9_]+)\s*\[([^\]]+)\]\s*(.*)$/;
    const match = logStr.match(regex);

    if (match) {
      const [, timestampStr, roleStr, userIdStr, actionStr] = match;
      const parsedDate = new Date(timestampStr);
      const timestamp = !isNaN(parsedDate.getTime()) ? parsedDate : new Date();

      return {
        raw: logStr,
        timestamp,
        role: roleStr.toUpperCase(),
        userId: userIdStr,
        action: actionStr || "Activity Logged",
        formattedDate: timestamp.toLocaleString(),
      };
    }

    // Fallback if logItem was a legacy object or unformatted string
    const role = (logItem.viewer_type || logItem.role || "PATIENT").toUpperCase();
    const userId = logItem.viewer_id || logItem.userId || "N/A";
    const action = logItem.action || logStr || "ACCESSED_RECORD";

    return {
      raw: logStr,
      timestamp: logItem.created_at ? new Date(logItem.created_at) : new Date(),
      role: role === "UNKNOWN" ? "PATIENT" : role,
      userId,
      action,
      formattedDate: new Date().toLocaleString(),
    };
  };

  useEffect(() => {
    if (!token || !shc_code) return;

    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/patient/profile/data-logs?shc_code=${shc_code}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const rawLogs = res.data?.data?.data_logs || "";

        const logs = rawLogs
          .split(",")
          .map((log) => parseLog(log.trim()))
          .filter(Boolean)
          .reverse();

        setData(logs);
      } catch (err) {
        console.log(err);
        toast.error("API Error: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token, shc_code]);

  const filteredLogs = data
    .filter((log) => {
      const matchesSearch = log.raw.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      const logDate = new Date(log.timestamp);
      const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

      if (start && logDate < start) return false;
      if (end && logDate > end) return false;

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleViewDetails = async (log) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${log.role.toLowerCase()}/profile`, {
        params: { viewer_id: log.userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedLog({ ...log, profile: res.data.data });
    } catch {
      toast.error("Failed to fetch profile");
    }
  };

  const getCreatorDetails = (log) => {
    const profile = log.profile || {};
    const isDoctor = log.role === "DOCTOR";
    return {
      role: log.role,
      tone: isDoctor ? "doctor" : "danger",
      name:
        log.role === "DOCTOR" || log.role === "EXTERN"
          ? profile.full_name
          : profile.name || "Unknown User",
      photo: profile.photo || null,
      details: [
        { icon: FiUser, label: "User ID", value: log.userId },
        { icon: FiTag, label: "Action", value: log.action },
        { icon: FiCalendar, label: "Date", value: log.formattedDate },
        { icon: FiMail, label: "Email", value: profile.email },
        { icon: FiPhone, label: "Phone", value: profile.phone },
      ],
    };
  };

  const creator = selectedLog ? getCreatorDetails(selectedLog) : null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <NavBar />

      <div className="mb-6 flex w-full flex-col items-center">
        <BackButton />
        <NavButton />
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Activity Logs
          </h1>
          <p className="mt-1 text-sm text-muted">View and search through patient activity history</p>
        </div>

        {/* Search & filters */}
        <Card className="mb-5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search logs"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-subtle transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                aria-label="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
              />
              <span className="text-sm font-medium text-subtle">to</span>
              <input
                type="date"
                aria-label="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
              />
              <select
                aria-label="Sort logs"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="h-10 cursor-pointer rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/35"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </Card>

        <p className="mb-4 px-1 text-sm text-muted">
          Showing <span className="font-semibold text-foreground">{filteredLogs.length}</span> logs
        </p>

        <div className="space-y-3">
          {loading ? (
            <>
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </>
          ) : filteredLogs.length > 0 ? (
            filteredLogs.map((log, idx) => (
              <Card key={idx} className="p-4 transition-shadow hover:shadow-lift">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        log.role === "DOCTOR"
                          ? "bg-doctor-soft text-doctor"
                          : "bg-danger-soft text-danger"
                      }`}
                    >
                      <FiActivity size={18} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{log.action}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">
                        <Badge tone={log.role === "DOCTOR" ? "doctor" : "danger"} className="mr-1.5 align-middle">
                          {log.role}
                        </Badge>
                        {log.formattedDate}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewDetails(log)}
                    aria-label={`View details for ${log.role} activity`}
                    className="shrink-0 rounded-full p-2 text-primary transition-colors hover:bg-primary-soft"
                  >
                    <FiEye size={18} aria-hidden="true" />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <EmptyState
                icon={FiActivity}
                title="No logs found"
                description="No logs match your current search and filters."
              />
            </Card>
          )}
        </div>
      </main>

      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={creator?.name || "Details"}
        description={creator?.role}
        size="sm"
      >
        {creator && (
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-3 pb-2">
              {creator.photo ? (
                <img
                  src={creator.photo}
                  alt={creator.name}
                  className="h-20 w-20 rounded-full border-4 border-surface object-cover shadow-card"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-hover text-subtle">
                  <FiUser size={32} aria-hidden="true" />
                </div>
              )}
              <Badge tone={creator.tone}>{creator.role}</Badge>
            </div>
            {creator.details.map(
              (d, i) =>
                d.value && (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-muted">
                      <d.icon size={15} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-subtle">{d.label}</p>
                      <p className="break-words text-sm font-medium text-foreground">{d.value}</p>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

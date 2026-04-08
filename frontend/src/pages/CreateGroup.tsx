import { useState } from "react";
import { apiRequest } from "../api/client";
import type { Group } from "../types";

export default function CreateGroup({ onCreated, onBack }: { onCreated: (g: Group) => void; onBack: () => void }) {
  const [name, setName] = useState("");
  const [groupType, setGroupType] = useState("other");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body: Record<string, unknown> = { name, group_type: groupType, target_currency: targetCurrency };
      if (groupType === "trip") {
        if (startDate) body.trip_start_date = startDate;
        if (endDate) body.trip_end_date = endDate;
      }
      const group = await apiRequest<Group>("/groups", { method: "POST", body });
      onCreated(group);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button data-testid="back-btn" onClick={onBack} className="text-primary-600 mb-4">← Back</button>
      <h1 className="text-xl font-bold mb-4" data-testid="create-group-title">Create Group</h1>
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="create-group-form">
        <input data-testid="group-name-input" type="text" placeholder="Group Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
        <select data-testid="group-type-select" value={groupType} onChange={(e) => setGroupType(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
          <option value="other">Other</option>
          <option value="trip">Trip</option>
          <option value="home">Home</option>
          <option value="couple">Couple</option>
        </select>
        <select data-testid="group-currency-select" value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="INR">INR - Indian Rupee</option>
        </select>
        {groupType === "trip" && (
          <div className="space-y-2">
            <input data-testid="trip-start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="Start Date" />
            <input data-testid="trip-end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 border rounded-lg" placeholder="End Date" />
          </div>
        )}
        {error && <p data-testid="create-group-error" className="text-red-500 text-sm">{error}</p>}
        <button data-testid="create-group-submit" type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium">
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}

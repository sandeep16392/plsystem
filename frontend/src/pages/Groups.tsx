import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import type { Group } from "../types";

export default function Groups({
  onSelect,
  onCreateNew,
}: {
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<Group[]>("/groups");
      setGroups(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold" data-testid="groups-title">Groups</h1>
        <button
          data-testid="create-group-btn"
          onClick={onCreateNew}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"
        >
          + New Group
        </button>
      </div>
      {loading ? (
        <p data-testid="groups-loading">Loading...</p>
      ) : groups.length === 0 ? (
        <p data-testid="groups-empty" className="text-gray-500 text-center mt-10">
          No groups yet. Create your first one!
        </p>
      ) : (
        <div className="space-y-3" data-testid="groups-list">
          {groups.map((g) => (
            <button
              key={g.id}
              data-testid={`group-card-${g.id}`}
              onClick={() => onSelect(g.id)}
              className="w-full text-left p-4 bg-white rounded-lg shadow-sm border hover:border-primary-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold" data-testid="group-name">{g.name}</h3>
                  <p className="text-sm text-gray-500">
                    {g.group_type} · {g.target_currency} · {g.members.length} members
                  </p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{g.group_type}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

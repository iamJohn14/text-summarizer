import React, { useState, useEffect } from "react";

// Interface to define the structure of a history entry
interface HistoryEntry {
  text: string;
  date: string;
  wordCount: number;
  charCount: number;
}

const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Fetch history data from your backend or local storage
    const fetchedHistory: HistoryEntry[] = [
      {
        text: "Naruto Uzumaki became the greatest shinobi of his time through unparalleled power, relentless determination, and his ability to unite and inspire others. Mastering Kurama's chakra and the Sage of Six Paths' power, he achieved near-godlike abilities, defeating formidable foes like Kaguya Ōtsutsuki.",
        date: "December 10, 2024 3:20 PM",
        wordCount: 77,
        charCount: 538,
      },
      // ... other history entries
    ];
    setHistory(fetchedHistory);
  }, []);

  const handleDelete = (index: number) => {
    // Implement logic to delete the history entry
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  return (
    <div className="p-10 md:p-14 space-y-4">
      <div className="text-4xl font-bold">History</div>
      <div className="text-lg text-gray-500">
        View previously summarized texts
      </div>

      {/* Search bar */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search history"
          className="border rounded-md px-3 py-2 w-full"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
          Search
        </button>
      </div>

      {/* History entries */}
      <div className="mt-4">
        {history.map((entry, index) => (
          <div key={index} className="bg-white rounded-md p-4 mb-4">
            <div className="flex justify-between">
              <div>
                <p>{entry.text}</p>
                <p className="text-sm text-gray-500">{entry.date}</p>
                <p className="text-sm text-gray-500">
                  {entry.wordCount} words, {entry.charCount} characters
                </p>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-2">
          Previous
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryView;

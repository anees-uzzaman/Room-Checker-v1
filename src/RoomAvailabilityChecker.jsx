import { useState } from "react";

const TIME_SLOTS = ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "1:00 - 2:00", "2:00 - 3:00", "3:00 - 4:00"];
const CAPACITY_OPTIONS = [30, 40, 50];

const ROOM_BANK = [
  { name: "Room 101", capacity: 30, hasAc: true, hasProjector: true },
  { name: "Room 204", capacity: 40, hasAc: true, hasProjector: false },
  { name: "Lab 3", capacity: 50, hasAc: false, hasProjector: true },
  { name: "Room 5", capacity: 30, hasAc: false, hasProjector: false },
  { name: "Lab 1", capacity: 40, hasAc: true, hasProjector: true },
  { name: "Innovation Lab", capacity: 50, hasAc: true, hasProjector: true },
];

export default function ClassroomAvailabilityChecker() {
  const [timeSlot, setTimeSlot] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [needsAc, setNeedsAc] = useState(false);
  const [needsProjector, setNeedsProjector] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const matches = ROOM_BANK.filter((room) => {
      const meetsCapacity = selectedCapacity === null || room.capacity >= selectedCapacity;
      const meetsAc = !needsAc || room.hasAc;
      const meetsProjector = !needsProjector || room.hasProjector;

      return meetsCapacity && meetsAc && meetsProjector;
    });

    if (matches.length === 0) {
      setResult({
        name: "No matching room",
        message: "No room matches your selected capacity and amenities.",
      });
      return;
    }

    const classroom = matches[Math.floor(Math.random() * matches.length)];
    setResult(classroom);
  };

  const reset = () => {
    setTimeSlot(null);
    setSelectedCapacity(null);
    setNeedsAc(false);
    setNeedsProjector(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-xl text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Room Availability Checker
          </h1>
        </div>
        <p className="text-lg text-slate-500">Find a room that fits your needs instantly.</p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-slate-800">Time Slot</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => {
                  setTimeSlot(slot);
                  setResult(null);
                }}
                className={`rounded-lg border py-3 px-2 text-sm font-medium transition-colors ${
                  timeSlot === slot
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Capacity</h3>
          <div className="flex flex-wrap gap-3">
            {CAPACITY_OPTIONS.map((capacity) => (
              <button
                key={capacity}
                onClick={() => {
                  setSelectedCapacity(capacity);
                  setResult(null);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCapacity === capacity
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                {capacity} people
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedCapacity(null);
                setResult(null);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedCapacity === null
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
              }`}
            >
              Any
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Features</h3>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 rounded-full border
             border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={needsAc}
                onChange={() => {
                  setNeedsAc((value) => !value);
                  setResult(null);
                }}
              />
              AC
            </label>
            <label className="flex items-center gap-2 rounded-full border
             border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={needsProjector}
                onChange={() => {
                  setNeedsProjector((value) => !value);
                  setResult(null);
                }}
              />
              Projector
            </label>
          </div>
        </div>

        {!timeSlot && (
          <p className="text-xs text-slate-400 text-center m-2">
            Select a time slot to continue.
          </p>
        )}

        <button
          onClick={handleCheck}
          disabled={!timeSlot}
          className={`w-full rounded-lg py-3 font-semibold transition-colors ${
            timeSlot
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          Check Availability
        </button>

        {result && (
          <div className="mt-6 flex flex-col items-center text-center border-t border-slate-100 pt-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full
             bg-emerald-100 text-emerald-600 text-2xl font-semibold">✓</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">{result.name}</h2>
            <p className="text-emerald-600 font-medium text-lg mb-4">
              {result.message || "This room matches your requirements."}
            </p>
            {!result.message && (
              <div className="w-full rounded-xl bg-slate-50 p-4 text-left text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Capacity:</span> {result.capacity} people
                </p>
                <p>
                  <span className="font-semibold text-slate-800">AC:</span> {result.hasAc ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Projector:</span> {result.hasProjector ? "Yes" : "No"}
                </p>
              </div>
            )}
            <button
              onClick={reset}
              className="mt-4 text-indigo-600 text-sm font-medium hover:text-red-800 border-2 hover:border-red-600 px-3 py-1 rounded-full transition-colors"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

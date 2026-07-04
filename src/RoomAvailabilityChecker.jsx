import { useState } from "react";
import routine from "./routine.js";

const CAPACITY_OPTIONS = [30, 40, 50];
const DAY_OPTIONS = Array.from(new Set(routine.map((entry) => entry.day).filter(Boolean)));

const ROOM_METADATA = {
  "1501": { capacity: 50, hasAc: true, hasProjector: true },
  "1503": { capacity: 40, hasAc: true, hasProjector: false },
  "1504": { capacity: 50, hasAc: true, hasProjector: false },
  "1505": { capacity: 40, hasAc: true, hasProjector: true },
  "1506": { capacity: 40, hasAc: true, hasProjector: false },
  "UB 103": { capacity: 30, hasAc: true, hasProjector: false },
  "UB 105": { capacity: 30, hasAc: true, hasProjector: false },
  "UB 109": { capacity: 40, hasAc: true, hasProjector: false },
  "UB 110": { capacity: 40, hasAc: true, hasProjector: true },
  "UB 111": { capacity: 50, hasAc: true, hasProjector: true },
  "UB 116": { capacity: 40, hasAc: true, hasProjector: false },
  "2002": { capacity: 30, hasAc: true, hasProjector: false },
  "2004": { capacity: 50, hasAc: true, hasProjector: true },
};

const ROOM_BANK = Array.from(
  new Set(
    routine
      .map((entry) => entry.room)
      .filter((room) => room && room !== "Online")
  )
).map((roomName) => ({
  name: roomName,
  capacity: ROOM_METADATA[roomName]?.capacity ?? 30,
  hasAc: ROOM_METADATA[roomName]?.hasAc ?? true,
  hasProjector: ROOM_METADATA[roomName]?.hasProjector ?? false,
}));

const normalizeTime = (value) => {
  if (!value) return "";
  return value.replace(/\./g, ":").replace(/\s+/g, " ").trim();
};

const ROUTINE_TIME_SLOTS = [...new Set(routine.map((entry) => normalizeTime(entry.time)))];

const getBookedRoomsForTimeSlot = (day, timeSlot) => {
  if (!day || !timeSlot || !routine) return new Set();

  const selectedTime = normalizeTime(timeSlot);
  const bookedRooms = new Set();

  routine.forEach((entry) => {
    if (entry.day === day && normalizeTime(entry.time) === selectedTime && entry.room !== "Online") {
      bookedRooms.add(entry.room);
    }
  });

  return bookedRooms;
};

export default function ClassroomAvailabilityChecker() {
  const [selectedDay, setSelectedDay] = useState("Saturday");
  const [timeSlot, setTimeSlot] = useState(null);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [needsAc, setNeedsAc] = useState(false);
  const [needsProjector, setNeedsProjector] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const bookedRooms = getBookedRoomsForTimeSlot(selectedDay, timeSlot);

    const matches = ROOM_BANK.filter((room) => {
      const meetsCapacity = selectedCapacity === null || room.capacity >= selectedCapacity;
      const meetsAc = !needsAc || room.hasAc;
      const meetsProjector = !needsProjector || room.hasProjector;
      const isNotBooked = !bookedRooms.has(room.name);

      return meetsCapacity && meetsAc && meetsProjector && isNotBooked;
    });

    if (matches.length === 0) {
      setResult({
        name: "No matching room",
        message: "No room matches your selected day, time, capacity, and amenities.",
      });
      return;
    }

    const classroom = matches[Math.floor(Math.random() * matches.length)];
    setResult(classroom);
  };

  const reset = () => {
    setSelectedDay("Saturday");
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
          <h3 className="font-semibold text-slate-800 mb-3">Day</h3>
          <div className="flex flex-wrap gap-3">
            {DAY_OPTIONS.map((day) => (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setResult(null);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedDay === day
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-slate-800">Time Slot</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROUTINE_TIME_SLOTS.map((slot) => (
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
          <p className="mt-2 text-xs text-slate-500">
            Availability is checked against the imported routine schedule for {selectedDay}.
          </p>
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
            <label className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
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
            <label className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
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
            Select a day and time slot to continue.
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
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-semibold">
              ✓
            </div>
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

import { useState } from "react";

const TIME_SLOTS = ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "1:00 - 2:00", "2:00 - 3:00", "3:00 - 4:00"];

const CLASSROOM_BANK = ["Room 101", "Room 204", "Lab 3", "Room 5", "Lab 1", "Innovation Lab"];

export default function ClassroomAvailabilityChecker() {
  const [timeSlot, setTimeSlot] = useState(null);
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const classroom = CLASSROOM_BANK[Math.floor(Math.random() * CLASSROOM_BANK.length)];
    setResult(classroom);
  };

  const reset = () => {
    setTimeSlot(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-xl text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Classroom Availability Checker
          </h1>
        </div>
        <p className="text-lg text-slate-500">Find a classroom instantly.</p>
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
                onClick={() => { setTimeSlot(slot); setResult(null); }}
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
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-semibold">✓</div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">{result}</h2>
            <p className="text-emerald-600 font-medium text-lg mb-4">This classroom is available.</p>
            <button
              onClick={reset}
              className="text-indigo-600 text-sm font-medium hover:text-red-800 border-2 hover:border-red-600 p-1 rounded-3xl transition-colors"
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";

const STORAGE_KEY = "passbook_rows_v1";

export default function PassbookPrint() {
  const printRef = useRef(null);

  const [rows, setRows] = useState([
    { date: "", particulars: "", debit: "", credit: "", balance: 0 },
  ]);

  /* ===============================
     LOAD DATA FROM LOCAL STORAGE
  =============================== */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setRows(JSON.parse(saved));
        } catch (err) {
          console.error("Invalid localStorage data", err);
        }
      }
    }
  }, []);

  /* ===============================
     SAVE DATA TO LOCAL STORAGE
  =============================== */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    }
  }, [rows]);

  /* ===============================
     ADD ROW
  =============================== */
  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { date: "", particulars: "", debit: "", credit: "", balance: 0 },
    ]);
  };

  /* ===============================
     UPDATE ROW & BALANCE
  =============================== */
  const updateRow = (index, field, value) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      const debit = Number(updated[index].debit || 0);
      const credit = Number(updated[index].credit || 0);
      const prevBalance =
        index > 0 ? Number(updated[index - 1].balance || 0) : 0;

      updated[index].balance = prevBalance + credit - debit;
      return updated;
    });
  };

  /* ===============================
     PRINT HANDLER
  =============================== */
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "passbook",
    removeAfterPrint: false,
    onAfterPrint: () => {
      // OPTIONAL: clear storage after print
      // localStorage.removeItem(STORAGE_KEY);
    },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ENTRY TABLE (SCREEN ONLY) */}
      <table className="w-full text-2xl mb-6 print:hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Particulars</th>
            <th className="p-2">Debit</th>
            <th className="p-2">Credit</th>
            <th className="p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  type="date"
                  value={row.date}
                  className="w-full p-1 outline-none"
                  onChange={(e) => updateRow(i, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.particulars}
                  className="w-full text-center p-1 outline-none"
                  placeholder="Details"
                  onChange={(e) => updateRow(i, "particulars", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.debit}
                  className="w-full text-center p-1 outline-none"
                  onChange={(e) => updateRow(i, "debit", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.credit}
                  className="w-full text-center p-1 outline-none"
                  onChange={(e) => updateRow(i, "credit", e.target.value)}
                />
              </td>
              <td className="p-1 text-right">{row.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mb-8 print:hidden">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Row
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Print
        </button>
      </div>

      {/* PRINT CONTENT */}
      <div
        ref={printRef}
        className="hidden print:block text-[11px]"
        style={{
          paddingTop: "0px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <h2 className="text-center font-semibold mb-2">
          System Generated Record – For Internal Use Only
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-1">Date</th>
              <th className="p-1">Particulars</th>
              <th className="p-1">Debit</th>
              <th className="p-1">Credit</th>
              <th className="p-1">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="p-1 text-center">{row.date}</td>
                <td className="p-1">{row.particulars}</td>
                <td className="p-1 text-center">{row.debit}</td>
                <td className="p-1 text-center">{row.credit}</td>
                <td className="p-1 text-center">{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PRINT CONFIG */}
      <style jsx global>{`
        @media print {
          @page {
            size: A6;
            margin: 0;
          }
          body {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

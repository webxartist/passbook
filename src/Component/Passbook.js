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
     LOAD FROM LOCAL STORAGE
  =============================== */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRows(JSON.parse(saved));
      } catch {}
    }
  }, []);

  /* ===============================
     SAVE TO LOCAL STORAGE
  =============================== */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
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
     PRINT (CORRECT WAY)
  =============================== */
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "passbook",
    pageStyle: `
      @page { size: A6; margin: 0; }
      body { margin: 0; }
    `,
  });

  const safePrint = () => {
    if (!printRef.current) {
      alert("Print content not ready");
      return;
    }
    handlePrint();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* SCREEN TABLE */}
      <table className="w-full text-xl mb-6 print:hidden">
        <thead>
          <tr>
            <th>Date</th>
            <th>Particulars</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateRow(i, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.particulars}
                  onChange={(e) => updateRow(i, "particulars", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.debit}
                  onChange={(e) => updateRow(i, "debit", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.credit}
                  onChange={(e) => updateRow(i, "credit", e.target.value)}
                />
              </td>
              <td>{row.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BUTTONS */}
      <div className="flex gap-4 print:hidden">
        <button onClick={addRow}>Add Row</button>
        <button onClick={safePrint}>Print</button>
      </div>

      {/* PRINT AREA */}
      <div ref={printRef} className="hidden print:block text-[11px]">
        <h3 style={{ textAlign: "center" }}>
          System Generated Record – Internal Use
        </h3>

        <table width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Particulars</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.date}</td>
                <td>{row.particulars}</td>
                <td>{row.debit}</td>
                <td>{row.credit}</td>
                <td>{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

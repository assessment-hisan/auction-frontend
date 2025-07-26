import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useStore } from "../../store/useStore";
import Button from "../ui/Button";

const PrintStudentPoolTable = () => {
  const students = useStore((state) => state.students);

  const groupBySectionAndPool = () => {
    const sectionMap = {};

    students.forEach((student) => {
      const section = student.section || "Unknown Section";
      const pool = student.pool || "Unassigned";

      if (!sectionMap[section]) sectionMap[section] = {};
      if (!sectionMap[section][pool]) sectionMap[section][pool] = [];

      sectionMap[section][pool].push(`${student.admissionNumber} - ${student.name}`);
    });

    return sectionMap;
  };

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const data = groupBySectionAndPool();

    let y = 5;

    Object.entries(data).forEach(([section, pools], sectionIdx) => {
      const allPools = Object.keys(pools).sort();
      const poolChunks = chunkArray(allPools, 3); // 3 columns per row

      doc.setFontSize(14);
      doc.text(`Section: ${section}`, 14, y);
      y += 6;

      poolChunks.forEach((chunk) => {
        const maxRows = Math.max(...chunk.map((pool) => pools[pool].length));

        const bodyRows = Array.from({ length: maxRows }, (_, i) =>
          chunk.map((pool) => pools[pool][i] || "")
        );

        autoTable(doc, {
          startY: y,
          head: [chunk],
          body: bodyRows,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [63, 81, 181] },
          margin: { left: 10, right: 10 },
          theme: "grid",
          didDrawPage: (data) => {
            y = data.cursor.y + 10;
          },
        });

        y += 10;
        if (y > 260) {
          doc.addPage();
          y = 10;
        }
      });

      y += 10;
    });

    doc.save("Student_Pools_By_Section.pdf");
  };

  return (
    <div className="flex justify-end mt-4">
      <Button onClick={generatePdf} className="bg-indigo-600 text-white hover:bg-indigo-700">
        Download Pool Report (3 Columns Layout)
      </Button>
    </div>
  );
};

export default PrintStudentPoolTable;

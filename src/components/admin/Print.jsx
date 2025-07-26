import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useStore } from "../../store/useStore";
import Button from "../ui/Button";

const PrintStudentPoolTable = () => {
  const students = useStore((state) => state.students);

  const groupBySectionAndPool = () => {
    const sectionMap = {};
    const unassignedSection = { Unassigned: [] };

    students.forEach((student) => {
      const section = student.section?.trim();
      const pool = student.pool || "Unassigned";
      const label = `${student.admissionNumber} - ${student.name}`;

      if (!section || section.toLowerCase() === "unknown") {
        unassignedSection.Unassigned.push(label);
      } else {
        if (!sectionMap[section]) sectionMap[section] = {};
        if (!sectionMap[section][pool]) sectionMap[section][pool] = [];
        sectionMap[section][pool].push(label);
      }
    });

    return { sectionMap, unassignedSection };
  };

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const renderSection = (doc, sectionName, pools, yStart = 10) => {
    let y = yStart;
    doc.setFontSize(14);
    doc.text(`Section: ${sectionName}`, 14, y);
    y += 8;

    const poolNames = Object.keys(pools).sort();
    const poolChunks = chunkArray(poolNames, 3);

    poolChunks.forEach((chunk) => {
      const maxRows = Math.max(...chunk.map((p) => pools[p].length));
      const bodyRows = Array.from({ length: maxRows }, (_, i) =>
        chunk.map((p) => pools[p][i] || "")
      );

      autoTable(doc, {
        startY: y,
        head: [chunk],
        body: bodyRows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [63, 81, 181] },
        margin: { left: 10, right: 10 },
        theme: "grid",
        didDrawPage: (tableData) => {
          y = tableData.cursor.y + 4;
        },
      });

      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    });

    return y + 6;
  };

  const renderUnassignedPage = (doc, unassignedList) => {
    doc.setFontSize(14);
    doc.text("Unassigned Students (No Section)", 14, 10);
    doc.setFontSize(10);

    const bodyRows = unassignedList.map((label) => [label]);

    autoTable(doc, {
      startY: 20,
      head: [["Student"]],
      body: bodyRows,
      styles: { fontSize: 10 },
      margin: { left: 10, right: 10 },
      theme: "grid",
    });
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const { sectionMap, unassignedSection } = groupBySectionAndPool();

    let y = 10;

    // Render valid sections
    Object.entries(sectionMap).forEach(([section, pools], idx) => {
      if (idx > 0) {
        doc.addPage();
        y = 10;
      }
      y = renderSection(doc, section, pools, y);
    });

    // Add unassigned students on a separate page
    if (unassignedSection.Unassigned.length > 0) {
      doc.addPage();
      renderUnassignedPage(doc, unassignedSection.Unassigned);
    }

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

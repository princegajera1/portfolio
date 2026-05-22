export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  initials: string;
}

export function calculateTotalExperience(experiences: Experience[]) {
  if (!experiences || experiences.length === 0) {
    return { value: "0", label: "Exp Years", months: 0 };
  }

  const monthNames = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec"
  ];
  
  const fullMonthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  function parseMonth(str: string): number {
    const s = str.toLowerCase().trim();
    const idx = monthNames.findIndex(m => s.startsWith(m));
    if (idx !== -1) return idx;
    const fIdx = fullMonthNames.findIndex(m => s.startsWith(m));
    return fIdx !== -1 ? fIdx : 0;
  }

  let totalMonths = 0;

  experiences.forEach((exp) => {
    const period = exp.period || "";
    // Clean up dash/hyphen characters and spaces
    const normalized = period.replace(/–/g, "-").replace(/\s+/g, " ");
    const parts = normalized.split("-").map(p => p.trim());

    if (parts.length === 0 || !parts[0]) return;

    const startStr = parts[0];
    const endStr = parts[1] || "";

    // Parse start date
    const startMatch = startStr.match(/([a-zA-Z]+)\s+(\d{4})/);
    if (!startMatch) {
      const yearOnly = startStr.match(/\d{4}/);
      if (yearOnly) {
        totalMonths += 12; // fallback
      }
      return;
    }

    const startMonth = parseMonth(startMatch[1]);
    const startYear = parseInt(startMatch[2], 10);

    let endMonth = startMonth;
    let endYear = startYear;

    if (endStr) {
      if (endStr.toLowerCase().includes("present") || endStr.toLowerCase().includes("current")) {
        const now = new Date();
        endMonth = now.getMonth();
        endYear = now.getFullYear();
      } else {
        const endMatch = endStr.match(/([a-zA-Z]+)\s+(\d{4})/);
        if (endMatch) {
          endMonth = parseMonth(endMatch[1]);
          endYear = parseInt(endMatch[2], 10);
        }
      }
    } else {
      // Single month mentioned like "July 2025" -> it's 1 month
      totalMonths += 1;
      return;
    }

    const diffMonths = (endYear * 12 + endMonth) - (startYear * 12 + startMonth) + 1;
    if (diffMonths > 0) {
      totalMonths += diffMonths;
    }
  });

  if (totalMonths >= 12) {
    const yrs = totalMonths / 12;
    const yrsStr = yrs % 1 === 0 ? yrs.toFixed(0) : yrs.toFixed(1);
    return {
      value: `${yrsStr}+`,
      label: "Exp Years",
      months: totalMonths
    };
  } else {
    return {
      value: `${totalMonths}+`,
      label: totalMonths === 1 ? "Exp Month" : "Exp Months",
      months: totalMonths
    };
  }
}

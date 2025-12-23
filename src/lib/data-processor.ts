export interface ProcessedData {
  categoryCounts: Record<string, Record<string, number>>;
  statusCounts: Record<string, number>;
}

// Process the raw JSON data into a format suitable for visualization
export function processData(
  data: Record<string, Record<string, string>> | null | undefined
): ProcessedData {
  // Add null check for input data
  if (!data) {
    return {
      categoryCounts: {},
      statusCounts: {
        ans_1: 0,
        ans_2: 0,
        ans_3: 0,
        ans_4: 0, // Not Sure
      },
    };
  }

  const categoryCounts: Record<string, Record<string, number>> = {};
  const statusCounts: Record<string, number> = {
    ans_1: 0, // Yes
    ans_2: 0, // Not Applicable
    ans_3: 0, // No
    ans_4: 0, // Not Sure
  };

  // Process each category
  Object.entries(data).forEach(([category, controls]) => {
    if (!controls) return; // Skip if controls is null or undefined

    categoryCounts[category] = {
      ans_1: 0,
      ans_2: 0,
      ans_3: 0,
      ans_4: 0, // Not Sure
    };

    // Count statuses within each category
    Object.values(controls).forEach((status) => {
      if (status && categoryCounts[category][status] !== undefined) {
        categoryCounts[category][status]++;
        statusCounts[status]++;
      }
    });
  });

  return {
    categoryCounts,
    statusCounts,
  };
}

// Generate sample historical data for comparison
export function getHistoricalData(): Record<string, Record<string, string>> {
  return {
    de: {
      'DE.AE-02': 'ans_3',
      'DE.AE-03': 'ans_3',
      'DE.AE-04': 'ans_2',
      'DE.AE-06': 'ans_3',
      'DE.AE-07': 'ans_3',
      'DE.AE-08': 'ans_3',
      'DE.CM-01': 'ans_3',
      'DE.CM-02': 'ans_3',
      'DE.CM-03': 'ans_3',
      'DE.CM-06': 'ans_3',
      'DE.CM-09': 'ans_3',
    },
    go: {
      'GV.OC-01': 'ans_3',
      'GV.OC-02': 'ans_3',
      'GV.OC-03': 'ans_2',
      'GV.OC-04': 'ans_2',
      'GV.OC-05': 'ans_3',
      'GV.OV-01': 'ans_2',
      'GV.OV-02': 'ans_3',
      'GV.OV-03': 'ans_2',
      'GV.PO-01': 'ans_2',
      'GV.PO-02': 'ans_3',
      'GV.RM-01': 'ans_2',
      'GV.RM-02': 'ans_3',
      'GV.RM-03': 'ans_2',
      'GV.RM-04': 'ans_2',
      'GV.RM-05': 'ans_2',
      'GV.RM-06': 'ans_3',
      'GV.RM-07': 'ans_2',
      'GV.RR-01': 'ans_2',
      'GV.RR-02': 'ans_3',
      'GV.RR-03': 'ans_3',
      'GV.RR-04': 'ans_2',
      'GV.SC-01': 'ans_3',
      'GV.SC-02': 'ans_2',
      'GV.SC-03': 'ans_3',
      'GV.SC-04': 'ans_2',
      'GV.SC-05': 'ans_3',
      'GV.SC-06': 'ans_3',
      'GV.SC-07': 'ans_2',
      'GV.SC-08': 'ans_3',
      'GV.SC-09': 'ans_3',
      'GV.SC-10': 'ans_3',
    },
    id: {
      'ID.AM-03': 'ans_2',
      'ID.AM-04': 'ans_3',
      'ID.AM-05': 'ans_3',
      'ID.AM-07': 'ans_3',
      'ID.AM-08': 'ans_3',
      'ID.IM-01': 'ans_3',
      'ID.IM-02': 'ans_3',
      'ID.IM-03': 'ans_2',
      'ID.IM-04': 'ans_2',
      'ID.RA-01': 'ans_3',
      'ID.RA-02': 'ans_3',
      'ID.RA-03': 'ans_2',
      'ID.RA-04': 'ans_2',
      'ID.RA-05': 'ans_3',
      'ID.RA-06': 'ans_2',
      'ID.RA-07': 'ans_2',
      'ID.RA-08': 'ans_3',
      'ID.RA-09': 'ans_2',
      'ID.RA-10': 'ans_2',
    },
    pr: {
      'PR.AA-01': 'ans_2',
      'PR.AA-02': 'ans_2',
      'PR.AA-03': 'ans_2',
      'PR.AA-04': 'ans_2',
      'PR.AA-05': 'ans_3',
      'PR.AA-06': 'ans_3',
      'PR.AT-01': 'ans_3',
      'PR.AT-02': 'ans_3',
      'PR.DS-01': 'ans_2',
      'PR.DS-02': 'ans_3',
      'PR.DS-10': 'ans_3',
      'PR.DS-11': 'ans_3',
      'PR.IR-01': 'ans_2',
      'PR.IR-02': 'ans_2',
      'PR.IR-03': 'ans_2',
      'PR.IR-04': 'ans_2',
      'PR.PS-01': 'ans_3',
      'PR.PS-02': 'ans_3',
      'PR.PS-03': 'ans_3',
      'PR.PS-04': 'ans_2',
      'PR.PS-05': 'ans_3',
      'PR.PS-06': 'ans_3',
    },
    re: {
      'RC.CO-03': 'ans_3',
      'RC.CO-04': 'ans_3',
      'RC.RP-01': 'ans_2',
      'RC.RP-02': 'ans_2',
      'RC.RP-03': 'ans_2',
      'RC.RP-04': 'ans_3',
      'RC.RP-05': 'ans_3',
      'RC.RP-06': 'ans_2',
    },
    rs: {
      'RS.AN-03': 'ans_3',
      'RS.AN-06': 'ans_3',
      'RS.AN-07': 'ans_3',
      'RS.AN-08': 'ans_2',
      'RS.CO-02': 'ans_3',
      'RS.CO-03': 'ans_2',
      'RS.MA-01': 'ans_3',
      'RS.MA-02': 'ans_2',
      'RS.MA-03': 'ans_2',
      'RS.MA-04': 'ans_3',
      'RS.MA-05': 'ans_3',
      'RS.MI-01': 'ans_2',
      'RS.MI-02': 'ans_3',
    },
  };
}

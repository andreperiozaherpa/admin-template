function formatJabatan(kode: string): string {
  const map: Record<string, string> = {
    bupati: "Bupati Tubaba",
    sekda: "Sekretaris Daerah",
    kadis: "Kepala Dinas",
  };
  return map[kode.toLowerCase()] || kode.toUpperCase();
}

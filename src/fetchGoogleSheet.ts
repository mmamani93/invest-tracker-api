import fetch from 'node-fetch'

interface GoogleSheetRow {
  c: Array<{ v: any } | null>;
}

export async function fetchInvestments() {
  const spreadsheetId = '11VnaReUoe3-w0iBjN81o1XG1z7eyXBKvoEqewoKxdMs'; // tu ID de hoja
  const sheetName = 'Holdings'; // nombre de tu pestaña
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    // Extraer el JSON envuelto en la respuesta
    const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonText);

    // Procesar filas
    const rows = data.table.rows;

    // Crear un array de objetos con los datos relevantes
    const investments = rows.map((row: GoogleSheetRow) => {
      const c = row.c;

      return {
        invested: c[0]?.v || '',          // columna A
        current: c[2]?.v || '',           // columna C
        percentage: c[3]?.v || ''         // columna D
      };
    });

    return investments;

  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    return [];
  }
}
async function main() {
  const headers = {
    'Authorization': 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcImEwMmQ2YTI0LTYyYTktNDA3YS1iYzQ2LTQ0ZTQzYWZkZTNiOVwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjBmMzAyY2ZkLWY1MDMtNGVjYS1hYTY3LTM0ZmU2MzdmYzY4NVwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI2NTE5Y2YzNS05MGUxLTQ0YmEtYWI4Ny02MWRmYTY1YjBkNGRcIn19IiwiaWF0IjoxNzg1MzQyNTE5fQ.Kuk9iCS9YzFgrHDVXde7siS-QcTIKxAgCi6loiu45QT4GeXnjI7N9N6E6cEDW1VSNTvA_lQXbHTW8Z4mf3T-UpxFio7ET0a9ftbAes_KM9xLZzLoKIC4HO1UIkBCIppNKEApEG0nb6QEdtZOoCBPU_dRoTn5J-O5tESfpN5GWBVWowORA_BSCxUP2gN-pKMTznMNlTim99xtox--6hDfcxA2myMecUrILP4he4VMiO6MFDMJnrM0MPipTbpXxhH8k-cLM5ZynbqsbWgNu8d5zIQZYWchL496K-DGL1WZ46lCp1WbhUIBF5ez_KdL5Sd7cJmpvSbC4fqRCiXa68espA',
    'wix-site-id': 'be07e82f-dd8d-4a26-828d-fce6bdb485bb',
    'Content-Type': 'application/json',
  };
  const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      dataCollectionId: 'Import2',
      query: {
        filter: { university_name: { $contains: 'MIT' } },
        paging: { limit: 3 },
      },
    }),
  });
  const data = await res.json();
  if (data.dataItems && data.dataItems.length > 0) {
    data.dataItems.forEach((item, i) => {
      console.log(`\n=== ITEM ${i+1}: ${item.data.university_name} ===`);
      console.log(JSON.stringify(item.data, null, 2));
    });
  } else {
    console.log('No items or error:', JSON.stringify(data, null, 2));
  }
}
main().catch(console.error);

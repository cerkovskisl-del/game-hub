export default async function handler(req, res) {
  // Atļaut CORS pieprasījumus tavai lapai
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  let beastSubs = 497000000;
  let pepeSubs = 85;

  // 1. MrBeast datu iegūšana no socialcounts
  try {
    const response = await fetch('https://api.socialcounts.org/youtube-live-subscriber-count/UCX6OQ3DkcsbYNE6H8uQQuVA');
    if (response.ok) {
      const data = await response.json();
      if (data && data.est_sub) {
        beastSubs = parseInt(data.est_sub, 10);
      }
    }
  } catch (e) {
    console.error("Servera kļūda nolasot MrBeast:", e);
  }

  // 2. Pepe datu iegūšana no YouTube publiskās lapas
  try {
    const responsePepe = await fetch('https://www.youtube.com/@PEPE_real_true', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (responsePepe.ok) {
      const html = await responsePepe.text();
      const match = html.match(/"subscriberCountText"\s*:\s*\{\s*"simpleText"\s*:\s*"([^"]+)"\}/) || 
                    html.match(/"content"\s*:\s*"([^"]+)\s+subscribers"/i);
      if (match && match[1]) {
        let cleanText = match[1].replace(/[^0-9]/g, '');
        let parsedNum = parseInt(cleanText, 10);
        if (!isNaN(parsedNum) && parsedNum > 0) {
          pepeSubs = parsedNum;
        }
      }
    }
  } catch (e) {
    console.error("Servera kļūda nolasot Pepe:", e);
  }

  // Nosūta sagatavotos datus tīrā JSON formātā
  res.status(200).json({
    beast: beastSubs,
    pepe: pepeSubs
  });
}

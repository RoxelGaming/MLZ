const SUPABASE_URL = 'https://mjxktryrqsxjittcfsev.supabase.co';
const SUPABASE_KEY = 'TWÓJ_ANON_KEY';

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const tableBody = document.getElementById('ekstraliga-body');

async function loadEkstraliga() {
  const { data, error } = await supabaseClient
    .from('league_table')
    .select('*')
    .eq('league', 'Ekstraliga')
    .order('points', { ascending: false });

  if (error) {
    tableBody.innerHTML = `<tr><td colspan="6">Błąd ładowania</td></tr>`;
    return;
  }

  tableBody.innerHTML = '';

  data.forEach((team, index) => {
    let rowClass = '';

    if (index < 6) rowClass = 'playoff';
    else if (index === 6) rowClass = 'barrage';
    else if (index === 7) rowClass = 'playdown';

    tableBody.innerHTML += `
      <tr class="${rowClass}">
        <td>${index + 1}</td>
        <td>${team.team_name}</td>
        <td>${team.matches}</td>
        <td>${team.wins}</td>
        <td>${team.losses}</td>
        <td><strong>${team.points}</strong></td>
      </tr>
    `;
  });
}

// 🔄 live update
supabaseClient
  .channel('ekstraliga-live')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'league_table' },
    loadEkstraliga
  )
  .subscribe();

loadEkstraliga();
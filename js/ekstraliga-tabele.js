const SUPABASE_URL = 'https://mjxktryrqsxjittcfsev.supabase.co';
const SUPABASE_KEY = 'TU_WKLEJ_CAŁY_ANON_KEY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const tableBody = document.getElementById('ekstraliga-body');

// Główna funkcja do ładowania danych
async function loadEkstraliga() {
    const { data, error } = await supabaseClient
        .from('league_table')
        .select('*')
        .eq('league', 'Ekstraliga')
        .order('points', { ascending: false });

    if (error) {
        tableBody.innerHTML = `<tr><td colspan="6">Błąd ładowania: ${error.message}</td></tr>`;
        console.error('Error fetching data:', error);
        return;
    }

    // Mapowanie danych na wiersze tabeli
    // Używamy metody join(), aby uniknąć wielokrotnego renderowania DOM
    tableBody.innerHTML = data.map((team, index) => {
        const position = index + 1;
        let rowClass = '';

        // Logika przypisywania klas CSS
        if (position <= 6) rowClass = 'playoff';
        else if (position === 7) rowClass = 'barrage'; // baraze
        else if (position === 8) rowClass = 'playdown'; // spadek

        return `
            <tr class="${rowClass}">
                <td>${position}</td>
                <td>${team.team || team.team_name}</td> 
                <td>${team.matches}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td><strong>${team.points}</strong></td>
            </tr>
        `;
    }).join('');
}

// Konfiguracja subskrypcji w czasie rzeczywistym (Real-time)
supabaseClient
    .channel('ekstraliga-live')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'league_table' },
        () => {
            console.log('Database updated, reloading...');
            loadEkstraliga();
        }
    )
    .subscribe();

// Pierwsze wywołanie funkcji przy załadowaniu strony
loadEkstraliga();
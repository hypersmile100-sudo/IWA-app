// js/leaderboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const leaderboardBody = document.getElementById('leaderboard-body');

    async function loadLeaderboard() {
        try {
            // Fetch all officers from the new table, sorted by rating
            const { data, error } = await supabaseClient
                .from('iwa_officers')
                .select('*')
                .order('average_rating', { ascending: false });

            if (error) throw error;

            if (data.length === 0) {
                leaderboardBody.innerHTML = '<tr><td colspan="6">No professionals found.</td></tr>';
                return;
            }

            leaderboardBody.innerHTML = data.map((officer, index) => `
                <tr>
                    <td>#${index + 1}</td>
                    <td>
                        <div class="officer-cell">
                            <img src="${officer.image_url}" class="officer-avatar" alt="Avatar">
                            <div>
                                <div class="officer-name">${officer.name}</div>
                                <div class="officer-post">${officer.post}</div>
                            </div>
                        </div>
                    </td>
                    <td>${officer.location}</td>
                    <td>${officer.projects_completed}</td>
                    <td><span class="rating-star">★</span> ${officer.average_rating}</td>
                    <td><a href="${officer.portfolio_url}" class="btn btn-secondary btn-view">View</a></td>
                </tr>
            `).join('');

        } catch (error) {
            console.error("Error loading leaderboard:", error);
            leaderboardBody.innerHTML = `<tr><td colspan="6">Error loading data.</td></tr>`;
        }
    }

    loadLeaderboard();
});
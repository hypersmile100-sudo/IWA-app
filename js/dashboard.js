// js/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const statSubmitted = document.getElementById('stat-submitted');
    const statInProgress = document.getElementById('stat-in-progress');
    const statCompleted = document.getElementById('stat-completed');
    const statTotal = document.getElementById('stat-total');

    try {
        // We can call get-all-projects here as it's a read-only, safe function.
        const { data, error } = await supabaseClient.functions.invoke('get-all-projects');
        if (error) throw error;

        const projects = data.projects.filter(p => !p.deleted_at); // Exclude binned projects
        
        statSubmitted.textContent = projects.filter(p => p.status === 'SUBMITTED').length;
        statInProgress.textContent = projects.filter(p => p.status === 'IN PROGRESS').length;
        // This is a simple version. A real one would check the date.
        statCompleted.textContent = projects.filter(p => p.status === 'COMPLETED' || p.status === 'DELIVERED').length;
        statTotal.textContent = projects.length;

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
        document.getElementById('stats-grid').innerHTML = '<p class="error-text">Could not load dashboard stats.</p>';
    }
});
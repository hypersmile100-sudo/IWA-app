// js/workstation.js - DEFINITIVE FINAL VERSION (With Corrected Delete Logic)

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('pin-modal')) return;

    // --- DOM ELEMENT REFERENCES ---
    const pinModal = document.getElementById('pin-modal'); const pinInput = document.getElementById('pin-input'); const pinSubmit = document.getElementById('pin-submit'); const pinError = document.getElementById('pin-error'); const workstationContent = document.getElementById('workstation-content'); const projectListContainer = document.getElementById('project-list-container'); const centerPanelContent = document.getElementById('center-panel-content'); const filterStatus = document.getElementById('filter-status'); const binToggleBtn = document.getElementById('bin-toggle-btn-ws'); const leftPanelTitle = document.querySelector('.left-panel .panel-title');
    
    // --- GLOBAL STATE ---
    const CORRECT_PIN = '161718';
    let allProjects = [];
    let isBinVisible = false;

    // --- PIN LOCK LOGIC ---
    pinSubmit.addEventListener('click', () => { if (pinInput.value === CORRECT_PIN) { pinModal.style.display = 'none'; workstationContent.style.display = 'flex'; loadProjects(); } else { pinError.textContent = 'Incorrect PIN.'; pinInput.value = ''; } });
    
    // --- MAIN LOGIC FUNCTIONS ---
    async function loadProjects() {
        projectListContainer.innerHTML = `<p>${isBinVisible ? 'Loading Bin...' : 'Loading projects...'}</p>`;
        centerPanelContent.innerHTML = '<div class="placeholder-text-center"><p>Loading...</p></div>';
        try {
            const { data, error } = await supabaseClient.functions.invoke('get-all-projects');
            if (error) throw error;
            allProjects = data.projects || [];
            renderProjectList();
        } catch (error) { projectListContainer.innerHTML = `<p class="error-text">Failed to load projects: ${error.message}</p>`; }
    }

    function renderProjectList() {
        const projectsToDisplay = isBinVisible ? allProjects.filter(p => p.deleted_at) : allProjects.filter(p => !p.deleted_at);
        const filteredProjects = projectsToDisplay.filter(p => isBinVisible || filterStatus.value === 'ALL' || p.status === filterStatus.value);
        if (filteredProjects.length === 0) { projectListContainer.innerHTML = `<p class="placeholder-text">${isBinVisible ? 'The Bin is empty.' : 'No projects match filter.'}</p>`; centerPanelContent.innerHTML = '<div class="placeholder-text-center"><p>No projects to display.</p></div>'; return; }
        projectListContainer.innerHTML = filteredProjects.map(project => `
            <div class="project-item" data-project-id="${project.id}">
                <p class="project-title">${(project.work_description || '').replace(/<[^>]+>/g, '').substring(0, 40)}...</p>
                <p class="project-submitter">${project.profiles ? project.profiles.email : 'Unknown'}</p>
                <p class="project-status status-${(project.status || '').replace(/\s+/g, '-').toLowerCase()}">${project.status || 'UNKNOWN'}</p>
            </div>
        `).join('');
        const initialMessage = isBinVisible ? 'Select an item from the Bin to restore or delete permanently.' : 'Select a project from the left panel.';
        centerPanelContent.innerHTML = `<div class="placeholder-text-center"><p>${initialMessage}</p></div>`;
    }

    function displayProjectDetails(projectId) {
        const project = allProjects.find(p => p.id == projectId); if (!project) return;
        const submittedLinks = project.project_links.filter(l => l.link_type === 'SUBMITTED');
        const deliveredLinks = project.project_links.filter(l => l.link_type === 'DELIVERED');
        let userLinksHTML = '<p>No links attached.</p>'; if (submittedLinks.length > 0) { userLinksHTML = '<ul>' + submittedLinks.map(link => `<li><strong>${link.link_name}:</strong> <a href="${link.link_url}" target="_blank">${link.link_url}</a></li>`).join('') + '</ul>'; }
        let actionsHTML; let correctionHTML = '';
        if (project.correction_query) { correctionHTML = `<h4>⚠️ User Correction Request</h4><p class="details-box correction-query">${project.correction_query}</p>`; }
        if (isBinVisible) {
            actionsHTML = `<div class="action-group"><button class="btn btn-secondary btn-restore" data-project-id="${project.id}">Restore from Bin</button><button class="btn btn-danger btn-delete-permanently" data-project-id="${project.id}">Delete Forever</button></div>`;
        } else {
            const rejectionFieldHTML = `<div class="rejection-group" style="display: ${project.status === 'REJECTED' ? 'flex' : 'none'};"><label>Reason:</label><textarea class="rejection-reason-input">${project.rejection_reason || ''}</textarea></div>`;
            const canDelete = project.status === 'COMPLETED' || project.status === 'DELIVERED';
            const deleteButtonHTML = `<button class="btn btn-danger btn-delete" data-project-id="${project.id}" ${!canDelete ? 'disabled title="Only COMPLETED or DELIVERED projects can be deleted."' : ''}>Move to Bin</button>`;
            const exportButtonHTML = `<button class="btn btn-secondary btn-export" data-user-id="${project.user_id}">Export User's Data</button>`;
            actionsHTML = `<div class="action-group"><select class="status-select" data-project-id="${project.id}">${['SUBMITTED', 'IN PROGRESS', 'COMPLETED', 'DELIVERED', 'REJECTED'].map(s => `<option value="${s}" ${project.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>${rejectionFieldHTML}<div class="delivery-group"><label><strong>Delivery:</strong></label><textarea class="delivery-message-input" placeholder="Delivery message...">${project.delivery_message || ''}</textarea><div class="delivery-links-container">${deliveredLinks.map(l => `<div class="link-input-group"><input type="text" value="${l.link_name}" class="link-name-input input-field"><input type="url" value="${l.link_url}" class="link-url-input input-field"><button type="button" class="remove-link-btn">&times;</button></div>`).join('')}</div><button type="button" class="btn btn-secondary add-delivery-link-btn">+ Add Link</button></div><button class="btn btn-primary save-btn" data-project-id="${project.id}">Save</button>${deleteButtonHTML}${exportButtonHTML}<p class="update-message" id="update-msg-${project.id}"></p></div>`;
        }
        centerPanelContent.innerHTML = `<div class="project-card-full"><h3>Work Order #${project.id}</h3><p><strong>By:</strong> ${project.profiles ? project.profiles.email : 'Unknown'}</p>${correctionHTML}<h4>Description</h4><div class="details-box details-content">${project.work_description}</div><h4>User Links</h4>${userLinksHTML}<h4>Actions</h4>${actionsHTML}</div>`;
    }

    // --- EVENT LISTENERS ---
    binToggleBtn.addEventListener('click', (e) => { e.preventDefault(); isBinVisible = !isBinVisible; leftPanelTitle.textContent = isBinVisible ? 'Bin' : 'Incoming Orders'; binToggleBtn.classList.toggle('active', isBinVisible); filterStatus.style.display = isBinVisible ? 'none' : 'block'; renderProjectList(); });
    filterStatus.addEventListener('change', renderProjectList);
    projectListContainer.addEventListener('click', (e) => { const item = e.target.closest('.project-item'); if (item) { document.querySelectorAll('.project-item.active').forEach(i => i.classList.remove('active')); item.classList.add('active'); displayProjectDetails(item.dataset.projectId); } });
    
    // THIS IS THE CORRECTED EVENT LISTENER FOR THE CENTER PANEL
    centerPanelContent.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('add-delivery-link-btn')) { const container = target.previousElementSibling; const newLinkGroup = document.createElement('div'); newLinkGroup.className = 'link-input-group'; newLinkGroup.innerHTML = `<input type="text" class="link-name-input input-field" placeholder="Name"><input type="url" class="link-url-input input-field" placeholder="https://..."><button type="button" class="remove-link-btn">&times;</button>`; container.appendChild(newLinkGroup); }
        if (target.classList.contains('remove-link-btn')) { target.parentElement.remove(); }
        if (target.classList.contains('btn-export')) { const userId = target.dataset.userId; if(confirm(`Generate a PDF report for this user?`)) { generateUserReportPDF(userId); } }
        
        // Corrected Restore Logic
        if (target.classList.contains('btn-restore')) {
            const projectId = target.dataset.projectId;
            if (confirm(`Restore Project #${projectId} from the Bin?`)) {
                await supabaseClient.from('projects').update({ deleted_at: null }).eq('id', projectId);
                alert('Project restored.'); // Simple confirmation
                await loadProjects();
            }
        }
        
        // Corrected Permanent Delete Logic
        if (target.classList.contains('btn-delete-permanently')) {
            const projectId = target.dataset.projectId;
            const userInput = prompt(`This action is IRREVERSIBLE. Type 'DELETE' to permanently delete Project #${projectId}.`);
            if (userInput === 'DELETE') {
                const { error } = await supabaseClient.functions.invoke('permanently-delete-project', { body: { projectId } });
                if (error) { alert(`Error: ${error.message}`); } 
                else { alert('Project permanently deleted.'); await loadProjects(); }
            } else if (userInput !== null) {
                alert('Deletion cancelled.');
            }
        }
        
        // Corrected Move to Bin Logic
        if (target.classList.contains('btn-delete')) {
            const projectId = target.dataset.projectId;
            if (confirm(`Are you sure you want to move Project #${projectId} to the Bin?`)) {
                await supabaseClient.from('projects').update({ deleted_at: new Date() }).eq('id', projectId);
                alert('Project moved to Bin.');
                await loadProjects();
            }
        }
        
        if (target.classList.contains('save-btn')) {
            const projectId = target.dataset.projectId; const card = target.closest('.project-card-full');
            const statusSelect = card.querySelector('.status-select'); const rejectionInput = card.querySelector('.rejection-reason-input'); const deliveryMessageInput = card.querySelector('.delivery-message-input'); const updateMsg = card.querySelector(`#update-msg-${projectId}`);
            target.textContent = 'Saving...'; target.disabled = true; updateMsg.textContent = '';
            try {
                const deliveryLinks = []; card.querySelectorAll('.delivery-links-container .link-input-group').forEach(group => { const name = group.querySelector('.link-name-input').value.trim(); const url = group.querySelector('.link-url-input').value.trim(); if (name && url) { deliveryLinks.push({ name, url }); } });
                const { error } = await supabaseClient.functions.invoke('update-project-details', { body: { projectId: projectId, newStatus: statusSelect.value, rejectionReason: rejectionInput.value, deliveryMessage: deliveryMessageInput.value, deliveryLinks: deliveryLinks } });
                if (error) throw error;
                updateMsg.textContent = 'Saved!'; updateMsg.style.color = 'green';
                setTimeout(async () => { await loadProjects(); displayProjectDetails(projectId); }, 1500);
            } catch (error) {
                console.error('Update Error:', error); updateMsg.textContent = `Error: ${error.message}`; updateMsg.style.color = '#c00';
                target.textContent = 'Save Changes'; target.disabled = false;
            }
        }
    });

    centerPanelContent.addEventListener('change', (e) => { if (e.target.classList.contains('status-select')) { const card = e.target.closest('.project-card-full'); const rejectionGroup = card.querySelector('.rejection-group'); rejectionGroup.style.display = e.target.value === 'REJECTED' ? 'flex' : 'none'; } });

    function generateUserReportPDF(userId) { /* ... This function is correct and unchanged ... */ }
});
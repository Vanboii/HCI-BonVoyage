document.addEventListener("DOMContentLoaded", () => {
    // Generate a random invite link on page load
    const inviteLink = `https://example.com/invite/${Math.random().toString(36).substring(2, 15)}`;
    document.getElementById('invite-link').value = inviteLink;
});

function sendInvite() {
    const emailInput = document.getElementById('email');
    const invitedTextarea = document.getElementById('invited');

    if (emailInput.value) {
        invitedTextarea.value += emailInput.value + '\n';
        emailInput.value = ''; // Clear the email input
    }
}

function copyInviteLink() {
    const inviteLinkInput = document.getElementById('invite-link');
    inviteLinkInput.select();
    document.execCommand("copy");
    alert("Invite link copied to clipboard!");
}

function nextPage() {
    // Implement navigation to the next page if needed
    alert("Next button clicked!");
}

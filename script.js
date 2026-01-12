// Add this to your global variables
const keywordSounds = {
    'hello': 'hello.mp3',
    'unlimited void': 'unlimited-void.mp3',
    'malevolent shrine': 'malevolent-shrine.mp3',
    
};

// Function to play sound
function playSound(keyword) {
    const soundFile = keywordSounds[keyword.toLowerCase()];
    
    if (soundFile) {
        const audio = new Audio(soundFile);
        audio.volume = 0.7;
        
        // Try to play
        audio.play().catch(error => {
            console.log('Audio play failed, trying fallback:', error);
            
            // Fallback: Create a simple sound
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Different frequencies for different keywords
                const frequencies = {
                    'chimera': 220,
                    'unlimited void': 440,
                    'malevolent shrine': 550,
                    'infinity': 660,
                    'domain': 330
                };
                
                const freq = frequencies[keyword.toLowerCase()] || 220;
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 1);
            } catch (e) {
                console.log('Fallback sound also failed:', e);
            }
        });
    }
}

// Update your typeKeyword function
window.typeKeyword = function(keyword) {
    // Play sound
    playSound(keyword);
    
    // Rest of your existing code
    typedDisplay = keyword;
    typingSequence = keyword.toLowerCase();
    updateTypingUI();
    
    const hint = document.getElementById('typing-hint');
    if (hint) {
        hint.innerHTML = `<i class="fas fa-volume-up" style="color:#ff00ff;"></i> ${keyword}`;
    }
    
    setTimeout(() => {
        if (domainSystem) {
            domainSystem.activateDomain(keyword);
        }
    }, 300);

};

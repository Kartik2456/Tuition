// The single source of truth for your Firebase version
const FIREBASE_VERSION = "10.12.2"; 

function injectFirebaseScript(service) {
    const script = document.createElement('script');
    // Injects the compat scripts automatically using the version above
    script.src = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-${service}-compat.js`;
    // Ensures scripts load in the correct sequential order (App -> Services)
    script.async = false; 
    document.head.appendChild(script);
}

// Automatically load the core app and libraries your dashboard needs
injectFirebaseScript('app');
injectFirebaseScript('auth');
injectFirebaseScript('firestore');

console.log(`Firebase Automation: Loaded version ${FIREBASE_VERSION} successfully.`);
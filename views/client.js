const publicVapidKey= 
'BDjcoMBooAZwU60UUipuA1d-tH2zoJ3J9WcWt3m3xKZ805mln188eQKQLTfR4TAE1kTGGliV-76EElCBGrFPvuM';

if ("serviceWorker" in navigator){
send().catch(err => console.error(err));
}
//Register Service worker,Register Push, Send Push
async function send(){
console.log('Register Service worker');
const register = await navigator.serviceWorker.register('/worker.js', {
scope: '/'
});
console.log('Service Worker registered');
const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVapidKey
});

}
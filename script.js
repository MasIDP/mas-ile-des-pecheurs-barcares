const OWNER_EMAIL = "mas680.iledespecheurs@gmail.com";
const OWNER_PHONE = "33679850406";

// Tarifs estimatifs, modifiables gratuitement ici
const PRICES = {
  low: 95,
  mid: 130,
  high: 175,
  cleaning: 60
};

const photos = [
  "images/terrasse-soir.jpg",
  "images/jardin-terrasse-jour.jpg",
  "images/salle-de-bain-douche.jpg",
  "images/piscine-toboggan.jpg",
  "images/salle-de-bain-miroir.jpg",
  "images/salle-de-bain-wc.jpg",
  "images/salon-tv.jpg",
  "images/portillon-mas.jpg",
  "images/chambre-lit-double.jpg",
  "images/piscine-residence.jpg",
  "images/cuisine-equipee.jpg",
  "images/piscine-soleil.jpg",
  "images/chambre-familiale.jpg",
  "images/entree-espace-aquatique.jpg",
  "images/exterieur-mas.jpg",
  "images/piece-de-vie-cuisine.jpg",
  "images/chambre-double.jpg",
  "images/deco-sejour.jpg",
  "images/exterieur-coucher-soleil.jpg",
  "images/salle-de-bain-vasque.jpg"
];

let currentPhoto = 0;

function seasonPrice(date){
  const month = date.getMonth() + 1;
  if(month === 7 || month === 8) return PRICES.high;
  if(month === 5 || month === 6 || month === 9) return PRICES.mid;
  return PRICES.low;
}

function calculateEstimate(){
  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;
  const estimate = document.getElementById("estimate");

  if(!arrival || !departure){
    estimate.textContent = "Sélectionnez vos dates";
    return;
  }

  const start = new Date(arrival);
  const end = new Date(departure);
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));

  if(nights <= 0){
    estimate.textContent = "Dates invalides";
    return;
  }

  let total = PRICES.cleaning;
  let d = new Date(start);

  for(let i = 0; i < nights; i++){
    total += seasonPrice(d);
    d.setDate(d.getDate() + 1);
  }

  estimate.textContent = `${total.toLocaleString("fr-FR")} € estimés · ${nights} nuit${nights > 1 ? "s" : ""}`;
}

function sendBooking(event){
  event.preventDefault();

  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;
  const guests = document.getElementById("guests").value;
  const phone = document.getElementById("phone").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const estimate = document.getElementById("estimate").textContent;

  const subject = encodeURIComponent("Demande de réservation - Mas sur l’Île des Pêcheurs");
  const body = encodeURIComponent(
`Bonjour,

Je souhaite faire une demande de réservation pour le Mas sur l’Île des Pêcheurs au Barcarès.

Nom : ${name}
E-mail : ${email}
Téléphone : ${phone}
Arrivée : ${arrival}
Départ : ${departure}
Voyageurs : ${guests}
Estimation affichée : ${estimate}

Message :
${message}

Merci.`
  );

  window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
}

function openLightbox(index){
  currentPhoto = index;
  document.getElementById("lightbox").classList.add("open");
  document.getElementById("lightbox").setAttribute("aria-hidden", "false");
  updateLightbox();
}

function closeLightbox(){
  document.getElementById("lightbox").classList.remove("open");
  document.getElementById("lightbox").setAttribute("aria-hidden", "true");
}

function changePhoto(direction){
  currentPhoto = (currentPhoto + direction + photos.length) % photos.length;
  updateLightbox();
}

function updateLightbox(){
  document.getElementById("lightbox-img").src = photos[currentPhoto];
  document.getElementById("lightbox-count").textContent = `${currentPhoto + 1} / ${photos.length}`;
}

document.addEventListener("keydown", (event) => {
  if(event.key === "Escape") closeLightbox();
  if(event.key === "ArrowRight") changePhoto(1);
  if(event.key === "ArrowLeft") changePhoto(-1);
});

document.getElementById("arrival").addEventListener("change", calculateEstimate);
document.getElementById("departure").addEventListener("change", calculateEstimate);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
